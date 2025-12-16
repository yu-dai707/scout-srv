// app/api/candidates/route.ts
import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const q = searchParams.get('q')?.trim() || ''
    const nationality = searchParams.get('nationality')?.trim() || ''
    const language = searchParams.get('language')?.trim() || ''
    const skills = searchParams.get('skills')?.trim() || ''
    const visaStatus = searchParams.get('visaStatus')?.trim() || ''

    const candidates = await prisma.candidate.findMany({
      where: {
        ...(nationality ? { nationality: { contains: nationality, mode: 'insensitive' } } : {}),
        ...(language ? { language: { contains: language, mode: 'insensitive' } } : {}),
        ...(skills ? { skills: { contains: skills, mode: 'insensitive' } } : {}),
        ...(visaStatus ? { visaStatus: { contains: visaStatus, mode: 'insensitive' } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { nationality: { contains: q, mode: 'insensitive' } },
                { language: { contains: q, mode: 'insensitive' } },
                { skills: { contains: q, mode: 'insensitive' } },
                { visaStatus: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        nationality: true,
        language: true,
        skills: true,
        visaStatus: true,
        createdAt: true,
      },
    })

    return NextResponse.json(candidates)
  } catch (e) {
    console.error('candidates search error:', e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
