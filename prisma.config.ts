// prisma.config.ts（プロジェクトの一番上の階層にあるファイル）
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node ./prisma/seed.ts',
  },
  datasource: {
    // ここで .env の DATABASE_URL を読む
    url: env('DATABASE_URL'),
  },
})
