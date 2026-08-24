import Link from 'next/link'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/shared/media-image'
import { MediaScrim } from '@/components/shared/media-scrim'
import { HeroVideo } from './hero-video'
import { HeroScrollCue } from './hero-scroll-cue'
import {
  BlueprintBackground,
  RadialLight,
  SectionLabel,
} from '@/components/shared/technical'
import { operationRail } from '@/config/content'
import type { ResolvedSettings } from '@/services/settings-service'

/**
 * SECTION 01 — HERO (sinematik)
 *
 * Kompozisyon kararları:
 *  - Editorial düzen: dev akışkan başlık solda, fotoğrafın operasyon tarafı
 *    sağda okunur kalır.
 *  - Header hero'nun üzerine biner (transparent) — üst boşluk buna göre.
 *  - Sağdaki teknik overlay UYDURMA TEKNİK DEĞER İÇERMEZ; yalnızca
 *    operasyonun doğasını tarif eden ifadeler kullanılır.
 *
 * Performans:
 *  - Hero görseli sayfadaki tek preload edilen LCP adayıdır.
 *  - Video yalnızca masaüstünde, poster üzerinden, gecikmeli başlar.
 *  - Bölüm Server Component'tir; yalnızca video ve kaydırma ipucu client.
 */
export function Hero({ settings }: { settings: ResolvedSettings }) {
  const { hero } = settings
  const posterOrImage = hero.posterUrl ?? hero.image

  return (
    <section className="relative isolate flex min-h-[70svh] flex-col justify-end overflow-hidden bg-onyx md:min-h-[78svh]">
      {/* --- Arka plan medyası --- */}
      <div className="absolute inset-0 -z-10">
        {posterOrImage ? (
          <MediaImage
            src={posterOrImage}
            alt=""
            priority
            sizes="100vw"
            className="animate-slow-zoom object-cover"
          />
        ) : (
          <HeroFallbackBackdrop />
        )}

        {hero.videoUrl && <HeroVideo src={hero.videoUrl} poster={hero.posterUrl ?? undefined} />}

        {/*
          Okunabilirlik karartması — dekorasyon değil, işlev. Metin alt-solda,
          header üstte saydam durduğu için karartma yalnızca o üç bölgeye
          uygulanır; kadrajın ortası ve sağı fotoğrafın kendisine bırakılır.
          Ayrıntılı gerekçe: media-scrim.tsx
        */}
        <MediaScrim variant="hero" />
      </div>

      {/*
        Not: Burada dört parçalı bir teknik overlay vardı (ölçüm çizgisi, nokta,
        köşe braketleri, "Kontrollü Uygulama" etiketi). Hero'nun tek odağı
        değer önerisi ve CTA olmalı; dekoratif katmanlar kaldırıldı.
      */}

      {/* --- İçerik --- */}
      <div className="container-site relative w-full pt-28 pb-10 md:pt-36 md:pb-16">
        <div className="max-w-4xl">
          <div className="animate-fade-up">
            <SectionLabel onMedia>{hero.eyebrow}</SectionLabel>
          </div>

          <h1
            className="mt-6 text-[length:var(--text-hero)] leading-[var(--text-hero--line-height)] font-bold tracking-[-0.035em] text-balance text-white animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            {hero.title}
          </h1>

          <p
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink-on-dark-muted animate-fade-up md:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            {hero.subtitle}
          </p>

          <div
            className="mt-10 flex flex-col gap-3 animate-fade-up sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <Button asChild size="lg">
              <Link href="/teklif-al">
                Ücretsiz Keşif Talep Et
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineInverse">
              <Link href="#surec">
                <PlayCircle className="size-4" aria-hidden />
                Nasıl Çalışıyor?
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* --- Operasyon rayı: kart yerine ince şerit --- */}
      <div className="relative border-t border-line-on-dark bg-scrim/50">
        <div className="container-site">
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {operationRail.map((item, index) => (
              <li
                key={item}
                className="flex items-baseline gap-3 border-white/10 py-4 lg:border-l lg:py-5 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="tech-label text-ink-on-dark-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-tight font-medium text-white">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <HeroScrollCue />
    </section>
  )
}

/**
 * Görsel yüklenmediğinde kullanılan mimari arka plan.
 * Stok görsel hissi vermemek için soyut, düşük kontrastlı bir kompozisyon.
 */
function HeroFallbackBackdrop() {
  return (
    <div className="absolute inset-0 bg-onyx" aria-hidden>
      <BlueprintBackground opacity="opacity-70" />
      <RadialLight position="75% 15%" color="rgba(17,85,240,0.28)" />
      <RadialLight position="15% 85%" color="rgba(0,194,209,0.16)" size="45% 45%" />
      <svg
        className="absolute inset-0 size-full opacity-[0.18]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {Array.from({ length: 14 }).map((_, column) => (
          <g key={column}>
            {Array.from({ length: 10 }).map((__, row) => (
              <rect
                key={row}
                x={700 + column * 36}
                y={60 + row * 74}
                width="30"
                height="66"
                stroke="white"
                strokeWidth="0.75"
                opacity={0.35 - row * 0.02}
              />
            ))}
          </g>
        ))}
        <path
          d="M120 700 C 280 640, 300 420, 470 380 S 720 300, 860 180"
          stroke="var(--color-signal)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
