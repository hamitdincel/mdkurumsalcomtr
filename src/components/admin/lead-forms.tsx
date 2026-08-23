'use client'

import { useActionState } from 'react'
import type { LeadStatus } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Select, Textarea } from '@/components/ui/input'
import {
  addLeadNoteAction,
  assignLeadAction,
  updateLeadStatusAction,
} from '@/actions/lead-admin-actions'
import { leadStatusConfig, leadStatusOrder } from './lead-status-badge'
import type { ActionState } from '@/lib/validation/common'

const initialState: ActionState = { status: 'idle' }

function StatusMessage({ state }: { state: ActionState }) {
  if (state.status === 'idle') return null

  return (
    <p
      role="status"
      className={`mt-2 text-xs ${state.status === 'success' ? 'text-success' : 'text-danger'}`}
    >
      {state.message}
    </p>
  )
}

export function LeadStatusForm({
  leadId,
  currentStatus,
}: {
  leadId: string
  currentStatus: LeadStatus
}) {
  const [state, formAction, pending] = useActionState(updateLeadStatusAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="leadId" value={leadId} />

      <label htmlFor="lead-status" className="sr-only">
        Talep durumu
      </label>
      <Select id="lead-status" name="status" defaultValue={currentStatus}>
        {leadStatusOrder.map((value) => (
          <option key={value} value={value}>
            {leadStatusConfig[value].label}
          </option>
        ))}
      </Select>

      <Button type="submit" size="sm" loading={pending} disabled={pending}>
        Durumu Güncelle
      </Button>

      <StatusMessage state={state} />
    </form>
  )
}

export function LeadAssignForm({
  leadId,
  currentUserId,
  users,
}: {
  leadId: string
  currentUserId: string | null
  users: { id: string; name: string }[]
}) {
  const [state, formAction, pending] = useActionState(assignLeadAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="leadId" value={leadId} />

      <label htmlFor="lead-assignee" className="sr-only">
        Sorumlu kullanıcı
      </label>
      <Select id="lead-assignee" name="userId" defaultValue={currentUserId ?? ''}>
        <option value="">Atanmadı</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </Select>

      <Button type="submit" size="sm" variant="secondary" loading={pending} disabled={pending}>
        Sorumluyu Kaydet
      </Button>

      <StatusMessage state={state} />
    </form>
  )
}

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const [state, formAction, pending] = useActionState(addLeadNoteAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="leadId" value={leadId} />

      <label htmlFor="lead-note" className="sr-only">
        Not
      </label>
      <Textarea
        id="lead-note"
        name="body"
        rows={3}
        required
        placeholder="Görüşme notu, keşif tarihi veya iç bilgi ekleyin…"
        key={state.status === 'success' ? 'reset' : 'stable'}
      />

      <Button type="submit" size="sm" loading={pending} disabled={pending} className="self-start">
        Not Ekle
      </Button>

      <StatusMessage state={state} />
    </form>
  )
}
