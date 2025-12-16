// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// ==============================
// globalThis に PrismaClient を保持
// （Next.js 開発時の多重生成防止）
// ==============================
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// ==============================
// PostgreSQL コネクションプール
// ==============================
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// ==============================
// Prisma v5+ / v6+ / v7 対応
// adapter-pg を使用
// ==============================
const adapter = new PrismaPg(pool)

// ==============================
// Prisma Client
// ==============================
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

// ==============================
// 開発環境のみ global に保持
// ==============================
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
