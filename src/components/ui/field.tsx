'use client'

import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type FieldProps = {
  /** Input'un id'si — label ve hata mesajı ilişkilendirmesi için zorunlu. */
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: (props: {
    id: string
    'aria-describedby': string | undefined
    invalid: boolean
  }) => React.ReactNode
}

/**
 * Form alanı sarmalayıcısı.
 * label ↔ input ↔ hata mesajı ilişkisini (aria-describedby) otomatik kurar.
 */
export function Field({ id, label, required, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only"> (zorunlu alan)</span>}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      )}

      {children({ id, 'aria-describedby': describedBy, invalid: Boolean(error) })}

      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

type CheckboxFieldProps = {
  id: string
  error?: string
  className?: string
  children: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'className' | 'children'>

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ id, error, className, children, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={errorId}
            className={cn(
              'mt-0.5 size-5 shrink-0 cursor-pointer rounded-xs border accent-brand-500',
              error ? 'border-danger' : 'border-line-strong',
            )}
            {...props}
          />
          <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-ink-muted">
            {children}
          </label>
        </div>
        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-danger">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            {error}
          </p>
        )}
      </div>
    )
  },
)
CheckboxField.displayName = 'CheckboxField'
