# ---- deps ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ---- builder ----
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1

# ---------------------------------------------------------------------------
# NEXT_PUBLIC_* değişkenleri Next.js tarafından BUILD sırasında bundle'a
# gömülür (server component'ler dahil). Runtime'da env_file ile verilmeleri
# ÇOK GEÇTİR — bu yüzden build argümanı olarak geçilmeleri zorunludur.
#
# Özellikle NEXT_PUBLIC_SITE_URL kritiktir: eksik kalırsa siteConfig.url
# "http://localhost:3000" olarak gömülür ve src/app/robots.ts tüm siteyi
# `disallow: /` ile arama motorlarına kapatır.
# ---------------------------------------------------------------------------
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_MEDIA_HOSTNAMES=""
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ARG NEXT_PUBLIC_GTM_ID=""
ARG NEXT_PUBLIC_META_PIXEL_ID=""
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=""

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_MEDIA_HOSTNAMES=$NEXT_PUBLIC_MEDIA_HOSTNAMES
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

# Yanlış yapılandırmayı sessizce canlıya taşımak yerine build'i burada durdur.
RUN if [ -z "$NEXT_PUBLIC_SITE_URL" ] || echo "$NEXT_PUBLIC_SITE_URL" | grep -qi 'localhost\|127\.0\.0\.1'; then \
      echo "" >&2; \
      echo "HATA: NEXT_PUBLIC_SITE_URL build argümanı verilmedi veya localhost." >&2; \
      echo "      Bu değer bundle'a gömülür; eksikse robots.txt tüm siteyi kapatır." >&2; \
      echo "      Örnek: docker build --build-arg NEXT_PUBLIC_SITE_URL=https://mdkurumsal.com.tr ." >&2; \
      echo "" >&2; \
      exit 1; \
    fi

RUN npx prisma generate && npm run build

# ---- runner ----
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# migration'ları container içinden çalıştırabilmek için
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# STORAGE_DRIVER=local kullanılıyorsa buraya named volume bağlanır.
# Dizin önceden nextjs kullanıcısına ait olmalı, aksi halde volume root'a
# ait olarak oluşur ve yükleme "permission denied" ile başarısız olur.
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
