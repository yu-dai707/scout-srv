// app/api/jobs/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(job)
  } catch (e) {
    console.error('job get error:', e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

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
      where: { id },
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
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    await prisma.job.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('job delete error:', e)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
