import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-12 w-full rounded-sm border bg-surface-raised px-3.5 text-base text-ink transition-colors',
        'placeholder:text-ink-subtle',
        'hover:border-line-strong focus:border-brand-500',
        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-sm border bg-surface-raised px-3.5 py-3 text-base text-ink transition-colors',
        'placeholder:text-ink-subtle',
        'hover:border-line-strong focus:border-brand-500',
        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean
}

/**
 * Native select — mobil cihazlarda en iyi UX'i ve erişilebilirliği sağlar.
 * Radix Select yalnızca zengin içerik gerektiğinde kullanılır.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'h-12 w-full appearance-none rounded-sm border bg-surface-raised px-3.5 pr-10 text-base text-ink transition-colors',
          'hover:border-line-strong focus:border-brand-500',
          'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60',
          invalid ? 'border-danger' : 'border-line',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-subtle"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ),
)
Select.displayName = 'Select'
