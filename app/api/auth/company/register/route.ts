// app/api/auth/company/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, country, city, website } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '必須項目が足りません' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // すでに登録済みのメールかチェック
    const existing = await prisma.company.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const company = await prisma.company.create({
      data: {
        name,
        email: normalizedEmail,
        password: passwordHash,
        country: country ?? '',
        city,
        website,
      },
    })

    return NextResponse.json(
      { id: company.id, email: company.email },
      { status: 201 }
    )
  } catch (error) {
    console.error('company register error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
