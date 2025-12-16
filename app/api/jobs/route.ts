// app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'

// 求人作成（企業側）
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      location,
      requiredLanguage,
      requiredSkills,
      visaSupport,
      companyId,
    } = body

    if (
      !title ||
      !description ||
      !location ||
      !requiredLanguage ||
      !requiredSkills ||
      !companyId
    ) {
      return NextResponse.json(
        { error: '必須項目が足りません' },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        requiredLanguage,
        requiredSkills,
        visaSupport: !!visaSupport,
        companyId: Number(companyId),
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('create job error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 求人一覧取得（会社ごと or 全部）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    const where = companyId
      ? { companyId: Number(companyId) }
      : {}

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('get jobs error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
