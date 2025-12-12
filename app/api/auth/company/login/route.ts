// app/api/auth/company/login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const company = await prisma.company.findUnique({
      where: { email: normalizedEmail },
    })

    if (!company) {
      console.log('Company not found for email:', normalizedEmail)
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが違います' },
        { status: 401 }
      )
    }

    const isValid = await comparePassword(password, company.password)
    if (!isValid) {
      console.log('Invalid password for email:', normalizedEmail)
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが違います' },
        { status: 401 }
      )
    }

    const token = generateToken({
      id: company.id,
      role: 'company',
    })

    return NextResponse.json({
      token,
      user: {
        id: company.id,
        name: company.name,
        email: company.email,
        role: 'company',
      },
    })
  } catch (error) {
    console.error('company login error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
