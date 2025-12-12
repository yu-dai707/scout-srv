// app/company/jobs/[id]/edit/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
}

export default function CompanyJobEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // ✅ App Router（params は Promise）
  const { id } = React.use(params)
  const jobId = useMemo(() => Number(id), [id])

  const router = useRouter()

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [companyId, setCompanyId] = useState<number | null>(null)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // フォーム用 state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [requiredLanguage, setRequiredLanguage] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [visaSupport, setVisaSupport] = useState(false)

  useEffect(() => {
    if (!Number.isInteger(jobId)) {
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
    if (!Number.isInteger(cid)) {
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

      // 自社求人チェック
      if (data.companyId !== cid) {
        setError('この求人を編集する権限がありません')
        return
      }

      setJob(data)

      // フォームへ反映
      setTitle(data.title)
      setDescription(data.description)
      setLocation(data.location)
      setRequiredLanguage(data.requiredLanguage)
      setRequiredSkills(data.requiredSkills)
      setVisaSupport(!!data.visaSupport)
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          location,
          requiredLanguage,
          requiredSkills,
          visaSupport,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '更新に失敗しました')
        return
      }

      alert('求人を更新しました')
      router.push(`/company/jobs/${jobId}`)
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
          <h1 className="text-2xl font-bold">求人編集</h1>

          <Link
            href={`/company/jobs/${jobId}`}
            className="px-3 py-2 text-sm border rounded hover:bg-slate-50"
          >
            詳細へ戻る
          </Link>
        </div>

        {loading && <p className="text-sm text-slate-600">処理中...</p>}
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {job && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="求人タイトル"
              required
            />

            <textarea
              className="w-full border rounded px-3 py-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="求人内容"
              required
            />

            <input
              className="w-full border rounded px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="勤務地"
              required
            />

            <input
              className="w-full border rounded px-3 py-2"
              value={requiredLanguage}
              onChange={(e) => setRequiredLanguage(e.target.value)}
              placeholder="必要言語"
              required
            />

            <input
              className="w-full border rounded px-3 py-2"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="必要スキル"
              required
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={visaSupport}
                onChange={(e) => setVisaSupport(e.target.checked)}
              />
              <span>ビザサポートあり</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700"
            >
              {loading ? '更新中...' : '更新する'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
