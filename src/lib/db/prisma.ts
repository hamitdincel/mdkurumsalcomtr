import { PrismaClient } from '@prisma/client'
import { env, isProduction } from '@/config/env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProduction ? ['error'] : ['error', 'warn'],
  })

if (!isProduction) globalForPrisma.prisma = prisma

/** DATABASE_URL tanımlı mı? Tanımsızsa tüm sorgular fallback'e düşer. */
export const databaseConfigured = Boolean(env.DATABASE_URL)
