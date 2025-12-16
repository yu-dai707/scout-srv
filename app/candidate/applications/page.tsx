'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Application = {
  id: number
  candidate: {
    name: string
    email: string
    nationality: string
  }
  job: {
    title: string
  }
}

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const companyId = localStorage.getItem('companyId')
    fetch(`/api/company/applications?companyId=${companyId}`)
      .then((res) => res.json())
      .then(setApplications)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">読み込み中...</p>

  return (
    <div className="p-8 bg-slate-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">応募者一覧</h1>

      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded shadow p-4 flex justify-between"
          >
            <div>
              <p className="font-medium">{app.candidate.name}</p>
              <p className="text-sm">{app.candidate.email}</p>
              <p className="text-sm">国籍：{app.candidate.nationality}</p>
              <p className="text-xs text-slate-500">
                応募求人：{app.job.title}
              </p>
            </div>

            {/* ★ application.id を使う */}
            <Link
              href={`/company/applications/${app.id}`}
              className="text-sm text-indigo-600 hover:underline"
            >
              詳細を見る →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
