// app/company/jobs/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Job = {
  id: number
  title: string
  description: string
  location: string
  requiredLanguage: string
  requiredSkills: string
  visaSupport: boolean
  createdAt: string
}

export default function CompanyJobsPage() {
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<number | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const storedCompanyId = localStorage.getItem('companyId')
    const storedCompanyName = localStorage.getItem('companyName')

    if (!token || role !== 'company' || !storedCompanyId) {
      window.location.href = '/company/login'
      return
    }

    const parsedId = Number(storedCompanyId)
    if (Number.isNaN(parsedId)) {
      window.location.href = '/company/login'
      return
    }

    setCompanyId(parsedId)
    setCompanyName(storedCompanyName)
    setCheckingAuth(false)

    fetchJobs(parsedId)
  }, [])

  const fetchJobs = async (cid: number) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/jobs?companyId=${cid}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '求人の取得に失敗しました')
        return
      }

      setJobs(data)
    } catch (err) {
      console.error(err)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId: number) => {
    if (!companyId) return

    const ok = confirm('この求人を削除します。よろしいですか？')
    if (!ok) return

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? '削除に失敗しました')
        return
      }

      // 削除成功 → 再取得
      fetchJobs(companyId)
    } catch (e) {
      console.error(e)
      alert('サーバーエラーが発生しました')
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('ja-JP')
    } catch {
      return iso
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 text-sm">認証確認中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 text-black">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              自社の求人一覧
            </h1>
            <p className="text-sm text-slate-600">
              企業名: {companyName ?? '不明'}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/company"
              className="px-3 py-2 text-sm border rounded hover:bg-slate-50"
            >
              企業トップへ戻る
            </Link>
            <Link
              href="/company/jobs/new"
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              新規求人を作成
            </Link>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-slate-600 mb-4">求人を読み込み中...</p>
        )}

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-sm text-slate-600">
            まだ登録された求人はありません。
          </p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 hover:shadow-sm transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h2 className="text-lg font-semibold">
                    {job.title}
                  </h2>
                  <span className="text-xs text-slate-500">
                    作成日: {formatDate(job.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-slate-700 mb-2">
                  勤務地: {job.location}
                </p>

                <p className="text-xs text-slate-700 mb-1">
                  必要な言語: {job.requiredLanguage}
                </p>
                <p className="text-xs text-slate-700 mb-2">
                  必要なスキル: {job.requiredSkills}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={
                      'inline-block px-2 py-1 text-xs rounded ' +
                      (job.visaSupport
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600')
                    }
                  >
                    {job.visaSupport ? 'ビザサポートあり' : 'ビザサポートなし'}
                  </span>

                  <div className="flex gap-3">
                    <Link
                      href={`/company/jobs/${job.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      詳細
                    </Link>
                    <Link
                      href={`/company/jobs/${job.id}/edit`}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
