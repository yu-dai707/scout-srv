import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // テスト candidate ユーザー
  const hashedPassword = await bcrypt.hash('password123', 10)

  const candidate = await prisma.candidate.create({
    data: {
      name: 'テスト求職者',
      email: 'candidate@example.com',
      password: hashedPassword,
      nationality: '日本',
      japaneseLevel: 'N1',
      skills: 'JavaScript, TypeScript, React',
      visaStatus: 'なし',
    },
  })

  console.log('✓ Created candidate:', candidate.id, candidate.email)

  // テスト company ユーザー
  const companyPassword = await bcrypt.hash('company123', 10)
  const company = await prisma.company.create({
    data: {
      name: 'テスト企業',
      email: 'company@example.com',
      password: companyPassword,
      country: '日本',
      city: '東京',
    },
  })

  console.log('✓ Created company:', company.id, company.email)

  // テスト求人
  const job = await prisma.job.create({
    data: {
      title: 'フロントエンドエンジニア',
      description: 'React を用いた Web アプリケーション開発',
      location: '東京都渋谷区',
      requiredLanguage: 'N2',
      requiredSkills: 'JavaScript, React',
      visaSupport: true,
      companyId: company.id,
    },
  })

  console.log('✓ Created job:', job.id, job.title)

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
