import { AlertTriangle } from 'lucide-react'
import { Container, Section } from './section'
import { Breadcrumb, type Crumb } from './breadcrumb'
import { siteConfig } from '@/config/site'

/**
 * Hukuki metin sayfası kabuğu.
 *
 * ÖNEMLİ: Bu metinler TASLAKTIR. Gerçek şirket bilgileri girilmeden ve bir
 * hukuk danışmanı tarafından onaylanmadan yayına alınmamalıdır. Sayfa
 * üzerindeki uyarı bandı, gerçek şirket unvanı site config'e girildiğinde
 * otomatik olarak kaybolur.
 */
export function LegalPage({
  title,
  updatedAt,
  crumbs,
  children,
}: {
  title: string
  updatedAt: string
  crumbs: Crumb[]
  children: React.ReactNode
}) {
  const isDraft = siteConfig.legalName.startsWith('TODO')

  return (
    <>
      <Section spacing="sm" tone="light" className="border-b border-line">
        <Container className="max-w-4xl">
          <Breadcrumb items={crumbs} className="mb-6" />
          <h1 className="text-3xl font-bold text-ink md:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-ink-subtle">Son güncelleme: {updatedAt}</p>
        </Container>
      </Section>

      <Section spacing="md" tone="light">
        <Container className="max-w-4xl">
          {isDraft && (
            <div
              role="note"
              className="mb-10 flex items-start gap-3 rounded-md border border-warning/30 bg-warning-soft p-5 text-sm leading-relaxed text-warning"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div>
                <strong className="font-semibold">Taslak metin.</strong> Bu sayfa, yayın öncesi
                gerçek şirket bilgileriyle tamamlanmak ve hukuk danışmanı tarafından onaylanmak
                üzere hazırlanmış bir şablondur. Yürürlükteki mevzuat ve şirketin fiili veri işleme
                faaliyetleriyle uyumu kontrol edilmelidir.
              </div>
            </div>
          )}

          <div className="prose-site max-w-none">{children}</div>
        </Container>
      </Section>
    </>
  )
}
