import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = Number(params.id)

    if (!Number.isFinite(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid application id' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      )
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
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
