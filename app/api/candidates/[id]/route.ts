// app/api/candidates/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        nationality: true,
        language: true,
        skills: true,
        visaStatus: true,
        experience: true,
        createdAt: true,
      },
    })

    if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(candidate)
  } catch (e) {
    console.error('candidate detail error:', e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
