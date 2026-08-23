import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Download, Mail, MessageCircle, Phone } from 'lucide-react'
import { getLeadById, listAssignableUsers } from '@/repositories/lead-repository'
import { MarkLeadRead } from '@/components/admin/mark-lead-read'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { LeadStatusForm, LeadAssignForm, LeadNoteForm } from '@/components/admin/lead-forms'
import { LeadStatusBadge } from '@/components/admin/lead-status-badge'
import { whatsappUrl } from '@/config/site'
import { formatBytes, formatDateTime, formatNumber, toTelHref } from '@/lib/utils'

export const metadata: Metadata = { title: 'Talep Detayı' }
export const dynamic = 'force-dynamic'

const dirtLevelLabels: Record<string, string> = {
  LIGHT: 'Hafif — genel toz',
  MEDIUM: 'Orta — görünür kirlilik',
  HEAVY: 'Yoğun — is, yağ, yosun',
  UNKNOWN: 'Belirtilmedi',
}

const timeframeLabels: Record<string, string> = {
  URGENT: 'En kısa sürede',
  WITHIN_MONTH: '1 ay içinde',
  WITHIN_QUARTER: '1-3 ay içinde',
  PLANNING: 'Planlama aşamasında',
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLeadById(id)

  if (!lead) notFound()

  const users = await listAssignableUsers()

  const referenceNo = lead.id.slice(0, 8).toUpperCase()

  return (
    <>
      {/* Okundu işaretleme render sonrasına bırakılır (bkz. MarkLeadRead) */}
      <MarkLeadRead leadId={lead.id} isRead={lead.isRead} />

      <AdminPageHeader
        title={lead.fullName}
        description={`Talep No: ${referenceNo} · ${formatDateTime(lead.createdAt)}`}
        backHref="/admin/leads"
        backLabel="Tüm talepler"
        actions={<LeadStatusBadge status={lead.status} />}
      />

      <AdminContent className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="flex flex-col gap-6">
          {/* İletişim */}
          <Panel title="İletişim">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Ad Soyad" value={lead.fullName} />
              <Detail label="Firma" value={lead.companyName} />
              <Detail label="Telefon" value={lead.phone} />
              <Detail label="E-posta" value={lead.email} />
              <Detail label="Şehir" value={lead.city} />
            </dl>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
              <QuickAction href={`tel:${toTelHref(lead.phone)}`} icon={<Phone className="size-4" aria-hidden />}>
                Ara
              </QuickAction>
              <QuickAction
                href={whatsappUrl(
                  `Merhaba ${lead.fullName}, ${referenceNo} numaralı teklif talebiniz hakkında görüşmek istiyoruz.`,
                  lead.phone,
                )}
                icon={<MessageCircle className="size-4" aria-hidden />}
                external
              >
                WhatsApp
              </QuickAction>
              {lead.email && (
                <QuickAction
                  href={`mailto:${lead.email}?subject=${encodeURIComponent(`Teklif talebiniz — ${referenceNo}`)}`}
                  icon={<Mail className="size-4" aria-hidden />}
                >
                  E-posta
                </QuickAction>
              )}
            </div>
          </Panel>

          {/* Proje bilgileri */}
          <Panel title="Proje Bilgileri">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Hizmet" value={lead.service?.title ?? lead.serviceLabel} />
              <Detail label="Yapı türü" value={lead.buildingType} />
              <Detail
                label="Yüzey alanı"
                value={lead.estimatedArea ? `${formatNumber(lead.estimatedArea)} m²` : null}
              />
              <Detail label="Bina yüksekliği" value={lead.estimatedHeight ? `${lead.estimatedHeight} m` : null} />
              <Detail label="Kat sayısı" value={lead.floorCount ? String(lead.floorCount) : null} />
              <Detail label="Yüzey türü" value={lead.surfaceType} />
              <Detail label="Kirlilik" value={lead.dirtLevel ? dirtLevelLabels[lead.dirtLevel] : null} />
              <Detail label="Zaman aralığı" value={lead.timeframe ? timeframeLabels[lead.timeframe] : null} />
            </dl>

            {lead.message && (
              <div className="mt-5 border-t border-line pt-5">
                <p className="mb-2 text-xs tracking-wide text-ink-subtle uppercase">Açıklama</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">{lead.message}</p>
              </div>
            )}
          </Panel>

          {/* Dosyalar */}
          {lead.attachments.length > 0 && (
            <Panel title={`Ekler (${lead.attachments.length})`}>
              <ul className="flex flex-col gap-2">
                {lead.attachments.map((file) => (
                  <li key={file.id}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-sm border border-line px-3.5 py-2.5 text-sm transition-colors hover:border-brand-500"
                    >
                      <Download className="size-4 shrink-0 text-ink-subtle" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-ink">{file.filename}</span>
                      <span className="shrink-0 text-xs text-ink-subtle">{formatBytes(file.size)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Notlar */}
          <Panel title="Notlar">
            <LeadNoteForm leadId={lead.id} />

            {lead.notes.length > 0 && (
              <ul className="mt-6 flex flex-col gap-4 border-t border-line pt-6">
                {lead.notes.map((note) => (
                  <li key={note.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-ink-subtle">
                      <span className="font-medium text-ink-muted">{note.user?.name ?? 'Sistem'}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={note.createdAt.toISOString()}>
                        {formatDateTime(note.createdAt)}
                      </time>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">{note.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Yan panel */}
        <div className="flex flex-col gap-6">
          <Panel title="Durum">
            <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
          </Panel>

          <Panel title="Sorumlu">
            <LeadAssignForm
              leadId={lead.id}
              currentUserId={lead.assignedUserId}
              users={users}
            />
          </Panel>

          <Panel title="Kaynak ve İzin Bilgileri">
            <dl className="flex flex-col gap-3.5">
              <Detail label="Kaynak" value={lead.source} small />
              <Detail label="utm_source" value={lead.utmSource} small />
              <Detail label="utm_medium" value={lead.utmMedium} small />
              <Detail label="utm_campaign" value={lead.utmCampaign} small />
              <Detail label="Referrer" value={lead.referrer} small />
              <Detail label="Giriş sayfası" value={lead.landingPage} small />
              <Detail
                label="KVKK onayı"
                value={lead.kvkkConsent ? formatDateTime(lead.kvkkConsentAt) : 'Yok'}
                small
              />
              <Detail
                label="Pazarlama izni"
                value={lead.marketingOptIn ? 'Verildi' : 'Verilmedi'}
                small
              />
              <Detail label="Oluşturulma" value={formatDateTime(lead.createdAt)} small />
            </dl>

            <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-ink-subtle">
              IP adresi ham olarak saklanmaz; yalnızca kötüye kullanım denetimi için özetlenmiş
              (hash) değeri tutulur.
            </p>
          </Panel>
        </div>
      </AdminContent>
    </>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel rounded-md">
      <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold text-ink">{title}</h2>
      <div className="p-5">{children}</div>
    </section>
  )
}

function Detail({
  label,
  value,
  small,
}: {
  label: string
  value?: string | null
  small?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs tracking-wide text-ink-subtle uppercase">{label}</dt>
      <dd className={small ? 'text-sm break-words text-ink' : 'text-sm font-medium break-words text-ink'}>
        {value || '—'}
      </dd>
    </div>
  )
}

function QuickAction({
  href,
  icon,
  external,
  children,
}: {
  href: string
  icon: React.ReactNode
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-line px-3.5 text-sm font-medium text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
    >
      {icon}
      {children}
    </a>
  )
}
