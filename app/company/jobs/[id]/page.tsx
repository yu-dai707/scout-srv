// app/company/jobs/[id]/page.tsx
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
  companyId: number
  createdAt: string
}

export default function CompanyJobDetailPage({ params }: { params: { id: string } }) {
  const jobId = Number(params.id)

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [companyId, setCompanyId] = useState<number | null>(null)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // form state
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [requiredLanguage, setRequiredLanguage] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [description, setDescription] = useState('')
  const [visaSupport, setVisaSupport] = useState(false)

  useEffect(() => {
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
  }, [])

  const fetchJob = async (cid: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '取得に失敗しました')
        return
      }

      // 自社求人チェック（超簡易）
      if (data.companyId !== cid) {
        setError('この求人にアクセスする権限がありません')
        return
      }

      setJob(data)
      setTitle(data.title)
      setLocation(data.location)
      setRequiredLanguage(data.requiredLanguage)
      setRequiredSkills(data.requiredSkills)
      setDescription(data.description)
      setVisaSupport(!!data.visaSupport)
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          requiredLanguage,
          requiredSkills,
          description,
          visaSupport,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '更新に失敗しました')
        return
      }
      setJob(data)
      setMessage('更新しました！')
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('この求人を削除します。よろしいですか？')) return
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '削除に失敗しました')
        return
      }
      if (data.ok) {
        window.location.href = '/company/jobs'
      }
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setSaving(false)
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
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">求人 詳細 / 編集</h1>
          <div className="flex gap-2">
            <Link className="px-3 py-2 text-sm border rounded hover:bg-slate-50" href="/company/jobs">
              一覧へ戻る
            </Link>
          </div>
        </div>

        {loading && <p className="text-sm text-slate-600">読み込み中...</p>}
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {message && <p className="text-sm text-emerald-700 mb-3">{message}</p>}

        {job && !error && (
          <>
            <p className="text-xs text-slate-500 mb-4">
              Job ID: {job.id} / Company ID: {companyId}
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">求人タイトル</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">勤務地</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">必要な言語</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={requiredLanguage} onChange={(e) => setRequiredLanguage(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">必要なスキル</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">求人の詳細</label>
                <textarea className="w-full border rounded px-3 py-2 text-sm min-h-[140px]" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="flex items-center gap-2">
                <input id="visaSupport" type="checkbox" checked={visaSupport} onChange={(e) => setVisaSupport(e.target.checked)} />
                <label htmlFor="visaSupport" className="text-sm">ビザサポートあり</label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? '保存中...' : '更新する'}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  onClick={handleDelete}
                >
                  削除する
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
