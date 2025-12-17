'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Modal from 'src/components/modal'

export default function CompanyCandidateScoutPage() {
  const params = useParams()
  const router = useRouter()
  const [id, setId] = useState<number | null>(null)
  const [message, setMessage] = useState('ぜひ面談したいです')
  const [openConfirm, setOpenConfirm] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openSuccess, setOpenSuccess] = useState(false)

  useEffect(() => {
    const pid = params?.id
    if (!pid) return
    const num = Number(pid)
    if (!Number.isFinite(num) || !Number.isInteger(num)) return
    setId(num)
  }, [params])

  const handleConfirm = async () => {
    if (!id) return
    const companyId = localStorage.getItem('companyId')
    if (!companyId) {
      setError('企業ログインが必要です')
      return
    }

    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/scouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: Number(companyId), candidateId: id, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '送信に失敗しました')

      setOpenConfirm(false)
      setOpenSuccess(true)
    } catch (e: any) {
      console.error(e)
      setError(e.message || '送信中にエラーが発生しました')
    } finally {
      setSending(false)
    }
  }

  if (id === null) return <p className="p-6">読み込み中...</p>

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{id} さんへスカウトを送る</h1>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="mb-4">
          <label className="text-sm text-slate-600">スカウトメッセージ</label>
          <textarea
            className="w-full border rounded px-3 py-2 mt-1"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenConfirm(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            disabled={sending}
          >
            送信
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
            disabled={sending}
          >
            キャンセル
          </button>
        </div>

        <Modal
          open={openConfirm}
          title="スカウトを送信します"
          message={`この内容で送信しますか？\n\n${message}`}
          confirmText={sending ? '送信中...' : '送信する'}
          cancelText="戻る"
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleConfirm}
        />
        <Modal
          open={openSuccess}
          title="送信完了"
          message="スカウトを送信しました。"
          confirmText="OK"
          onClose={() => {
            setOpenSuccess(false)
            router.push(`/company/candidates/${id}`)
          }}
          onConfirm={() => {
            setOpenSuccess(false)
            router.push(`/company/candidates/${id}`)
          }}
        />
      </div>
    </div>
  )
}
