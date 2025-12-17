'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Candidate = {
  id: number
  name: string
  email?: string | null
  nationality?: string | null
  japaneseLevel?: string | null
  skills?: string | null
  visaStatus?: string | null
  selfPr?: string | null
  introVideoUrl?: string | null
  createdAt: string
}

export default function CompanyCandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [id, setId] = useState<number | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const pid = params?.id
    if (!pid) return
    const num = Number(pid)
    if (!Number.isFinite(num) || !Number.isInteger(num)) return
    setId(num)
  }, [params])

  useEffect(() => {
    if (id === null) return
    setLoading(true)
    setError(null)
    fetch(`/api/candidates/${id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error(data?.error || '取得に失敗しました')
        return data
      })
      .then((d) => setCandidate(d))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="p-6">読み込み中...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!candidate) return <p className="p-6">求職者が見つかりません</p>

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <Link
          href="/company/candidates"
          className="text-indigo-600 hover:underline mb-4 inline-block"
        >
          ← 求職者一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold mb-2">{candidate.name}</h1>
        <p className="text-sm text-slate-600 mb-4">
          登録日: {new Date(candidate.createdAt).toLocaleString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-600">メール</p>
            <p className="font-medium">{candidate.email ?? '非公開'}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600">国籍</p>
            <p className="font-medium">{candidate.nationality ?? '—'}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600">日本語レベル</p>
            <p className="font-medium">{candidate.japaneseLevel ?? '—'}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600">ビザ状況</p>
            <p className="font-medium">{candidate.visaStatus ?? '—'}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-600">スキル</p>
          <p className="font-medium whitespace-pre-wrap">{candidate.skills ?? '—'}</p>
        </div>

        {candidate.selfPr && (
          <div className="mb-4">
            <p className="text-sm text-slate-600">自己PR</p>
            <p className="whitespace-pre-wrap">{candidate.selfPr}</p>
          </div>
        )}

        {candidate.introVideoUrl && (
          <div className="mb-4">
            <p className="text-sm text-slate-600">紹介動画</p>
            <a
              href={candidate.introVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline"
            >
              動画を見る
            </a>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Link
            href={`/company/applications?candidateId=${candidate.id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            この求職者の応募を見る
          </Link>

          <button
            onClick={() => router.push(`/company/candidates/${candidate.id}/scout`)}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
          >
            スカウトを送る
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded text-sm"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  )
}
