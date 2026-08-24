import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { Readable } from 'node:stream'
import type { NextRequest } from 'next/server'
import { mimeTypeForKey, resolveLocalPath } from '@/lib/storage/local'

/**
 * YEREL MEDYA SERVİSİ (STORAGE_DRIVER=local)
 * ---------------------------------------------------------------------------
 * Panelden yüklenen dosyalar public/ dışına yazılır (bkz. lib/storage/local.ts)
 * ve buradan servis edilir. Böylece dosya, sunucu yeniden başlatılmadan da
 * erişilebilir olur.
 *
 * Güvenlik: anahtar kök dizinin dışına çıkamaz ve yalnızca yüklemeye izin
 * verilen uzantılar servis edilir. Dosya adları UUID olduğu için içerik
 * değişmez; bu nedenle `immutable` cache kullanılır.
 */

const CACHE_CONTROL = 'public, max-age=31536000, immutable'

function toWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
  return Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>
}

/** `bytes=start-end` başlığını çözer. Geçersizse null. */
function parseRange(header: string, size: number): { start: number; end: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!match) return null

  const [, rawStart, rawEnd] = match
  if (!rawStart && !rawEnd) return null

  let start: number
  let end: number

  if (rawStart) {
    start = Number(rawStart)
    end = rawEnd ? Number(rawEnd) : size - 1
  } else {
    // Sondan N bayt: `bytes=-500`
    start = size - Number(rawEnd)
    end = size - 1
  }

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  if (start < 0 || start > end || start >= size) return null

  return { start, end: Math.min(end, size - 1) }
}

export async function GET(request: NextRequest, ctx: RouteContext<'/medya/[...yol]'>) {
  const { yol } = await ctx.params
  const key = yol.map((segment) => decodeURIComponent(segment)).join('/')

  const filePath = resolveLocalPath(key)
  const contentType = mimeTypeForKey(key)
  if (!filePath || !contentType) return new Response('Not Found', { status: 404 })

  let fileStat
  try {
    fileStat = await stat(filePath)
  } catch {
    return new Response('Not Found', { status: 404 })
  }
  if (!fileStat.isFile()) return new Response('Not Found', { status: 404 })

  const etag = `"${fileStat.size.toString(16)}-${Math.trunc(fileStat.mtimeMs).toString(16)}"`
  const baseHeaders = {
    'Content-Type': contentType,
    'Cache-Control': CACHE_CONTROL,
    'Accept-Ranges': 'bytes',
    ETag: etag,
  }

  if (request.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers: baseHeaders })
  }

  // Video oynatıcıları aralık isteği yapar; 206 dönmezse Safari oynatmaz.
  const rangeHeader = request.headers.get('range')
  if (rangeHeader) {
    const range = parseRange(rangeHeader, fileStat.size)

    if (!range) {
      return new Response(null, {
        status: 416,
        headers: { ...baseHeaders, 'Content-Range': `bytes */${fileStat.size}` },
      })
    }

    return new Response(toWebStream(createReadStream(filePath, range)), {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Length': String(range.end - range.start + 1),
        'Content-Range': `bytes ${range.start}-${range.end}/${fileStat.size}`,
      },
    })
  }

  return new Response(toWebStream(createReadStream(filePath)), {
    headers: { ...baseHeaders, 'Content-Length': String(fileStat.size) },
  })
}
