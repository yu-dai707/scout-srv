import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const applicationId = Number(resolvedParams.id)

    if (!Number.isFinite(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid application id' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { status } = body

    const ALLOWED = [
      'UNCONFIRMED',
      'DOCUMENT',
      'FIRST',
      'SECOND',
      'APTITUDE',
      'FINAL',
      'OFFER',
      'REJECT',
      // backward compatibility
      'PENDING',
      'ACCEPTED',
      'REJECTED',
    ]

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      )
    }

    if (!ALLOWED.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        job: { select: { title: true } },
        candidate: {
          select: {
            name: true,
            email: true,
            nationality: true,
            japaneseLevel: true,
            skills: true,
            visaStatus: true,
            currentJobType: true,
            skillTest: true,
            unionName: true,
            registeredOrg: true,
            selfPr: true,
            introVideoUrl: true,
          },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('application status update error:', e)
    return NextResponse.json(
      { error: 'server error' },
      { status: 500 }
    )
  }
}
