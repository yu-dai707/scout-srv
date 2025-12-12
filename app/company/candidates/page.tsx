// app/company/candidates/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type CandidateRow = {
  id: number
  name: string
  nationality: string
  language: string
  skills: string
  visaStatus: string
  createdAt: string
}

export default function CompanyCandidatesPage() {
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [q, setQ] = useState('')
  const [nationality, setNationality] = useState('')
  const [language, setLanguage] = useState('')
  const [skills, setSkills] = useState('')
  const [visaStatus, setVisaStatus] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<CandidateRow[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const cid = localStorage.getItem('companyId')
    if (!token || role !== 'company' || !cid) {
      window.location.href = '/company/login'
      return
    }
    setCheckingAuth(false)
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchList = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (q.trim()) params.set('q', q.trim())
      if (nationality.trim()) params.set('nationality', nationality.trim())
      if (language.trim()) params.set('language', language.trim())
      if (skills.trim()) params.set('skills', skills.trim())
      if (visaStatus.trim()) params.set('visaStatus', visaStatus.trim())

      const res = await fetch(`/api/candidates?${params.toString()}`)
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
          <h1 className="text-2xl font-bold">求職者検索</h1>
          <Link className="px-3 py-2 text-sm border rounded hover:bg-slate-50" href="/company">
            企業トップへ
          </Link>
        </div>

        <div className="grid gap-2 md:grid-cols-5 mb-3 ">
          <input className="border rounded px-3 py-2 text-sm" placeholder="キーワード" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="国籍" value={nationality} onChange={(e) => setNationality(e.target.value)} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="言語" value={language} onChange={(e) => setLanguage(e.target.value)} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="スキル" value={skills} onChange={(e) => setSkills(e.target.value)} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="ビザ" value={visaStatus} onChange={(e) => setVisaStatus(e.target.value)} />
        </div>

        <div className="flex gap-2 mb-5">
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fetchList} disabled={loading}>
            {loading ? '検索中...' : '検索'}
          </button>
          <button
            className="px-4 py-2 text-sm border rounded hover:bg-slate-50"
            onClick={() => {
              setQ('')
              setNationality('')
              setLanguage('')
              setSkills('')
              setVisaStatus('')
            }}
            disabled={loading}
          >
            クリア
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="space-y-2">
          {items.map((c) => (
            <Link
              key={c.id}
              href={`/company/candidates/${c.id}`}
              className="block border rounded p-4 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between gap-2 text-black">
                <p className="font-semibold">{c.name}</p>
                <span className="text-xs text-slate-500">ID: {c.id}</span>
              </div>
              <p className="text-xs text-slate-700 mt-1">国籍: {c.nationality} / ビザ: {c.visaStatus}</p>
              <p className="text-xs text-slate-700 mt-1">言語: {c.language}</p>
              <p className="text-xs text-slate-700 mt-1">スキル: {c.skills}</p>
            </Link>
          ))}

          {items.length === 0 && !loading && !error && (
            <p className="text-sm text-slate-600">条件に一致する求職者がいません。</p>
          )}
        </div>
      </div>
    </div>
  )
}
