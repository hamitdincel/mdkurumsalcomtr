import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Inbox, TrendingUp, Users, AlertTriangle } from 'lucide-react'
import { getLeadStats, listRecentLeads } from '@/repositories/lead-repository'
import { listServicesForAdmin } from '@/repositories/service-repository'
import { listProjectsForAdmin } from '@/repositories/project-repository'
import { listPostsForAdmin } from '@/repositories/post-repository'
import { getSettings } from '@/services/settings-service'
import { requireSession } from '@/lib/auth/guard'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { LeadStatusBadge } from '@/components/admin/lead-status-badge'
import { Button } from '@/components/ui/button'
import { databaseConfigured } from '@/lib/db/prisma'
import { formatRelative } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await requireSession()

  const [stats, recentLeads, services, projects, posts, settings] = await Promise.all([
    getLeadStats(),
    listRecentLeads(8),
    listServicesForAdmin(),
    listProjectsForAdmin(),
    listPostsForAdmin(),
    getSettings(),
  ])

  const publishedProjects = projects.filter((p) => p.published).length
  const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED').length

  // Yayın öncesi kontrol listesi — eksik gerçek veriler.
  const warnings: { label: string; href: string }[] = []
  if (settings.stats.length === 0)
    warnings.push({ label: 'İstatistikler girilmedi (ana sayfada bölüm gizli)', href: '/admin/settings' })
  if (!settings.logoLight) warnings.push({ label: 'Logo yüklenmedi', href: '/admin/settings' })
  if (settings.phone.includes('000')) warnings.push({ label: 'Telefon numarası güncellenmedi', href: '/admin/settings' })
  if (settings.email.includes('example.com'))
    warnings.push({ label: 'E-posta adresi güncellenmedi', href: '/admin/settings' })
  if (publishedProjects === 0)
    warnings.push({ label: 'Yayınlanmış proje yok (vaka çalışmaları bölümü gizli)', href: '/admin/projects' })

  return (
    <>
      <AdminPageHeader
        title={`Merhaba, ${session.name.split(' ')[0]}`}
        description="Teklif talepleri ve içerik durumuna genel bakış."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/leads">
              Talepleri Gör
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        }
      />

      <AdminContent className="flex flex-col gap-8">
        {!databaseConfigured && (
          <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning-soft p-4 text-sm text-warning">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <strong className="font-semibold">Veritabanı bağlantısı yok.</strong> DATABASE_URL
              tanımlanana kadar panel verileri boş görünecektir.
            </div>
          </div>
        )}

        {/* Metrikler */}
        <section aria-label="Talep metrikleri">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Bugün" value={stats.today} icon={<Inbox className="size-4" aria-hidden />} />
            <MetricCard label="Son 7 gün" value={stats.week} icon={<TrendingUp className="size-4" aria-hidden />} />
            <MetricCard label="Bu ay" value={stats.month} icon={<TrendingUp className="size-4" aria-hidden />} />
            <MetricCard
              label="Okunmamış"
              value={stats.unread}
              icon={<Users className="size-4" aria-hidden />}
            />
          </ul>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Son talepler */}
          <section aria-label="Son talepler" className="panel rounded-md">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink">Son talepler</h2>
              <Link href="/admin/leads" className="text-sm text-brand-600 hover:underline">
                Tümü
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-ink-subtle">
                Henüz teklif talebi bulunmuyor.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {recentLeads.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-sunken"
                    >
                      {!lead.isRead && (
                        <span className="size-2 shrink-0 rounded-full bg-brand-500" aria-label="Okunmadı" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {lead.fullName}
                          {lead.companyName && (
                            <span className="ml-2 font-normal text-ink-subtle">{lead.companyName}</span>
                          )}
                        </p>
                        <p className="truncate text-xs text-ink-subtle">
                          {[lead.city, lead.service?.title ?? lead.serviceLabel]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <LeadStatusBadge status={lead.status} />
                      <span className="hidden shrink-0 text-xs text-ink-subtle sm:block">
                        {formatRelative(lead.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex flex-col gap-6">
            {/* Kaynak dağılımı */}
            <section aria-label="Kaynak dağılımı" className="panel rounded-md p-5">
              <h2 className="mb-4 text-sm font-semibold text-ink">Talep kaynakları</h2>
              {stats.bySource.length === 0 ? (
                <p className="text-sm text-ink-subtle">Henüz kaynak verisi yok.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {stats.bySource.map((row) => {
                    const total = stats.total || 1
                    const percentage = Math.round((row._count._all / total) * 100)
                    return (
                      <li key={row.utmSource ?? 'dogrudan'} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-ink-muted">{row.utmSource ?? 'Doğrudan / bilinmiyor'}</span>
                          <span className="font-medium text-ink tabular-nums">{row._count._all}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                          <div className="h-full bg-brand-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            {/* İçerik durumu */}
            <section aria-label="İçerik durumu" className="panel rounded-md p-5">
              <h2 className="mb-4 text-sm font-semibold text-ink">İçerik durumu</h2>
              <ul className="flex flex-col gap-2.5 text-sm">
                <ContentRow label="Hizmet" value={services.length} href="/admin/services" />
                <ContentRow label="Yayında proje" value={publishedProjects} href="/admin/projects" />
                <ContentRow label="Yayında blog yazısı" value={publishedPosts} href="/admin/blog" />
              </ul>
            </section>
          </div>
        </div>

        {/* Yayın öncesi kontrol listesi */}
        {warnings.length > 0 && (
          <section
            aria-label="Yayın öncesi kontrol listesi"
            className="panel rounded-md p-5"
          >
            <h2 className="mb-1 text-sm font-semibold text-ink">Tamamlanması gerekenler</h2>
            <p className="mb-4 text-xs text-ink-subtle">
              Aşağıdaki alanlar doldurulmadığı sürece ilgili bölümler sitede gösterilmez —
              yer tutucu veya uydurma içerik üretilmez.
            </p>
            <ul className="flex flex-col gap-2">
              {warnings.map((warning) => (
                <li key={warning.label}>
                  <Link
                    href={warning.href}
                    className="flex items-center gap-2.5 rounded-sm border border-line px-3.5 py-2.5 text-sm text-ink-muted transition-colors hover:border-brand-500 hover:text-ink"
                  >
                    <AlertTriangle className="size-4 shrink-0 text-warning" aria-hidden />
                    <span className="flex-1">{warning.label}</span>
                    <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </AdminContent>
    </>
  )
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <li className="panel flex flex-col gap-2 rounded-md p-5">
      <span className="flex items-center gap-2 text-xs font-medium tracking-wide text-ink-subtle uppercase">
        {icon}
        {label}
      </span>
      {/*
        Metrikler aynı görsel ağırlıktadır. "Okunmamış" sayısı için ayrı bir
        renk kullanılmıyor — kritik bir durum değil, yalnızca bir sayı.
      */}
      <span className="font-display text-3xl font-semibold text-ink tabular-nums">
        {value}
      </span>
    </li>
  )
}

function ContentRow({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between hover:text-brand-600">
        <span className="text-ink-muted">{label}</span>
        <span className="font-medium text-ink tabular-nums">{value}</span>
      </Link>
    </li>
  )
}
