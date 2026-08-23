import { test, expect } from '@playwright/test'

test.describe('Site navigasyonu', () => {
  test('ana sayfa yüklenir ve temel bölümleri içerir', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /teklif al/i }).first()).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('hizmet detay sayfasına gidilebilir', async ({ page }) => {
    await page.goto('/hizmetler')

    const firstService = page.getByRole('link', { name: /detayları incele/i }).first()
    const serviceCardLink = (await firstService.count())
      ? firstService
      : page.locator('main a[href^="/hizmetler/"]').first()

    await serviceCardLink.click()
    await expect(page).toHaveURL(/\/hizmetler\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('bilinmeyen adres 404 sayfasını gösterir', async ({ page }) => {
    const response = await page.goto('/olmayan-bir-sayfa-12345')
    expect(response?.status()).toBe(404)
    await expect(page.getByText('404')).toBeVisible()
  })

  test('breadcrumb ile üst sayfaya dönülebilir', async ({ page }) => {
    await page.goto('/hizmetler/cam-cephe-temizligi')
    await page.getByRole('navigation', { name: 'Sayfa yolu' }).getByRole('link', { name: 'Hizmetler' }).click()
    await expect(page).toHaveURL(/\/hizmetler$/)
  })

  test('SEO temel etiketleri mevcut', async ({ page }) => {
    await page.goto('/hizmetler/cam-cephe-temizligi')

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('meta[name="description"]')).toHaveCount(1)
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0)
  })

  test('robots.txt ve sitemap.xml erişilebilir', async ({ request }) => {
    expect((await request.get('/robots.txt')).status()).toBe(200)

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    expect(await sitemap.text()).toContain('<urlset')
  })
})

test.describe('Mobil menü', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('hamburger menü açılır, gezinir ve kapanır', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Menüyü aç' }).click()
    const dialog = page.getByRole('dialog', { name: 'Mobil menü' })
    await expect(dialog).toBeVisible()

    // Not: "Blog" header menüsünden kaldırıldı; test artık üst seviye bir
    // menü öğesi olan SSS üzerinden gezinmeyi doğruluyor.
    await dialog.getByRole('link', { name: 'SSS', exact: true }).click()
    await expect(page).toHaveURL(/\/sss$/)
    await expect(dialog).toBeHidden()
  })

  test('mobil menüde teklif CTA görünür', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Menüyü aç' }).click()

    await expect(
      page.getByRole('dialog', { name: 'Mobil menü' }).getByRole('link', {
        name: /ücretsiz keşif talep et/i,
      }),
    ).toBeVisible()
  })
})
