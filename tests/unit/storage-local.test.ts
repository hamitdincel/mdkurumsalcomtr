import { describe, expect, it } from 'vitest'
import { join } from 'node:path'
import { localStorageRoot, mimeTypeForKey, resolveLocalPath } from '@/lib/storage/local'

describe('localStorageRoot', () => {
  it('varsayılan olarak public/ dışındaki data/uploads dizinini kullanır', () => {
    const root = localStorageRoot()
    expect(root).toBe(join(process.cwd(), 'data', 'uploads'))
    expect(root).not.toContain(`${join('', 'public')}`)
  })
})

describe('resolveLocalPath', () => {
  it('geçerli anahtarı kök dizinin altına çözer', () => {
    const key = 'icerik/202608/6cb04d51-bdb0-47e9-b71e-1b7f2f937bc7.png'
    expect(resolveLocalPath(key)).toBe(join(localStorageRoot(), key))
  })

  it.each([
    ['üst dizine çıkma', '../../etc/passwd'],
    ['ortada üst dizin', 'icerik/../../../etc/passwd'],
    ['ters bölü ile üst dizin', 'icerik\\..\\..\\etc\\passwd'],
    ['mutlak yol', '/etc/passwd'],
    ['boş anahtar', ''],
    ['null byte', 'icerik/dosya\0.png'],
  ])('%s reddedilir', (_label, key) => {
    expect(resolveLocalPath(key)).toBeNull()
  })
})

describe('mimeTypeForKey', () => {
  it('izin verilen uzantılar için içerik türü döner', () => {
    expect(mimeTypeForKey('a/b/c.png')).toBe('image/png')
    expect(mimeTypeForKey('a/b/c.JPG')).toBe('image/jpeg')
    expect(mimeTypeForKey('a/b/c.jpeg')).toBe('image/jpeg')
    expect(mimeTypeForKey('a/b/c.pdf')).toBe('application/pdf')
    expect(mimeTypeForKey('a/b/c.mp4')).toBe('video/mp4')
  })

  it('izin verilmeyen veya uzantısız dosyalar için null döner', () => {
    expect(mimeTypeForKey('a/b/c.html')).toBeNull()
    expect(mimeTypeForKey('a/b/c.js')).toBeNull()
    expect(mimeTypeForKey('a/b/c')).toBeNull()
  })
})
