import DOMPurify from 'isomorphic-dompurify'

/**
 * Editörden gelen HTML içeriğini temizler.
 * Admin kullanıcıları güvenilir kabul edilse dahi, hesap ele geçirilmesi
 * durumunda stored-XSS oluşmaması için sanitization zorunludur.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
      'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'span',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'class'],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/)/i,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'style'],
  })
}

/** Görünmez kontrol karakterleri (satır sonları ve tab hariç). */
const CONTROL_CHARS = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g')

/** Kullanıcı girdisinden gelen düz metni normalize eder. */
export function sanitizeText(input: string): string {
  return input.replace(CONTROL_CHARS, '').replace(/\s+/g, ' ').trim()
}

/** Çok satırlı metin (mesaj alanı) — satır sonları korunur. */
export function sanitizeMultiline(input: string): string {
  return input
    .replace(CONTROL_CHARS, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
