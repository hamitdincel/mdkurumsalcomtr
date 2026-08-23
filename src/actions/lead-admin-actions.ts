'use server'

import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import { checkPermission } from '@/lib/auth/guard'
import { leadAssignSchema, leadNoteSchema, leadStatusSchema } from '@/lib/validation/lead'
import { toFieldErrors, type ActionState } from '@/lib/validation/common'
import { sanitizeMultiline } from '@/lib/security/sanitize'
import { listLeadsForExport, type LeadListFilters } from '@/repositories/lead-repository'
import { leadsToCsv } from '@/services/lead-service'

/** Lead durumunu günceller (satış hunisi). */
export async function updateLeadStatusAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await checkPermission('lead:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const parsed = leadStatusSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return { status: 'error', message: 'Geçersiz durum.', fieldErrors: toFieldErrors(parsed.error) }
  }

  await prisma.lead.update({
    where: { id: parsed.data.leadId },
    data: { status: parsed.data.status, isRead: true },
  })

  await writeAudit(auth.user.id, 'UPDATE', 'Lead', parsed.data.leadId, {
    status: parsed.data.status,
  })

  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${parsed.data.leadId}`)

  return { status: 'success', message: 'Durum güncellendi.' }
}

/** Lead'e not ekler. */
export async function addLeadNoteAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await checkPermission('lead:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const parsed = leadNoteSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Not kaydedilemedi.',
      fieldErrors: toFieldErrors(parsed.error),
    }
  }

  await prisma.leadNote.create({
    data: {
      leadId: parsed.data.leadId,
      userId: auth.user.id,
      body: sanitizeMultiline(parsed.data.body),
    },
  })

  revalidatePath(`/admin/leads/${parsed.data.leadId}`)
  return { status: 'success', message: 'Not eklendi.' }
}

/** Lead'e sorumlu kullanıcı atar. */
export async function assignLeadAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await checkPermission('lead:write')
  if (!auth.ok) return { status: 'error', message: auth.error }

  const raw = Object.fromEntries(formData.entries())
  const parsed = leadAssignSchema.safeParse({
    leadId: raw.leadId,
    userId: raw.userId === '' ? null : raw.userId,
  })

  if (!parsed.success) {
    return { status: 'error', message: 'Atama yapılamadı.' }
  }

  await prisma.lead.update({
    where: { id: parsed.data.leadId },
    data: { assignedUserId: parsed.data.userId },
  })

  await writeAudit(auth.user.id, 'UPDATE', 'Lead', parsed.data.leadId, {
    assignedUserId: parsed.data.userId,
  })

  revalidatePath(`/admin/leads/${parsed.data.leadId}`)
  return { status: 'success', message: 'Sorumlu güncellendi.' }
}

/**
 * Lead'i okundu olarak işaretler.
 *
 * ÖNEMLİ: Bu action sayfa render'ı sırasında ÇAĞRILMAZ — içindeki
 * revalidatePath render aşamasında desteklenmez. Çağrı, detay sayfasındaki
 * MarkLeadRead client bileşeninden mount sonrasında yapılır.
 */
export async function markLeadReadAction(leadId: string): Promise<void> {
  const auth = await checkPermission('lead:read')
  if (!auth.ok) return

  const lead = await prisma.lead
    .findUnique({ where: { id: leadId }, select: { isRead: true } })
    .catch(() => null)

  if (!lead || lead.isRead) return

  await prisma.lead
    .update({ where: { id: leadId }, data: { isRead: true } })
    .catch((error) => {
      console.error('[lead] Okundu işaretlenemedi:', error)
    })

  // Liste ve panel kabuğundaki okunmamış sayacı güncellenir.
  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${leadId}`)
}

/** CSV dışa aktarım — dosya içeriği string olarak döner, indirme client'ta yapılır. */
export async function exportLeadsAction(
  filters: LeadListFilters,
): Promise<{ ok: true; csv: string; filename: string } | { ok: false; error: string }> {
  const auth = await checkPermission('lead:read')
  if (!auth.ok) return { ok: false, error: auth.error }

  const leads = await listLeadsForExport(filters)
  const csv = leadsToCsv(leads)
  const stamp = new Date().toISOString().slice(0, 10)

  return { ok: true, csv, filename: `teklif-talepleri-${stamp}.csv` }
}

async function writeAudit(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  metadata?: Prisma.InputJsonValue,
): Promise<void> {
  await prisma.auditLog
    .create({ data: { userId, action, entity, entityId, metadata: metadata ?? {} } })
    .catch(() => undefined)
}
