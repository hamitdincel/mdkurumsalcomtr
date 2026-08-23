'use client'

import { useActionState } from 'react'
import { AlertCircle, LogIn } from 'lucide-react'
import { loginAction } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import type { ActionState } from '@/lib/validation/common'

const initialState: ActionState = { status: 'idle' }

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      {state.status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </div>
      )}

      {/*
        type="text" — type="email" olsaydı tarayıcının yerel doğrulaması
        "admin" gibi kullanıcı adlarını form gönderilmeden reddederdi.
        Doğrulama sunucuda (identifierSchema) yapılır.
      */}
      <Field id="email" label="Kullanıcı adı veya e-posta" required error={fieldErrors?.email}>
        {(props) => (
          <Input {...props} name="email" type="text" autoComplete="username" autoFocus required />
        )}
      </Field>

      <Field id="password" label="Parola" required error={fieldErrors?.password}>
        {(props) => (
          <Input {...props} name="password" type="password" autoComplete="current-password" required />
        )}
      </Field>

      <Button type="submit" full size="lg" loading={pending} disabled={pending}>
        <LogIn className="size-4" aria-hidden />
        Giriş Yap
      </Button>
    </form>
  )
}
