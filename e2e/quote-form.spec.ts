import { test, expect, type Page } from '@playwright/test'

/**
 * Teklif formu akışı.
 *
 * NOT: Başarılı gönderim testi veritabanı gerektirir. DATABASE_URL tanımlı
 * değilse gönderim adımı atlanır; doğrulama ve adım geçişleri her koşulda
 * test edilir.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL)

/** Header'daki "Telefon: ..." bağlantısıyla karışmaması için alanlar id ile seçilir. */
const fullNameInput = 'input#fullName'
const phoneInput = 'input#phone'
const cityInput = 'input#city'
const messageInput = 'textarea#message'

/**
 * Formun hydrate olmasını bekler.
 * QuoteForm, mount olduğunda UTM verisini sessionStorage'a yazar; bu, client
 * tarafının gerçekten çalışır hale geldiğini gösteren kesin bir sinyaldir.
 * (Aksi halde hydration öncesi yapılan tıklamalar sessizce kaybolur.)
 */
async function waitForFormReady(page: Page) {
  await page.waitForFunction(() => window.sessionStorage.getItem('utm-data') !== null, null, {
    timeout: 20_000,
  })
}

/**
 * Form etkileşimlerini, olası yeniden render'lara karşı dayanıklı hale getirir:
 * eylem beklenen sonuç oluşana kadar tekrarlanır.
 */
async function clickUntil(page: Page, buttonName: string, expectedSelector: string) {
  await expect(async () => {
    await page.getByRole('button', { name: buttonName }).click()
    await expect(page.locator(expectedSelector)).toBeVisible({ timeout: 1500 })
  }).toPass({ timeout: 20_000 })
}

async function fillStepOne(page: Page, city: string) {
  await page.getByLabel(/hizmet türü/i).selectOption({ index: 1 })
  await page.locator(cityInput).fill(city)
  await clickUntil(page, 'Devam Et', fullNameInput)
}

async function fillStepTwo(page: Page, name: string, phone: string) {
  await page.locator(fullNameInput).fill(name)
  await page.locator(phoneInput).fill(phone)
  await clickUntil(page, 'Devam Et', messageInput)
}

test.describe('Teklif formu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teklif-al')
    await waitForFormReady(page)
  })

  test('zorunlu alanlar boşken ilk adımdan geçilemez', async ({ page }) => {
    await expect(async () => {
      await page.getByRole('button', { name: 'Devam Et' }).click()
      await expect(page.getByText('Hizmet türü seçiniz.')).toBeVisible({ timeout: 1500 })
    }).toPass({ timeout: 20_000 })

    await expect(page.getByText('Şehir zorunludur.')).toBeVisible()
    await expect(page.locator(fullNameInput)).toBeHidden()
  })

  test('üç adım sırayla tamamlanır', async ({ page }) => {
    await fillStepOne(page, 'İstanbul')
    await fillStepTwo(page, 'E2E Test Kullanıcı', '0532 123 45 67')

    await expect(page.getByRole('button', { name: /teklif talebini gönder/i })).toBeVisible()
  })

  test('geçersiz telefon numarası hata verir', async ({ page }) => {
    await fillStepOne(page, 'Ankara')

    await page.locator(fullNameInput).fill('Test Kullanıcı')
    await page.locator(phoneInput).fill('123')
    await page.getByRole('button', { name: 'Devam Et' }).click()

    await expect(page.getByText(/geçerli bir telefon numarası/i)).toBeVisible()
    await expect(page.locator(messageInput)).toBeHidden()
  })

  test('KVKK onayı olmadan gönderilemez', async ({ page }) => {
    await fillStepOne(page, 'İzmir')
    await fillStepTwo(page, 'Test Kullanıcı', '05321234567')

    await page.getByRole('button', { name: /teklif talebini gönder/i }).click()
    await expect(page.getByText(/aydınlatma metnini onaylamanız/i)).toBeVisible()
  })

  test('geri dönüldüğünde girilen değerler korunur', async ({ page }) => {
    await fillStepOne(page, 'Bursa')

    await page.locator(fullNameInput).fill('Değer Korunmalı')
    await clickUntil(page, 'Geri', cityInput)

    await expect(page.locator(cityInput)).toHaveValue('Bursa')

    await clickUntil(page, 'Devam Et', fullNameInput)
    await expect(page.locator(fullNameInput)).toHaveValue('Değer Korunmalı')
  })
})

/** Gönderim testi gerçek bir veritabanı bağlantısı gerektirir. */
test.describe('Teklif formu gönderimi', () => {
  test.skip(!hasDatabase, 'Veritabanı yapılandırılmamış')

  test('form gönderilir ve teşekkür ekranı görünür', async ({ page }) => {
    await page.goto('/teklif-al')
    await waitForFormReady(page)

    await fillStepOne(page, 'İstanbul')
    await fillStepTwo(page, 'E2E Test Kullanıcı', '05321234567')

    await page.locator(messageInput).fill('Playwright otomasyon testi.')
    await page.locator('input#kvkkConsent').check()
    await page.getByRole('button', { name: /teklif talebini gönder/i }).click()

    await expect(page.getByRole('heading', { name: /talebiniz bize ulaştı/i })).toBeVisible({
      timeout: 20_000,
    })
    await expect(page.getByText('Talep Referans No')).toBeVisible()
  })
})
