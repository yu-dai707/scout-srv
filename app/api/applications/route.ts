import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { jobId, candidateId, message } = body

    if (!jobId || !candidateId) {
      return NextResponse.json(
        { error: 'jobId と candidateId は必須です' },
        { status: 400 }
      )
    }

    // すでに応募済みかチェック（二重応募防止）
    const exists = await prisma.application.findFirst({
      where: {
        jobId: Number(jobId),
        candidateId: Number(candidateId),
      },
    })

    if (exists) {
      return NextResponse.json(
        { error: 'すでにこの求人に応募しています' },
        { status: 409 }
      )
    }

    const application = await prisma.application.create({
      data: {
        jobId: Number(jobId),
        candidateId: Number(candidateId),
        message: message ?? null,
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (e) {
    console.error('Application create error:', e)
    return NextResponse.json(
      { error: '応募に失敗しました' },
      { status: 500 }
    )
  }
}
