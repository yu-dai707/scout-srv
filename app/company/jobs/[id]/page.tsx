// app/company/jobs/[id]/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Job = {
  id: number
  title: string
  description: string
  location: string
  requiredLanguage: string
  requiredSkills: string
  visaSupport: boolean
  companyId: number
  createdAt: string
}

export default function CompanyJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // ✅ Next.js App Router 正式対応
  const { id } = React.use(params)
  const jobId = useMemo(() => Number(id), [id])

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [companyId, setCompanyId] = useState<number | null>(null)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (Number.isNaN(jobId)) {
      setError('不正な求人IDです')
      return
    }

    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const cidStr = localStorage.getItem('companyId')

    if (!token || role !== 'company' || !cidStr) {
      window.location.href = '/company/login'
      return
    }

    const cid = Number(cidStr)
    if (Number.isNaN(cid)) {
      window.location.href = '/company/login'
      return
    }

    setCompanyId(cid)
    setCheckingAuth(false)

    fetchJob(cid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  const fetchJob = async (cid: number) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '求人の取得に失敗しました')
        return
      }

      // 🔒 自社求人チェック（簡易）
      if (data.companyId !== cid) {
        setError('この求人にアクセスする権限がありません')
        return
      }

      setJob(data)
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-slate-100 flex justify-center py-10 text-black">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">求人詳細</h1>

          <div className="flex gap-2">
            <Link
              className="px-3 py-2 text-sm border rounded hover:bg-slate-50"
              href="/company/jobs"
            >
              一覧へ戻る
            </Link>

            <Link
              className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              href={`/company/jobs/${jobId}/edit`}
            >
              編集する
            </Link>
          </div>
        </div>

        {loading && <p className="text-sm text-slate-600">読み込み中...</p>}
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {job && !error && (
          <div className="space-y-4">
            <div className="border rounded p-4 bg-slate-50">
              <p className="text-xs text-slate-500">
                Job ID: {job.id} / Company ID: {companyId}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                作成日: {new Date(job.createdAt).toLocaleString('ja-JP')}
              </p>
            </div>

            <div className="border rounded p-4">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>

              <p className="text-sm text-slate-700 mb-2">
                <span className="font-medium">勤務地：</span>{job.location}
              </p>

              <p className="text-sm text-slate-700 mb-1">
                <span className="font-medium">必要な言語：</span>{job.requiredLanguage}
              </p>

              <p className="text-sm text-slate-700 mb-2">
                <span className="font-medium">必要なスキル：</span>{job.requiredSkills}
              </p>

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

              <div className="mt-4">
                <p className="text-sm font-medium mb-1">求人の詳細</p>
                <p className="text-sm text-slate-800 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
