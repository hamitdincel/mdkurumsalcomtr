import { test, expect } from '@playwright/test'

/**
 * Çerez onayı, analytics ID'leri tanımlıysa gösterilir. ID yoksa hiçbir
 * üçüncü taraf script'i yüklenmediği için banner da gösterilmez — bu davranış
 * bilinçlidir ve testte dikkate alınır.
 */
const analyticsEnabled = Boolean(
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GTM_ID ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID,
)

test.describe('Çerez onayı', () => {
  test.skip(!analyticsEnabled, 'Analytics yapılandırılmadığı için çerez bandı gösterilmez')

  test('banner ilk ziyarette görünür', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('dialog', { name: 'Çerez tercihleri' })).toBeVisible()
  })

  test('reddetme sonrası analytics çerezi yazılmaz', async ({ page, context }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /tümünü reddet/i }).click()

    const cookies = await context.cookies()
    const consent = cookies.find((cookie) => cookie.name === 'drone_consent')
    expect(consent).toBeTruthy()
    expect(decodeURIComponent(consent!.value)).toContain('"analytics":false')

    const gaCookie = cookies.find((cookie) => cookie.name.startsWith('_ga'))
    expect(gaCookie).toBeUndefined()
  })

  test('kabul sonrası tercih saklanır ve banner kaybolur', async ({ page, context }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /tümünü kabul et/i }).click()

    await expect(page.getByRole('dialog', { name: 'Çerez tercihleri' })).toBeHidden()

    const cookies = await context.cookies()
    const consent = cookies.find((cookie) => cookie.name === 'drone_consent')
    expect(decodeURIComponent(consent!.value)).toContain('"analytics":true')

    await page.reload()
    await expect(page.getByRole('dialog', { name: 'Çerez tercihleri' })).toBeHidden()
  })

  test('tercih penceresinden kategori seçilebilir', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /ayarları düzenle/i }).click()

    const dialog = page.getByRole('dialog').filter({ hasText: 'Çerez Tercihleri' })
    await expect(dialog).toBeVisible()

    // Zorunlu çerezler kapatılamaz.
    const necessary = dialog.getByRole('checkbox').first()
    await expect(necessary).toBeDisabled()
    await expect(necessary).toBeChecked()
  })
})
