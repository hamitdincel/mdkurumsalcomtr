'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { markLeadReadAction } from '@/actions/lead-admin-actions'

/**
 * Talep detayı açıldığında kaydı "okundu" olarak işaretler.
 *
 * Neden client component: Server Action içinde revalidatePath çağrılıyor ve
 * Next.js bunu SAYFA RENDER'I SIRASINDA yasaklıyor ("used revalidatePath
 * during render which is unsupported"). İşaretleme bu yüzden render sonrasına,
 * yani mount anına taşındı.
 *
 * Ayrıca render'ın yan etkisiz kalması doğru davranıştır: sayfayı görüntülemek
 * (GET) veri yazmamalı; yazma işlemi kullanıcının sayfayı gerçekten açmasıyla
 * tetiklenir.
 */
export function MarkLeadRead({ leadId, isRead }: { leadId: string; isRead: boolean }) {
  const router = useRouter()
  const handled = React.useRef(false)

  React.useEffect(() => {
    if (isRead || handled.current) return
    handled.current = true

    void markLeadReadAction(leadId).then(() => {
      // Sidebar'daki okunmamış talep sayacının güncellenmesi için.
      router.refresh()
    })
  }, [leadId, isRead, router])

  return null
}
