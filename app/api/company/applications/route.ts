import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const companyId = Number(searchParams.get('companyId'))

    if (!Number.isFinite(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company id' },
        { status: 400 }
      )
    }

    const applications = await prisma.application.findMany({
      where: {
        job: {
          companyId,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: { title: true },
        },
        candidate: {
          select: {
            name: true,
            email: true,
            nationality: true,
          },
        },
      },
    })

    return NextResponse.json(applications)
  } catch (e) {
    console.error('Company applications get error:', e)
    return NextResponse.json(
      { error: 'server error' },
      { status: 500 }
    )
  }
}
