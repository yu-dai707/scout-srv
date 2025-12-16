'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Job = {
  id: number
  title: string
  description: string
  location: string
  requiredLanguage: string
  requiredSkills: string
  visaSupport: boolean
}

export default function CandidateJobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = Number(params.id)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const candidateId =
    typeof window !== 'undefined'
      ? localStorage.getItem('candidateId')
      : null

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch(() => setError('求人の取得に失敗しました'))
  }, [jobId])

  const handleApply = async () => {
    if (!candidateId) {
      setError('ログイン情報が取得できません')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          candidateId: Number(candidateId),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '応募に失敗しました')
        return
      }

      alert('応募が完了しました')
      router.push('/candidate/jobs')
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (!job) {
    return <p className="p-6">読み込み中...</p>
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <button
        onClick={() => router.back()}
        className="text-sm text-indigo-600 mb-4"
      >
        ← 一覧に戻る
      </button>

      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{job.title}</h1>

        <p>勤務地：{job.location}</p>
        <p>必要言語：{job.requiredLanguage}</p>
        <p>必要スキル：{job.requiredSkills}</p>

        {job.visaSupport && (
          <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
            ビザサポートあり
          </span>
        )}

        <div className="mt-4">
          <h2 className="font-semibold mb-1">仕事内容</h2>
          <p className="whitespace-pre-wrap">{job.description}</p>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}

        <div className="mt-6">
          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-slate-400"
          >
            {loading ? '応募中...' : '応募する'}
          </button>
        </div>
      </div>
    </div>
  )
}
