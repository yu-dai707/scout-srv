'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Application = {
  id: number
  createdAt: string
  job: {
    id: number
    title: string
  }
  candidate: {
    id: number
    name: string
    email: string
    nationality: string
  }
}

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const companyId = localStorage.getItem('companyId')
    const role = localStorage.getItem('userRole')

    if (!companyId || role !== 'company') {
      window.location.href = '/company/login'
      return
    }

    fetch(`/api/company/applications?companyId=${companyId}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error ?? '取得に失敗しました')
        }
        return data
      })
      .then(setApplications)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">読み込み中...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">応募者一覧</h1>

      {applications.length === 0 && (
        <p className="text-sm text-slate-600">応募者はいません</p>
      )}

      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{app.candidate.name}</p>
              <p className="text-sm text-slate-600">{app.candidate.email}</p>
              <p className="text-sm text-slate-600">
                国籍：{app.candidate.nationality}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                応募求人：{app.job.title}
              </p>
            </div>

            {/* ★ ここが最重要 */}
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
