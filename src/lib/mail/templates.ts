import { siteConfig, absoluteUrl } from '@/config/site'
import { formatDateTime, formatNumber } from '@/lib/utils'

/** E-posta istemcilerinde güvenli, tablo tabanlı basit bir düzen. */
function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0d1114;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #dde1e5;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="padding:24px 28px;border-bottom:1px solid #dde1e5;">
            <span style="font-size:16px;font-weight:600;letter-spacing:-0.01em;">${escapeHtml(siteConfig.name)}</span>
          </td>
        </tr>
        <tr><td style="padding:28px;">${bodyHtml}</td></tr>
        <tr>
          <td style="padding:20px 28px;border-top:1px solid #dde1e5;background:#f6f7f8;font-size:12px;color:#6b767f;">
            Bu e-posta ${escapeHtml(siteConfig.url)} üzerinden oluşturulmuştur.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #eceef0;font-size:13px;color:#6b767f;width:40%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eceef0;font-size:14px;color:#0d1114;">${escapeHtml(String(value))}</td>
  </tr>`
}

export type LeadMailData = {
  id: string
  fullName: string
  companyName?: string | null
  phone: string
  email?: string | null
  city: string
  serviceLabel?: string | null
  buildingType?: string | null
  estimatedArea?: number | null
  estimatedHeight?: number | null
  floorCount?: number | null
  surfaceType?: string | null
  dirtLevel?: string | null
  timeframe?: string | null
  message?: string | null
  attachmentCount: number
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  referrer?: string | null
  createdAt: Date
}

const dirtLevelLabels: Record<string, string> = {
  LIGHT: 'Hafif',
  MEDIUM: 'Orta',
  HEAVY: 'Yoğun',
  UNKNOWN: 'Belirtilmedi',
}

const timeframeLabels: Record<string, string> = {
  URGENT: 'En kısa sürede',
  WITHIN_MONTH: '1 ay içinde',
  WITHIN_QUARTER: '1-3 ay içinde',
  PLANNING: 'Planlama aşamasında',
}

/** Yöneticiye giden bildirim maili. */
export function adminLeadNotification(lead: LeadMailData) {
  const subject = `Yeni teklif talebi — ${lead.fullName}${lead.companyName ? ` (${lead.companyName})` : ''}`

  const html = layout(
    subject,
    `<h1 style="margin:0 0 6px;font-size:20px;">Yeni teklif talebi</h1>
     <p style="margin:0 0 20px;font-size:14px;color:#4a545c;">Talep No: <strong>${escapeHtml(lead.id.slice(0, 8).toUpperCase())}</strong> · ${escapeHtml(formatDateTime(lead.createdAt))}</p>

     <h2 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#6b767f;">İletişim</h2>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       ${row('Ad Soyad', lead.fullName)}
       ${row('Firma', lead.companyName)}
       ${row('Telefon', lead.phone)}
       ${row('E-posta', lead.email)}
       ${row('Şehir', lead.city)}
     </table>

     <h2 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#6b767f;">Proje Bilgileri</h2>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       ${row('Hizmet', lead.serviceLabel)}
       ${row('Yapı türü', lead.buildingType)}
       ${row('Yüzey alanı', lead.estimatedArea ? `${formatNumber(lead.estimatedArea)} m²` : null)}
       ${row('Bina yüksekliği', lead.estimatedHeight ? `${lead.estimatedHeight} m` : null)}
       ${row('Kat sayısı', lead.floorCount)}
       ${row('Yüzey türü', lead.surfaceType)}
       ${row('Kirlilik', lead.dirtLevel ? dirtLevelLabels[lead.dirtLevel] : null)}
       ${row('Zaman aralığı', lead.timeframe ? timeframeLabels[lead.timeframe] : null)}
       ${row('Ek dosya', lead.attachmentCount > 0 ? `${lead.attachmentCount} adet` : null)}
     </table>

     ${
       lead.message
         ? `<h2 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#6b767f;">Açıklama</h2>
            <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(lead.message)}</p>`
         : ''
     }

     ${
       lead.utmSource || lead.referrer
         ? `<h2 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#6b767f;">Kaynak</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('utm_source', lead.utmSource)}
              ${row('utm_medium', lead.utmMedium)}
              ${row('utm_campaign', lead.utmCampaign)}
              ${row('Referrer', lead.referrer)}
            </table>`
         : ''
     }

     <p style="margin:28px 0 0;">
       <a href="${absoluteUrl(`/admin/leads/${lead.id}`)}" style="display:inline-block;background:#1155f0;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:4px;font-size:14px;font-weight:500;">Yönetim panelinde aç</a>
     </p>`,
  )

  const text = [
    `Yeni teklif talebi — ${lead.fullName}`,
    `Talep No: ${lead.id.slice(0, 8).toUpperCase()}`,
    `Tarih: ${formatDateTime(lead.createdAt)}`,
    '',
    `Firma: ${lead.companyName ?? '-'}`,
    `Telefon: ${lead.phone}`,
    `E-posta: ${lead.email ?? '-'}`,
    `Şehir: ${lead.city}`,
    `Hizmet: ${lead.serviceLabel ?? '-'}`,
    `Yapı türü: ${lead.buildingType ?? '-'}`,
    `Alan: ${lead.estimatedArea ? `${lead.estimatedArea} m²` : '-'}`,
    `Yüzey: ${lead.surfaceType ?? '-'}`,
    '',
    lead.message ?? '',
    '',
    absoluteUrl(`/admin/leads/${lead.id}`),
  ].join('\n')

  return { subject, html, text }
}

/** Müşteriye giden otomatik teşekkür maili. */
export function customerConfirmation(lead: { id: string; fullName: string }) {
  const referenceNo = lead.id.slice(0, 8).toUpperCase()
  const subject = `Talebiniz alındı — Referans No: ${referenceNo}`

  const html = layout(
    subject,
    `<h1 style="margin:0 0 12px;font-size:20px;">Talebiniz bize ulaştı</h1>
     <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a545c;">
       Sayın ${escapeHtml(lead.fullName)},<br><br>
       Teklif talebiniz tarafımıza ulaştı. Ekibimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecek.
     </p>
     <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a545c;">
       Talebiniz için referans numaranız: <strong style="color:#0d1114;">${escapeHtml(referenceNo)}</strong>
     </p>
     <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4a545c;">
       Doğru bir teklif hazırlayabilmemiz için yapının yerinde değerlendirilmesi gerekebilir. Görüşmemizde
       keşif için uygun bir zaman belirleyeceğiz.
     </p>
     <p style="margin:24px 0 0;font-size:14px;color:#6b767f;">
       Acil bir durum için bize doğrudan ulaşabilirsiniz:<br>
       ${escapeHtml(siteConfig.contact.phone)}
     </p>`,
  )

  const text = [
    `Sayın ${lead.fullName},`,
    '',
    'Teklif talebiniz tarafımıza ulaştı. Ekibimiz en kısa sürede sizinle iletişime geçecektir.',
    `Referans No: ${referenceNo}`,
    '',
    `İletişim: ${siteConfig.contact.phone}`,
    siteConfig.url,
  ].join('\n')

  return { subject, html, text }
}

/** İletişim formu bildirimi. */
export function contactNotification(data: {
  fullName: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  createdAt: Date
}) {
  const subject = `İletişim formu — ${data.fullName}`

  const html = layout(
    subject,
    `<h1 style="margin:0 0 6px;font-size:20px;">İletişim formu mesajı</h1>
     <p style="margin:0 0 20px;font-size:13px;color:#6b767f;">${escapeHtml(formatDateTime(data.createdAt))}</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       ${row('Ad Soyad', data.fullName)}
       ${row('E-posta', data.email)}
       ${row('Telefon', data.phone)}
       ${row('Konu', data.subject)}
     </table>
     <p style="margin:20px 0 0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>`,
  )

  const text = `${data.fullName} <${data.email}>\n${data.phone ?? ''}\n\n${data.message}`

  return { subject, html, text }
}
