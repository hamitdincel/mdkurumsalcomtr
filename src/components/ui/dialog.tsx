'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Radix Dialog focus trap, ESC ve scroll lock davranışını hazır sağlar. */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** Kapatma düğmesi için erişilebilir etiket */
    closeLabel?: string
  }
>(({ className, children, closeLabel = 'Kapat', ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim/60 backdrop-blur-sm data-[state=open]:animate-[fade-up_0.2s_ease-out]" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2',
        'max-h-[calc(100vh-4rem)] overflow-y-auto rounded-lg border border-line bg-surface-overlay p-6 shadow-xl',
        'data-[state=open]:animate-[fade-up_0.3s_var(--ease-out-expo)]',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm p-1.5 text-ink-subtle transition-colors hover:bg-surface-sunken hover:text-ink">
        <X className="size-5" aria-hidden />
        <span className="sr-only">{closeLabel}</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = 'DialogContent'
