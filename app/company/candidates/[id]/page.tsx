// app/company/candidates/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Candidate = {
  id: number
  name: string
  nationality: string
  language: string
  skills: string
  visaStatus: string
  experience: string | null
  createdAt: string
}

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const candidateId = Number(params.id)

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [companyId, setCompanyId] = useState<number | null>(null)

  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [scoutMessage, setScoutMessage] = useState('')

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

    fetchCandidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCandidate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/candidates/${candidateId}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '取得に失敗しました')
        return
      }
      setCandidate(data)
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSendScout = async () => {
    if (!companyId) return
    if (!scoutMessage.trim()) {
      setMessage(null)
      setError('スカウト文を入力してください')
      return
    }

    setSending(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/scouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          candidateId,
          message: scoutMessage.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '送信に失敗しました')
        return
      }
      setScoutMessage('')
      setMessage('スカウトを送信しました！')
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setSending(false)
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
        <div className="flex items-center justify-between mb-4 text-black">
          <h1 className="text-2xl font-bold">求職者 詳細</h1>
          <div className="flex gap-2">
            <Link className="px-3 py-2 text-sm border rounded hover:bg-slate-50" href="/company/candidates">
              検索へ戻る
            </Link>
            <Link className="px-3 py-2 text-sm border rounded hover:bg-slate-50" href="/company">
              企業トップ
            </Link>
          </div>
        </div>

        {loading && <p className="text-sm text-slate-600">読み込み中...</p>}
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {message && <p className="text-sm text-emerald-700 mb-3">{message}</p>}

        {candidate && (
          <>
            <div className="border rounded p-4 mb-5">
              <p className="font-semibold text-lg">{candidate.name}</p>
              <p className="text-sm text-slate-700 mt-1">国籍: {candidate.nationality}</p>
              <p className="text-sm text-slate-700 mt-1">ビザ: {candidate.visaStatus}</p>
              <p className="text-sm text-slate-700 mt-1">言語: {candidate.language}</p>
              <p className="text-sm text-slate-700 mt-1">スキル: {candidate.skills}</p>
              {candidate.experience && (
                <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">
                  経験: {candidate.experience}
                </p>
              )}
            </div>

            <div className="border rounded p-4">
              <h2 className="font-semibold mb-2">スカウト送信</h2>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm min-h-[120px]"
                placeholder="スカウト文を入力..."
                value={scoutMessage}
                onChange={(e) => setScoutMessage(e.target.value)}
              />
              <button
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSendScout}
                disabled={sending}
              >
                {sending ? '送信中...' : 'スカウトを送る'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
