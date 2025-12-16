import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(jobs)
  } catch (e) {
    console.error('Candidate jobs get error:', e)
    return NextResponse.json(
      { error: '求人の取得に失敗しました' },
      { status: 500 }
    )
  }
}
