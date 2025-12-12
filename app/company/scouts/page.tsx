// app/company/scouts/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Scout = {
  id: number
  message: string
  createdAt: string
  candidate: {
    id: number
    name: string
    nationality: string
    language: string
    skills: string
    visaStatus: string
  }
}

export default function CompanyScoutsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [companyId, setCompanyId] = useState<number | null>(null)

  const [items, setItems] = useState<Scout[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    fetchScouts(cid)
  }, [])

  const fetchScouts = async (cid: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/scouts?companyId=${cid}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '取得に失敗しました')
        return
      }
      setItems(data)
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('ja-JP')
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
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4 text-black">
          <h1 className="text-2xl font-bold">送ったスカウト一覧</h1>
          <div className="flex gap-2">
            <Link className="px-3 py-2 text-sm border rounded hover:bg-slate-50" href="/company">
              企業トップ
            </Link>
            {companyId && (
              <button className="px-3 py-2 text-sm border rounded hover:bg-slate-50" onClick={() => fetchScouts(companyId)}>
                再読み込み
              </button>
            )}
          </div>
        </div>

        {loading && <p className="text-sm text-slate-600">読み込み中...</p>}
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-slate-600">まだスカウトを送っていません。</p>
        )}

        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="border rounded p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">
                  宛先: {s.candidate.name}（ID: {s.candidate.id}）
                </p>
                <span className="text-xs text-slate-500">{formatDate(s.createdAt)}</span>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                国籍: {s.candidate.nationality} / ビザ: {s.candidate.visaStatus}
              </p>
              <p className="text-xs text-slate-700 mt-1">言語: {s.candidate.language}</p>
              <p className="text-xs text-slate-700 mt-1">スキル: {s.candidate.skills}</p>

              <p className="text-sm text-slate-800 mt-3 whitespace-pre-wrap">
                {s.message}
              </p>

              <div className="mt-3">
                <Link className="text-xs text-blue-600 hover:underline" href={`/company/candidates/${s.candidate.id}`}>
                  求職者詳細へ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
