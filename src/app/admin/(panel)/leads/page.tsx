import type { Metadata } from 'next'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { LeadStatus } from '@prisma/client'
import { listLeads, listAssignableUsers } from '@/repositories/lead-repository'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { LeadStatusBadge, leadStatusConfig, leadStatusOrder } from '@/components/admin/lead-status-badge'
import { ExportLeadsButton } from '@/components/admin/export-leads-button'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn, formatDateTime, formatNumber } from '@/lib/utils'

export const metadata: Metadata = { title: 'Teklif Talepleri' }
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  durum?: string
  ara?: string
  sorumlu?: string
  sayfa?: string
}>

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { durum, ara, sorumlu, sayfa } = await searchParams

  const status = (durum as LeadStatus | 'ALL' | undefined) ?? undefined
  const filters = {
    status,
    search: ara,
    assignedUserId: sorumlu,
    page: Math.max(1, Number(sayfa) || 1),
    pageSize: 25,
  }

  const [result, users] = await Promise.all([listLeads(filters), listAssignableUsers()])

  const buildHref = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { durum, ara, sorumlu, sayfa, ...next }
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value)
    }
    const query = params.toString()
    return query ? `/admin/leads?${query}` : '/admin/leads'
  }

  return (
    <>
      <AdminPageHeader
        title="Teklif Talepleri"
        description={`${formatNumber(result.total)} kayıt listeleniyor.`}
        actions={<ExportLeadsButton filters={{ status, search: ara, assignedUserId: sorumlu }} />}
      />

      <AdminContent className="flex flex-col gap-6">
        {/* Filtreler */}
        <div className="flex flex-col gap-4">
          <form action="/admin/leads" className="flex gap-2">
            {durum && <input type="hidden" name="durum" value={durum} />}
            <div className="relative flex-1 md:max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
                aria-hidden
              />
              <Input
                name="ara"
                defaultValue={ara}
                placeholder="Ad, firma, telefon, e-posta veya şehir"
                aria-label="Taleplerde ara"
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary">
              Ara
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <FilterTab href={buildHref({ durum: undefined, sayfa: undefined })} active={!durum}>
              Tümü
            </FilterTab>
            {leadStatusOrder.map((value) => (
              <FilterTab
                key={value}
                href={buildHref({ durum: value, sayfa: undefined })}
                active={durum === value}
              >
                {leadStatusConfig[value].label}
              </FilterTab>
            ))}
          </div>

          {users.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium tracking-wide text-ink-subtle uppercase">
                Sorumlu
              </span>
              <FilterTab href={buildHref({ sorumlu: undefined, sayfa: undefined })} active={!sorumlu}>
                Herkes
              </FilterTab>
              {users.map((user) => (
                <FilterTab
                  key={user.id}
                  href={buildHref({ sorumlu: user.id, sayfa: undefined })}
                  active={sorumlu === user.id}
                >
                  {user.name}
                </FilterTab>
              ))}
            </div>
          )}
        </div>

        {/* Liste */}
        {result.items.length === 0 ? (
          <div className="rounded-md border border-dashed border-line-strong p-14 text-center">
            <p className="text-sm text-ink-muted">Bu filtrelere uyan talep bulunamadı.</p>
          </div>
        ) : (
          <div className="overflow-x-auto panel rounded-md">
            <table className="w-full min-w-[52rem] text-sm">
              <thead className="border-b border-line bg-surface-sunken/60">
                <tr className="text-left text-xs tracking-wide text-ink-subtle uppercase">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Talep
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Hizmet
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Şehir
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Durum
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Sorumlu
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {result.items.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-surface-sunken/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="flex items-center gap-2.5">
                        {!lead.isRead && (
                          <span
                            className="size-2 shrink-0 rounded-full bg-brand-500"
                            aria-label="Okunmadı"
                          />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-ink">{lead.fullName}</span>
                          <span className="block truncate text-xs text-ink-subtle">
                            {[lead.companyName, lead.phone].filter(Boolean).join(' · ')}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {lead.service?.title ?? lead.serviceLabel ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{lead.city}</td>
                    <td className="px-4 py-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{lead.assignedUser?.name ?? '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-subtle">
                      {formatDateTime(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sayfalama */}
        {result.pageCount > 1 && (
          <nav aria-label="Sayfalama" className="flex justify-center gap-2">
            {Array.from({ length: result.pageCount }).map((_, index) => {
              const target = index + 1
              return (
                <Link
                  key={target}
                  href={buildHref({ sayfa: target === 1 ? undefined : String(target) })}
                  aria-current={target === result.page ? 'page' : undefined}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-sm border text-sm font-medium transition-colors',
                    target === result.page
                      ? 'border-ink bg-ink text-surface'
                      : 'border-line bg-surface-raised text-ink-muted hover:border-line-strong',
                  )}
                >
                  {target}
                </Link>
              )
            })}
          </nav>
        )}
      </AdminContent>
    </>
  )
}

function FilterTab({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-sm border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-ink bg-ink text-surface'
          : 'border-line bg-surface-raised text-ink-muted hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </Link>
  )
}
