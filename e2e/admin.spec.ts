import path from 'node:path'
import { test, expect } from '@playwright/test'

/**
 * Yönetim paneli erişim ve giriş testleri.
 *
 * Oturumlu testler için E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD ortam
 * değişkenleri ve seed edilmiş bir admin kullanıcısı gerekir.
 *
 * NOT: Giriş uç noktasında IP başına hız sınırı vardır (brute-force koruması).
 * Bu nedenle oturum bir kez açılır ve `storageState` ile tüm testlerde
 * yeniden kullanılır — aksi halde test koşusu kendi korumamıza takılır.
 */
const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD
const storagePath = path.join(process.cwd(), 'test-results', 'admin-storage-state.json')

/**
 * Giriş uç noktası IP başına hız sınırına tabidir. Testlerin birbirini (ve
 * ardışık koşuların kendini) kilitlememesi için her senaryo kendi sanal
 * istemci IP'siyle çalışır. Böylece hız sınırı gerçekten test edilir ama
 * yanlış giriş denemeleri oturum açan testleri etkilemez.
 * (198.51.100.0/24 ve 203.0.113.0/24 belgeleme amaçlı ayrılmış bloklardır.)
 */
const SESSION_CLIENT_IP = '203.0.113.20'
const failedLoginIp = () => `198.51.100.${Math.floor(Math.random() * 250) + 1}`

test.describe('Yönetim paneli erişimi', () => {
  test('oturumsuz kullanıcı dashboard’a erişemez', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('korumalı alt sayfalar da yönlendirilir', async ({ page }) => {
    await page.goto('/admin/leads')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('/admin adresi login’e yönlendirilir', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/(login|dashboard)/)
  })

  test('giriş formu görünür ve alanları erişilebilir', async ({ page }) => {
    await page.goto('/admin/login')

    await expect(page.getByLabel(/e-posta/i)).toBeVisible()
    await expect(page.getByLabel(/parola/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /giriş yap/i })).toBeVisible()
  })

  test('hatalı bilgilerle giriş reddedilir', async ({ page }) => {
    // Her koşuda taze bir IP: hız sınırı sayacı diğer testlere taşmaz.
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': failedLoginIp() })
    await page.goto('/admin/login')

    await page.getByLabel(/e-posta/i).fill('yanlis@example.com')
    await page.getByLabel(/parola/i).fill('yanlisparola123')
    await page.getByRole('button', { name: /giriş yap/i }).click()

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 })
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('yönetim paneli arama motorlarına kapalıdır', async ({ page }) => {
    await page.goto('/admin/login')
    const robots = page.locator('meta[name="robots"]')
    await expect(robots).toHaveAttribute('content', /noindex/)
  })
})

/** Mobil görünümde sidebar yalnızca drawer açıldığında görünür olur. */
async function openSidebar(page: import('@playwright/test').Page, isMobile: boolean | undefined) {
  if (!isMobile) return
  await page.getByRole('button', { name: 'Menüyü aç' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

test.describe('Yönetim paneli oturumu', () => {
  test.skip(!adminEmail || !adminPassword, 'E2E admin kimlik bilgileri tanımlı değil')
  test.describe.configure({ mode: 'serial' })

  // Oturum bir kez açılır; sonraki testler cookie'yi yeniden kullanır.
  test.beforeAll(async ({ browser }) => {
    // Geliştirme sunucusu panel rotalarını ilk istekte derler; bu ilk giriş
    // ölçülü bir zaman aralığına ihtiyaç duyar.
    test.setTimeout(120_000)

    // storageState açıkça devre dışı: bu context oturumu ilk kez açan context'tir.
    const context = await browser.newContext({
      storageState: undefined,
      extraHTTPHeaders: { 'x-forwarded-for': SESSION_CLIENT_IP },
    })
    const page = await context.newPage()

    // Hydration tamamlanmadan yapılan tıklama kaybolabileceği için giriş,
    // panel açılana kadar tekrar denenir.
    await expect(async () => {
      await page.goto('/admin/login')
      await page.getByLabel(/e-posta/i).fill(adminEmail!)
      await page.getByLabel(/parola/i).fill(adminPassword!)
      await page.getByRole('button', { name: /giriş yap/i }).click()
      await page.waitForURL(/\/admin\/dashboard/, { timeout: 20_000 })
    }).toPass({ timeout: 90_000, intervals: [1000] })

    await context.storageState({ path: storagePath })
    await context.close()
  })

  test.use({
    storageState: storagePath,
    extraHTTPHeaders: { 'x-forwarded-for': SESSION_CLIENT_IP },
  })

  test('dashboard açılır ve panel menüsü erişilebilir', async ({ page, isMobile }) => {
    await page.goto('/admin/dashboard')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Masaüstünde sidebar sabit; mobilde drawer olarak açılır.
    await openSidebar(page, isMobile)
    await expect(page.getByRole('navigation', { name: 'Panel menüsü' }).last()).toBeVisible()
  })

  test('içerik listeleri açılır (temel CRUD erişimi)', async ({ page }) => {
    for (const url of ['/admin/services', '/admin/projects', '/admin/blog', '/admin/leads']) {
      await page.goto(url)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })

  test('yeni hizmet formu açılır', async ({ page }) => {
    await page.goto('/admin/services/yeni')

    await expect(page.getByLabel(/hizmet adı/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /hizmeti oluştur/i })).toBeVisible()
  })

  test('seed edilen hizmetler listede görünür', async ({ page }) => {
    await page.goto('/admin/services')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('link', { name: /cam cephe temizliği/i }).first()).toBeVisible()
  })

  /**
   * Regresyon koruması: talep detayı bir dönem render sırasında Server Action
   * çağırdığı için ("revalidatePath during render") hata sınırına düşüyordu.
   * Bu test sayfanın hatasız açıldığını ve JS hatası üretmediğini doğrular.
   */
  test('talep detayı hatasız açılır', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await page.goto('/admin/leads')

    const firstLead = page.locator('table a[href^="/admin/leads/"]').first()
    if ((await firstLead.count()) === 0) {
      test.skip(true, 'Veritabanında teklif talebi yok')
      return
    }

    await firstLead.click()
    await page.waitForURL(/\/admin\/leads\/[^/]+$/, { timeout: 20_000 })

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/talep no/i)).toBeVisible()
    await expect(page.getByText('Beklenmeyen bir sorun')).toBeHidden()

    // Okundu işaretleme mount sonrasında çalışır; hata üretmemeli.
    await page.waitForTimeout(1500)
    expect(pageErrors).toEqual([])
  })

  test('çıkış yapılabilir', async ({ page, isMobile }) => {
    await page.goto('/admin/dashboard')

    await openSidebar(page, isMobile)
    await page.getByRole('button', { name: /çıkış yap/i }).last().click()

    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
