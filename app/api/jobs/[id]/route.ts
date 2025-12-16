import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

type Params = {
  id: string
}

/**
 * 求人取得（詳細）
 */
export async function GET(
  _: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const jobId = Number(id)

    if (!Number.isInteger(jobId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (e) {
    console.error('job get error:', e)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

/**
 * 求人更新（編集）
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const jobId = Number(id)

    if (!Number.isInteger(jobId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const body = await request.json()
    const {
      title,
      description,
      location,
      requiredLanguage,
      requiredSkills,
      visaSupport,
    } = body

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(requiredLanguage !== undefined ? { requiredLanguage } : {}),
        ...(requiredSkills !== undefined ? { requiredSkills } : {}),
        ...(visaSupport !== undefined ? { visaSupport: !!visaSupport } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('job patch error:', e)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

/**
 * 求人削除
 */
export async function DELETE(
  _: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const jobId = Number(id)

    if (!Number.isInteger(jobId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    await prisma.job.delete({
      where: { id: jobId },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('job delete error:', e)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
