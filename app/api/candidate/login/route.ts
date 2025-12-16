import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      )
    }

    const candidate = await prisma.candidate.findUnique({
      where: { email },
    })

    if (!candidate) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが違います' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, candidate.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが違います' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      token: 'dummy-token',
    })
  } catch (e) {
    console.error('Candidate login error:', e)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
