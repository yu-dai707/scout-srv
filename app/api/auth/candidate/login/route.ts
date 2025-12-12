// app/api/auth/candidate/login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'メールアドレスとパスワードは必須です' }, { status: 400 })
    }

    const candidate = await prisma.candidate.findUnique({ where: { email } })
    if (!candidate) {
      return NextResponse.json({ error: 'メールアドレスまたはパスワードが違います' }, { status: 401 })
    }

    const isValid = await comparePassword(password, candidate.password)
    if (!isValid) {
      return NextResponse.json({ error: 'メールアドレスまたはパスワードが違います' }, { status: 401 })
    }

    const token = generateToken({
      id: candidate.id,
      role: 'candidate',
    })

    return NextResponse.json({
      token,
      user: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        role: 'candidate',
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
