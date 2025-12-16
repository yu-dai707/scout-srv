import { NextResponse } from 'next/server'
import { prisma } from 'src/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const candidateId = Number(searchParams.get('candidateId'))

    if (!Number.isFinite(candidateId)) {
      return NextResponse.json({ error: 'Invalid candidate id' }, { status: 400 })
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
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
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    return NextResponse.json(candidate)
  } catch (e) {
    console.error('candidate profile GET error:', e)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData()

    const candidateId = Number(formData.get('candidateId'))
    if (!Number.isFinite(candidateId)) {
      return NextResponse.json({ error: 'Invalid candidate id' }, { status: 400 })
    }

    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      )
    }

    // ===== 動画処理 =====
    let introVideoUrl: string | null = null
    const file = formData.get('introVideo') as File | null

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      const fileName = `intro_${candidateId}_${Date.now()}.mp4`
      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, buffer)
      introVideoUrl = `/uploads/${fileName}`
    }

    const updated = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        name,
        email,
        nationality: String(formData.get('nationality') || '') || null,
        japaneseLevel: String(formData.get('japaneseLevel') || '') || null,
        skills: String(formData.get('skills') || '') || null,
        visaStatus: String(formData.get('visaStatus') || '') || null,
        currentJobType: String(formData.get('currentJobType') || '') || null,
        skillTest: String(formData.get('skillTest') || '') || null,
        unionName: String(formData.get('unionName') || '') || null,
        registeredOrg: String(formData.get('registeredOrg') || '') || null,
        selfPr: String(formData.get('selfPr') || '') || null,
        ...(introVideoUrl ? { introVideoUrl } : {}),
      },
    })

    // ★ 必ず JSON を返す（ここ重要）
    return NextResponse.json({
      ok: true,
      candidateId: updated.id,
      introVideoUrl: updated.introVideoUrl,
    })
  } catch (e) {
    console.error('candidate profile PUT error:', e)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
