// app/api/scouts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyId, candidateId, message } = body

    if (!companyId || !candidateId || !message) {
      return NextResponse.json({ error: '必須項目が足りません' }, { status: 400 })
    }

    const scout = await prisma.scout.create({
      data: {
        companyId: Number(companyId),
        candidateId: Number(candidateId),
        message: String(message),
      },
    })

    return NextResponse.json(scout, { status: 201 })
  } catch (e) {
    console.error('scout post error:', e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const candidateId = searchParams.get('candidateId')

    if (!companyId && !candidateId) {
      return NextResponse.json({ error: 'companyId or candidateId is required' }, { status: 400 })
    }

    const where: any = {}
    if (companyId) where.companyId = Number(companyId)
    if (candidateId) where.candidateId = Number(candidateId)

    const items = await prisma.scout.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: {
          select: { id: true, name: true, nationality: true, japaneseLevel: true, skills: true, visaStatus: true },
        },
        company: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(items)
  } catch (e) {
    console.error('scout get error:', e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
