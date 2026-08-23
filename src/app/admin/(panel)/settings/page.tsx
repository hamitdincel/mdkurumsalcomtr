import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getRawSettings } from '@/services/settings-service'
import { requirePermission } from '@/lib/auth/guard'
import { AdminContent, AdminPageHeader } from '@/components/admin/page-header'
import { SettingsForm } from '@/components/admin/settings-form'

export const metadata: Metadata = { title: 'Site Ayarları' }
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  await requirePermission('*')
  const settings = await getRawSettings()

  return (
    <>
      <AdminPageHeader
        title="Site Ayarları"
        description="Marka bilgileri, iletişim, SEO varsayılanları, analytics ve ana sayfa içeriği."
        actions={
          <Link
            href="/admin/settings/redirects"
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
          >
            Yönlendirmeler
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        }
      />

      <AdminContent>
        <SettingsForm defaultValues={settings} />
      </AdminContent>
    </>
  )
}
