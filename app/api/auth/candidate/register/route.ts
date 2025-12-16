// app/api/auth/candidate/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'
import { hashPassword } from 'src/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, nationality, japaneseLevel, skills, visaStatus } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: '必須項目が足りません' }, { status: 400 })
    }

    // 既に登録済みかチェック
    const existing = await prisma.candidate.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        password: passwordHash,
        nationality: nationality ?? null,
        japaneseLevel: japaneseLevel ?? null,
        skills: skills ?? null,
        visaStatus: visaStatus ?? null,
      },
    })

    return NextResponse.json({ id: candidate.id, email: candidate.email }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
