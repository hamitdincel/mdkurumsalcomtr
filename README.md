# Drone Temizlik — Kurumsal Web Sitesi

Drone destekli dış cephe, cam, güneş paneli, çatı ve endüstriyel yüzey temizliği
hizmeti veren şirketler için geliştirilmiş; dönüşüm odaklı kurumsal web sitesi ve
yönetim paneli.

**Öncelik sırası:** güven ve dönüşüm → performans → SEO → yönetilebilirlik →
görsel kalite → animasyon.

---

## İçindekiler

1. [Teknoloji mimarisi](#teknoloji-mimarisi)
2. [Hızlı başlangıç](#hızlı-başlangıç)
3. [Ortam değişkenleri](#ortam-değişkenleri)
4. [Klasör yapısı](#klasör-yapısı)
5. [İçerik yönetimi](#içerik-yönetimi)
6. [Görseller](#görseller)
7. [Yayına alma kontrol listesi](#yayına-alma-kontrol-listesi)
7. [Deployment](#deployment)
8. [Testler](#testler)
9. [İçerik ve dürüstlük kuralları](#içerik-ve-dürüstlük-kuralları)

---

## Teknoloji mimarisi

| Katman | Seçim | Gerekçe |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Server Components ile minimum client JS, ISR, dosya bazlı routing, yerleşik SEO API'leri |
| Dil | TypeScript (strict + `noUncheckedIndexedAccess`) | Çalışma zamanı hatalarını derleme zamanına çekmek |
| Stil | Tailwind CSS v4 (`@theme` token'ları) | Tek kaynaktan tasarım sistemi; bileşenlerde ham renk kullanılmaz |
| Bileşen temeli | Radix UI primitive'leri | Erişilebilirlik (focus trap, klavye, ARIA) hazır gelir |
| Form | React Hook Form + Zod | Aynı şema hem client hem server tarafında çalışır |
| Veritabanı | PostgreSQL + Prisma | İlişkisel içerik modeli, tip güvenli sorgular, migration yönetimi |
| Backend | Server Actions | Ayrı API katmanı gerektirmeden server-first akış |
| Auth | Argon2id + `jose` (JWT, httpOnly cookie) | Harici auth servisi bağımlılığı olmadan güvenli admin oturumu |
| Depolama | S3 uyumlu (Cloudflare R2 / AWS S3) | Görsel ve ek dosyaları uygulama sunucusundan ayırmak |
| E-posta | Resend veya SMTP | Sağlayıcı bağımsız; sürücü env ile değiştirilir |
| Bot koruması | Cloudflare Turnstile + honeypot + rate limit | Üç katmanlı, çerezsiz koruma |

**Neden ayrı backend framework yok:** Site tek bir Next.js uygulaması olarak
çalışır. Server Components ve Server Actions ile veri erişimi ve mutasyonlar aynı
projede yürütülür; ayrı bir API sunucusu bakım maliyeti dışında bir fayda
sağlamayacaktı.

### Mimari prensipler

- Public sayfaların tamamı **Server Component**'tir. Client bileşenleri yalnızca
  gerçek etkileşim gereken küçük parçalardır (header menüsü, form, slider,
  hotspot'lar, çerez bandı).
- Veri erişimi katmanlıdır: `app/` → `services/` → `repositories/` → Prisma.
  Sayfalar Prisma'yı doğrudan çağırmaz.
- Tüm form girdileri **server tarafında yeniden doğrulanır**; client doğrulaması
  bir güvenlik sınırı değildir.
- Veritabanı erişilemediğinde site çökmez: `safeQuery` sarmalayıcısı hatayı
  loglar ve statik yedek içerikle devam eder (build DB olmadan da geçer).
- Admin route'ları hem `proxy.ts` (edge) hem de layout içinde (sunucu) olmak
  üzere iki katmanda korunur.

---

## Hızlı başlangıç

```bash
# 1) Bağımlılıklar
npm install

# 2) Ortam değişkenleri
cp .env.example .env
#   AUTH_SECRET üretin:  openssl rand -base64 48

# 3) Veritabanı (yerel geliştirme)
docker compose up -d db   # PostgreSQL 5433 portunda açılır (5432 ile çakışmaması için)
npm run db:migrate        # ilk kurulumda: npx prisma migrate dev --name init

# 4) Başlangıç içeriği + admin kullanıcısı
#    .env içinde SEED_ADMIN_EMAIL ve SEED_ADMIN_PASSWORD tanımlı olmalı
npm run db:seed

# 5) Geliştirme sunucusu
npm run dev
```

- Site: http://localhost:3000
- Yönetim paneli: http://localhost:3000/admin

> **Not:** Veritabanı olmadan da `npm run dev` ve `npm run build` çalışır. Bu
> durumda site, `src/config/content.ts` içindeki nötr yedek içerikle görüntülenir;
> teklif formu gönderimi ise veritabanı gerektirir.

### Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build (önce `prisma generate` çalışır) |
| `npm start` | Production sunucusu |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript kontrolü |
| `npm test` | Vitest (unit + integration) |
| `npm run test:e2e` | Playwright e2e |
| `npm run db:migrate` | Geliştirme migration'ı |
| `npm run db:deploy` | Production migration (deploy adımında) |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Başlangıç içerikleri |

---

## Ortam değişkenleri

Tüm değişkenler `.env.example` içinde açıklamalarıyla listelenmiştir. Kritik
olanlar:

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ | **Tek** canonical host. www/non-www tercihini burada belirleyin; diğeri 301 ile buraya yönlenir. |
| `DATABASE_URL` | ✅ | PostgreSQL bağlantısı |
| `AUTH_SECRET` | ✅ | Admin oturum JWT imzası (min. 32 karakter) |
| `MAIL_DRIVER` | ✅ | `resend` \| `smtp` \| `console` |
| `MAIL_TO_ADMIN` | ✅ | Teklif bildirimlerinin gideceği adres |
| `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Önerilir | Tanımsızsa bot koruması yalnızca honeypot + rate limit ile sınırlı kalır |
| `STORAGE_DRIVER` | ✅ | Production'da `s3` olmalıdır (`local` yalnızca geliştirme) |
| `NEXT_PUBLIC_MEDIA_HOSTNAMES` | S3 kullanılıyorsa | `next/image` için izinli host listesi (virgülle ayrılmış) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GTM_ID` | Opsiyonel | Tanımsızsa hiçbir analytics scripti yüklenmez ve çerez bandı gösterilmez |

---

## Klasör yapısı

```
src/
  app/
    (site)/              # public site — tümü Server Component
      page.tsx           # ana sayfa (17 bölüm)
      hizmetler/[slug]   # hizmet detay şablonu
      sektorler/[slug]   # çalışma alanı şablonu
      projeler/[slug]    # vaka çalışması şablonu
      blog/[slug]        # blog detay
      [...slug]          # DB tabanlı yönlendirme yakalayıcı (301/302)
      …                  # once-sonra, sss, teklif-al, iletisim, hukuki metinler
    admin/
      login/             # oturum gerektirmeyen giriş sayfası
      (panel)/           # oturum korumalı panel (layout içinde guard)
    sitemap.ts robots.ts layout.tsx error.tsx global-error.tsx not-found.tsx
  components/
    layout/  home/  forms/  cards/  ui/  shared/  admin/  analytics/
  lib/
    auth/    # parola (argon2), oturum (jose), rol/yetki
    db/      # prisma client + safeQuery sarmalayıcı
    mail/    # sürücü soyutlaması + e-posta şablonları
    seo/     # metadata üretimi + JSON-LD şemaları
    security/# rate limit, turnstile, sanitize, upload, hash
    storage/ # S3/R2 veya yerel dosya yazımı
    analytics/ validation/ utils.ts
  repositories/  # veri erişimi (Prisma sorguları burada)
  services/      # iş kuralları (lead, içerik, ayarlar)
  actions/       # Server Actions
  config/        # site.ts (marka), navigation.ts, content.ts (yedek içerik), env.ts
  proxy.ts       # canonical host + admin koruması (Next 16 "middleware")
prisma/          # schema.prisma + seed.ts
tests/           # vitest unit + integration
e2e/             # playwright
```

---

## Görseller

Projeyle birlikte gelen fotoğraflar `public/images/` altındadır ve
[src/config/images.ts](src/config/images.ts) üzerinden bölümlere eşlenir:

| Görsel | Kullanıldığı yer |
| --- | --- |
| `hero-drone-cephe-temizligi.jpg` | Ana sayfa hero arka planı |
| `cam-cephe-temizligi.webp` | Problem/Çözüm bölümü + cam cephe hizmeti + plazalar |
| `drone-sistem-yakin-plan.jpg` | Teknoloji (sistem bileşenleri) bölümü |
| `dis-cephe-temizligi.webp` | Drone ile dış cephe temizliği hizmeti |
| `gunes-paneli-temizligi.jpg` | Güneş paneli hizmeti + enerji santralleri |
| `cati-temizligi.webp` | Çatı temizliği hizmeti + lojistik merkezleri |
| `endustriyel-cephe-temizligi.png` | Endüstriyel cephe hizmeti + fabrikalar |
| `kompozit-yuzey-temizligi.avif` | Kompozit/metal/beton yüzey hizmeti |
| `gokdelen-cephe-temizligi.jpeg` | Gökdelen ve rezidanslar çalışma alanı |
| `og/default.jpg` | Sosyal medya paylaşım görseli (1200×630) |

Kurallar:

- **Öncelik daima veritabanındadır.** Panelden bir hizmete/çalışma alanına görsel
  yüklendiğinde `images.ts` içindeki varsayılan otomatik devre dışı kalır.
- Görseller `next/image` ile servis edilir: WebP/AVIF dönüşümü, responsive
  `srcset` ve hero dışında lazy loading otomatiktir.
- Altı hizmetin ve beş çalışma alanının tamamında görsel tanımlıdır. Karşılığı
  olmayan bir kayıt eklenirse **alakasız stok görsel kullanılmaz**; görsel
  yüklenene kadar nötr bir yer tutucu blok gösterilir.
- Alt metinleri `imageAltTexts` içinde tanımlıdır; görselin ne gösterdiğini
  tarif eder, anahtar kelime doldurulmaz.

Yeni görsel eklemek için: dosyayı `public/images/` altına koyup `images.ts`
içinde eşleyin **veya** panelden ilgili kaydın kapak görseli olarak yükleyin
(önerilen yol).

> Sitenin renk, tipografi, boşluk, bileşen ve bölüm bazlı tüm tasarım
> kararları [docs/tasarim-sistemi.txt](docs/tasarim-sistemi.txt) dosyasında
> ayrıntılı olarak belgelenmiştir.

---

## İçerik yönetimi

Yönetim paneli (`/admin`) üzerinden yönetilenler:

- **Teklif talepleri (CRM-lite):** liste, filtre, arama, durum akışı
  (Yeni → Görüşüldü → Keşif Planlandı → Teklif Verildi → Kazanıldı/Kaybedildi),
  sorumlu atama, not ekleme, ek dosyalar, KVKK onay zamanı, UTM kaynağı,
  CSV dışa aktarım.
- **İçerik:** hizmetler, çalışma alanları, projeler, öncesi/sonrası setleri,
  blog (TipTap editör + kategoriler + etiketler), SSS.
- **Güven unsurları:** referans logoları, müşteri yorumları, medya kütüphanesi.
- **Sistem:** site ayarları (marka, iletişim, hero, istatistikler, SEO
  varsayılanları, analytics ID'leri) ve URL yönlendirmeleri.

Roller: `ADMIN` (tam yetki), `EDITOR` (içerik + medya), `SALES` (talepler).

---

## Yayına alma kontrol listesi

Panel ana sayfasında "Tamamlanması gerekenler" bloğu bu listeyi canlı olarak
takip eder.

- [ ] `src/config/site.ts` içindeki **TODO** alanları gerçek şirket bilgileriyle doldurulmalı
- [ ] Logo, favicon ve OG görseli yüklenmeli (Ayarlar)
- [ ] Telefon, WhatsApp, e-posta, adres bilgileri girilmeli
- [ ] `NEXT_PUBLIC_SITE_URL` canonical host olarak ayarlanmalı, DNS'te diğer host 301'lenmeli
- [ ] Turnstile anahtarları tanımlanmalı
- [ ] `STORAGE_DRIVER=s3` yapılandırılmalı ve `NEXT_PUBLIC_MEDIA_HOSTNAMES` doldurulmalı
- [ ] Hukuki metinler (KVKK, aydınlatma, çerez, gizlilik) hukuk danışmanı onayından geçmeli — sayfalardaki taslak uyarısı gerçek unvan girilince otomatik kalkar
- [ ] Gerçek proje, referans ve müşteri yorumu kayıtları girilmeli
- [ ] İstatistikler yalnızca doğrulanabilirse girilmeli (boşsa bölüm gizli kalır)
- [ ] Google Search Console'a sitemap gönderilmeli
- [ ] Veritabanı yedekleme planı kurulmalı

---

## Deployment

### Tercih 1 — Vercel (önerilen)

1. Repoyu bağlayın; framework otomatik algılanır.
2. Ortam değişkenlerini tanımlayın (yukarıdaki tablo).
3. Build komutu: `npm run build` (içinde `prisma generate` çalışır).
4. Migration'ları deploy adımında çalıştırın: `npm run db:deploy`.
5. Managed PostgreSQL (Neon/Supabase/RDS) ve R2/S3 bağlayın.
6. Domain'i ekleyin; www/non-www tercihinizi `NEXT_PUBLIC_SITE_URL` ile eşleyin.

### Tercih 2 — VPS / Plesk (Docker)

```bash
cp .env.example .env        # değerleri doldurun
docker compose --profile app up -d --build
docker compose exec app npx prisma migrate deploy
```

- Nginx'i 3000 portuna reverse proxy olarak yapılandırın, HTTPS'i sonlandırın.
- `www` → `non-www` (veya tersi) 301 yönlendirmesini web sunucusunda tanımlayın.
- Container yeniden başlatma politikası `unless-stopped` olarak ayarlıdır;
  PM2/systemd yalnızca Docker kullanılmayan kurulumlarda gereklidir.
- Günlük veritabanı yedeği planlayın (`pg_dump`).

---

## Testler

```bash
npm test          # Vitest: doğrulama şemaları, yardımcılar, güvenlik, CSV, spam skoru
npm run test:e2e  # Playwright: navigasyon, teklif formu, admin erişimi, çerez onayı
```

- Unit testler bağımsız çalışır.
- Integration testleri `DATABASE_URL` tanımlıysa çalışır, aksi halde atlanır.
- E2E testleri kendi portunda (`3100`) sunucu başlatır; makinede çalışan başka
  bir Next sunucusuyla çakışmaz. `E2E_PORT` ile değiştirilebilir.
- Admin oturum testleri için `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` gerekir.

---

## İçerik ve dürüstlük kuralları

Bu proje, doğrulanmamış hiçbir iddiayı arayüzde göstermeyecek şekilde
tasarlanmıştır. Kod seviyesinde uygulanan kurallar:

- **Sahte istatistik yok:** "Sayılarla Şirket" bölümü yalnızca panelden gerçek
  veri girildiğinde render edilir.
- **Sahte referans/yorum yok:** Kayıt yoksa ilgili bölümler hiç gösterilmez.
- **Sahte teknik iddia yok:** Teknoloji bölümü sistem bileşenlerini nötr biçimde
  anlatır; menzil, basınç, kapasite gibi değerler uydurulmaz.
- **Otomatik fiyat yok:** Form yalnızca teklif talebi toplar; fiyat keşif
  sonrasında insan tarafından belirlenir.
- **Schema.org'da sahte puan yok:** `aggregateRating` ve `review` asla
  üretilmez; adres/telefon yalnızca gerçekten tanımlıysa şemaya eklenir.
- **KVKK:** Pazarlama izni, hizmet talebinden ayrı ve opsiyoneldir. IP adresi ham
  olarak saklanmaz, yalnızca tuzlanmış hash tutulur.
