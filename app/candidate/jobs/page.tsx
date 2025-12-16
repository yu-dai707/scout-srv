'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Job = {
  id: number
  title: string
  location: string
  requiredLanguage: string
  visaSupport: boolean
  company: {
    name: string
  }
}

export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/candidate/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setError('求人の取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-6">読み込み中...</p>
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">求人一覧</h1>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded shadow p-4"
          >
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-slate-600">
              企業名：{job.company.name}
            </p>
            <p className="text-sm">勤務地：{job.location}</p>
            <p className="text-sm">
              必要言語：{job.requiredLanguage}
            </p>

            {job.visaSupport && (
              <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                ビザサポートあり
              </span>
            )}

            <div className="mt-3">
              <Link
                href={`/candidate/jobs/${job.id}`}
                className="text-indigo-600 hover:underline text-sm"
              >
                詳細を見る →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
