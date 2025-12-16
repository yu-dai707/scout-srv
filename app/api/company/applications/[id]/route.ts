import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const applicationId = Number(params.id)

  if (!Number.isFinite(applicationId)) {
    return NextResponse.json(
      { error: 'Invalid application id' },
      { status: 400 }
    )
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
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

  if (!application) {
    return NextResponse.json(
      { error: 'Application not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(application)
}
