/**
 * JSON-LD script enjeksiyonu.
 * İçerik sunucuda üretildiği ve JSON.stringify ile serialize edildiği için
 * XSS riski taşımaz; yine de `<` karakteri kaçırılır.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = Array.isArray(data) ? data : [data]

  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
