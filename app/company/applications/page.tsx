'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Application = {
  id: number
  createdAt: string
  status?: string
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
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('applications_status_filter')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [page, setPage] = useState<number>(1)
  const PAGE_SIZE = 10

  const statusLabels: Record<string, string> = {
    UNCONFIRMED: '未確認',
    DOCUMENT: '書類選考',
    FIRST: '一次面接',
    SECOND: '二次面接',
    APTITUDE: '適性検査',
    FINAL: '最終面接',
    OFFER: '内定',
    REJECT: '不合格',
    // compatibility
    PENDING: '未確認',
    ACCEPTED: '内定',
    REJECTED: '不合格',
  }
  const statusClasses: Record<string, string> = {
    UNCONFIRMED: 'bg-gray-200 text-gray-800',
    DOCUMENT: 'bg-yellow-100 text-yellow-800',
    FIRST: 'bg-blue-100 text-blue-800',
    SECOND: 'bg-indigo-100 text-indigo-800',
    APTITUDE: 'bg-purple-100 text-purple-800',
    FINAL: 'bg-teal-100 text-teal-800',
    OFFER: 'bg-green-100 text-green-800',
    REJECT: 'bg-red-100 text-red-800',
    PENDING: 'bg-gray-200 text-gray-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  const STATUS_OPTIONS = [
    { value: 'UNCONFIRMED', label: '未確認' },
    { value: 'DOCUMENT', label: '書類選考' },
    { value: 'FIRST', label: '一次面接' },
    { value: 'SECOND', label: '二次面接' },
    { value: 'APTITUDE', label: '適性検査' },
    { value: 'FINAL', label: '最終面接' },
    { value: 'OFFER', label: '内定' },
    { value: 'REJECT', label: '不合格' },
    { value: 'PENDING', label: '検討中' },
  ]

  useEffect(() => {
    // persist selected statuses
    try {
      localStorage.setItem('applications_status_filter', JSON.stringify(selectedStatuses))
    } catch {}
  }, [selectedStatuses])

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">応募者一覧</h1>
        <Link href="/" className="text-sm text-indigo-600 hover:underline">TOPに戻る</Link>
      </div>

      {applications.length === 0 && (
        <p className="text-sm text-slate-600">応募者はいません</p>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">応募者一覧</h2>
          <div className="text-sm text-slate-600">全{applications.length}件</div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((o) => (
                <label key={o.value} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(o.value)}
                    onChange={(e) => {
                      const v = o.value
                      setPage(1)
                      setSelectedStatuses((prev) =>
                        e.target.checked ? [...prev, v] : prev.filter((s) => s !== v)
                      )
                    }}
                  />
                  <span className="text-slate-700">{o.label}</span>
                </label>
              ))}
              <button
                className="ml-2 px-2 py-1 border rounded text-sm"
                onClick={() => setSelectedStatuses([])}
              >
                クリア
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">表示: {PAGE_SIZE}件/ページ</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {applications
          .filter((app) => {
            if (selectedStatuses.length === 0) return true
            const s = (app as any).status ?? 'PENDING'
            return selectedStatuses.includes(s)
          })
          .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          .map((app) => (
          <div
            key={app.id}
            className="bg-white rounded shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{app.candidate.name}</p>
              <p className="text-sm text-slate-600">{app.candidate.email}</p>
              <p className="text-sm text-slate-600">国籍：{app.candidate.nationality}</p>
              <p className="text-xs text-slate-500 mt-1">応募求人：{app.job.title}</p>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-500">ステータス</span>
                <div className="mt-1">
                  {
                    (() => {
                      const s = (app.status as unknown as string) || 'PENDING'
                      const classes = statusClasses[s] ?? 'bg-slate-200 text-black'
                      return (
                        <span className={`px-2 py-1 rounded-full text-sm ${classes}`}>
                          {statusLabels[s] ?? s}
                        </span>
                      )
                    })()
                  }
                </div>
              </div>

              <Link href={`/company/applications/${app.id}`} className="text-sm text-indigo-600 hover:underline">
                詳細を見る →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* pagination controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          前へ
        </button>
        <div className="text-sm text-slate-600">{page}</div>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={(page * PAGE_SIZE) >= applications.filter((app) => (selectedStatuses.length === 0 ? true : selectedStatuses.includes((app as any).status ?? 'PENDING'))).length}
        >
          次へ
        </button>
      </div>
    </div>
  )
}
