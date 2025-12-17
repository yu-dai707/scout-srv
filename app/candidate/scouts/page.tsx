'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Scout = {
  id: number
  message: string
  createdAt: string
  company: { id: number; name: string }
}

export default function CandidateScoutsPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Scout[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cid = localStorage.getItem('candidateId')
    if (!cid) {
      window.location.href = '/candidate/login'
      return
    }

    fetch(`/api/scouts?candidateId=${cid}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '取得に失敗しました')
        return data
      })
      .then((d) => setItems(d))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6">読み込み中...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <Link href="/candidate" className="text-indigo-600 hover:underline mb-4 inline-block">← TOPに戻る</Link>
        <h1 className="text-2xl font-bold mb-4">スカウト一覧</h1>

        {items.length === 0 && <p className="text-sm text-slate-600">スカウトはまだありません。</p>}

        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{s.company?.name ?? '企業'}</p>
                <span className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{s.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
