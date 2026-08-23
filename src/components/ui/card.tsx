import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('relative transition-colors duration-200', {
  variants: {
    /*
     * SADELEŞTİRİLMİŞ VARYANT SETİ.
     * Kural: bir kart "kart olduğunu" TEK bir sinyalle anlatır — ince border.
     * Gölge yalnızca gerçekten üst katmanda duran öğelerde (overlay) kullanılır.
     * Hover'da kartı havaya kaldırma (translate + büyüyen gölge) kaldırıldı;
     * etkileşim geri bildirimi kenarlık rengiyle verilir.
     */
    variant: {
      /** Varsayılan: ince border, gölge yok */
      default: 'panel rounded-md',
      /** Etkileşimli kart — geri bildirim yalnızca kenarlıkta */
      elevated: 'panel rounded-md hover:border-line-strong',
      /** Koyu bölüm içi kart */
      inverse: 'border border-line-inverse bg-surface-inverse-raised rounded-md',
      /** Çerçevesiz — editorial/liste içerikleri kutulamaz */
      plain: 'bg-transparent',
      /** Uyarı / bilgi bloğu — zeminden girintili okunur */
      notice: 'border border-line bg-surface-sunken rounded-md',
      /** Marka tonlu kart — çok sınırlı kullanım (dönüşüm blokları) */
      accent: 'rounded-md border border-line bg-surface-tint',
      /** En üst katman: modal, popover, dropdown — gölge YALNIZCA burada */
      overlay: 'rounded-md border border-line bg-surface-overlay shadow-lg',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: 'hover:border-line-strong focus-within:border-brand-500',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: 'div' | 'article' | 'li' | 'section'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, as = 'div', ...props }, ref) => {
    // Polimorfik eleman: as prop'u ile div/article/li/section olarak render edilir.
    const Comp = as as React.ElementType
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive }), className)}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-xl font-semibold text-ink', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-base leading-relaxed text-ink-muted', className)} {...props} />
}
