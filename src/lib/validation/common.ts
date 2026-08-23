import { z } from 'zod'

/**
 * Türkiye cep/sabit telefon numarası doğrulaması.
 * Kullanıcıyı formatla kilitlemez — boşluk, parantez, tire ve +90 kabul edilir.
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Telefon numarası zorunludur.')
  .transform((value) => value.replace(/[\s()\-.]/g, ''))
  .refine(
    (value) => {
      const digits = value.replace(/\D/g, '')
      const national = digits.startsWith('90') ? digits.slice(2) : digits.replace(/^0/, '')
      return national.length === 10 && /^[2-5]/.test(national)
    },
    { message: 'Geçerli bir telefon numarası giriniz. Örn: 0532 123 45 67' },
  )

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Geçerli bir e-posta adresi giriniz.')

export const optionalEmailSchema = z
  .union([z.literal(''), emailSchema])
  .optional()
  .transform((value) => (value === '' ? undefined : value))

export const slugSchema = z
  .string()
  .trim()
  .min(2, 'Slug en az 2 karakter olmalıdır.')
  .max(120, 'Slug en fazla 120 karakter olabilir.')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug yalnızca küçük harf, rakam ve tire içerebilir.')

/** Boş string'i undefined'a çeviren opsiyonel metin alanı. */
export function optionalText(max = 500) {
  return z
    .string()
    .trim()
    .max(max, `En fazla ${max} karakter girebilirsiniz.`)
    .optional()
    .transform((value) => (value === '' ? undefined : value))
}

/** Form'dan string olarak gelen sayısal alanlar. */
export function optionalPositiveInt(max: number, label: string) {
  return z
    .union([z.literal(''), z.coerce.number()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? undefined : Number(value)))
    .refine((value) => value === undefined || (Number.isFinite(value) && value > 0 && value <= max), {
      message: `${label} 1 ile ${max} arasında olmalıdır.`,
    })
}

/** Checkbox alanları FormData'da "on" olarak gelir. */
export const checkboxSchema = z
  .union([z.boolean(), z.literal('on'), z.literal('true'), z.literal('false'), z.literal('')])
  .optional()
  .transform((value) => value === true || value === 'on' || value === 'true')

/** Server Action dönüş tipi — tüm formlar bu şekli kullanır. */
export type ActionState<T = undefined> =
  | { status: 'idle' }
  | { status: 'success'; message: string; data?: T }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> }

export const idleState: ActionState<never> = { status: 'idle' }

/** Zod hatasını alan bazlı sözlüğe çevirir. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (key && !result[key]) result[key] = issue.message
  }
  return result
}
