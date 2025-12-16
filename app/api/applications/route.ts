import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { jobId, candidateId, message } = body

    const jobIdNum = Number(jobId)
    const candidateIdNum = Number(candidateId)

    if (!Number.isFinite(jobIdNum) || !Number.isFinite(candidateIdNum)) {
      return NextResponse.json({ error: 'jobId と candidateId は数値で指定してください' }, { status: 400 })
    }

    // 存在チェック: 外部キーエラーを避けるため明示的に確認
    const job = await prisma.job.findUnique({ where: { id: jobIdNum } })
    if (!job) {
      return NextResponse.json({ error: '指定された求人が見つかりません' }, { status: 404 })
    }
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateIdNum } })
    if (!candidate) {
      return NextResponse.json({ error: '指定された求職者が見つかりません' }, { status: 404 })
    }

    // すでに応募済みかチェック（二重応募防止）
    const exists = await prisma.application.findFirst({
      where: {
        jobId: jobIdNum,
        candidateId: candidateIdNum,
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
        jobId: jobIdNum,
        candidateId: candidateIdNum,
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
