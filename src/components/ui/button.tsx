import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * CTA hiyerarşisi:
 *  primary   → sayfadaki tek ana eylem (Teklif Al / Keşif Talep Et)
 *  secondary → destekleyici eylem (Projeleri İncele)
 *  ghost     → düşük vurgulu (link benzeri)
 *  inverse   → koyu bölümler içindeki ana eylem
 */
const buttonVariants = cva(
  [
    'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden font-medium whitespace-nowrap',
    'transition-colors duration-150 active:scale-[0.99]',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:shrink-0 [&_svg]:size-[1.125em]',
    // Oklar hover'da hafifçe ilerler
    '[&_svg:last-child]:transition-transform [&_svg:last-child]:duration-200 hover:[&_svg:last-child]:translate-x-0.5',
  ].join(' '),
  {
    variants: {
      variant: {
        // Marka gölgesi token'dan türetilir; koyu temada accent parladığı için
        // aynı formül orada da doğru yoğunlukta kalır.
        // Marka renkli gölge (glow) kaldırıldı: dolgu rengi zaten yeterli
        // vurgu sağlıyor, ışıltı ekranda ikinci bir dikkat odağı üretiyordu.
        primary: 'bg-action text-on-action hover:bg-action-hover active:bg-action-active',
        secondary:
          'border border-line-strong bg-surface-raised text-ink hover:border-ink hover:bg-surface-sunken',
        ghost: 'text-ink hover:bg-surface-sunken',
        // YALNIZCA FOTOĞRAF/VİDEO ÜSTÜNDE kullanılır (hero, medya sayfa başlığı).
        // Bölüm yüzeyleri artık temayla döndüğü için orada primary/secondary
        // kullanılır; inverse bir açık yüzeyde görünmez olurdu.
        inverse:
          'bg-paper text-ink-on-paper hover:bg-ink-inverse-muted/20 hover:text-white border border-transparent hover:border-white/30',
        // inverse ile aynı kural: yalnızca fotoğraf/video üstünde.
        outlineInverse:
          'border border-line-on-dark text-ink-on-dark hover:border-white hover:bg-white/10',
        danger: 'bg-danger text-white hover:brightness-110',
        link: 'text-brand-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-9 rounded-sm px-3.5 text-sm',
        md: 'h-11 rounded-sm px-5 text-sm',
        lg: 'h-13 rounded-sm px-7 text-base',
        icon: 'size-11 rounded-sm',
        iconSm: 'size-9 rounded-sm',
      },
      full: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, full }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            <span>İşleniyor…</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
