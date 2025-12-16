'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CompanyApplicationDetailPage() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState<number | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    // URLパラメータからIDを取得
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    console.log('Raw params.id:', params.id)
    console.log('Processed id:', id)

    if (!id) {
      setError('IDが見つかりません')
      setLoading(false)
      return
    }

    const numId = Number(id)
    console.log('Parsed numId:', numId)

    if (!Number.isFinite(numId)) {
      setError(`Invalid application id: ${id}`)
      setLoading(false)
      return
    }

    setApplicationId(numId)
  }, [params.id])

  useEffect(() => {
    if (applicationId === null) {
      return
    }

    const fetchDetail = async () => {
      try {
        console.log(`Fetching /api/company/applications/${applicationId}`)
        const res = await fetch(`/api/company/applications/${applicationId}`)
        const json = await res.json()
        console.log('Response:', json)
        if (!res.ok) throw new Error(json.error ?? '取得に失敗しました')
        setData(json)
        setError(null)
      } catch (e: any) {
        console.error('Error:', e)
        setError(e.message ?? 'サーバーエラー')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [applicationId])

  const handleStatusChange = async (newStatus: string) => {
    if (!applicationId) return

    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/company/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('ステータス更新に失敗しました')
      }

      const updatedData = await res.json()
      setData(updatedData)
    } catch (e: any) {
      alert(e.message ?? 'エラーが発生しました')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) return <p className="p-6">読み込み中...</p>
  if (error) return (
    <div className="min-h-screen bg-slate-100 p-8">
      <p className="p-6 text-red-600 text-xl font-bold">{error}</p>
      <div className="p-6 bg-white rounded shadow">
        <p className="text-sm text-gray-600">デバッグ情報:</p>
        <p className="text-sm font-mono">params.id: {JSON.stringify(params.id)}</p>
        <p className="text-sm font-mono">params: {JSON.stringify(params)}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <Link href="/company/applications" className="text-indigo-600 hover:underline mb-4 inline-block">
        ← 応募者一覧に戻る
      </Link>
      <div className="mt-6 bg-white rounded shadow p-6 text-black">
        <h2 className="text-xl font-bold mb-6">応募者詳細</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-semibold">候補者名</p>
            <p className="font-medium">{data?.candidate?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">メール</p>
            <p>{data?.candidate?.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">国籍</p>
            <p>{data?.candidate?.nationality || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">日本語レベル</p>
            <p>{data?.candidate?.japaneseLevel || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">スキル</p>
            <p>{data?.candidate?.skills || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">VISAステータス</p>
            <p>{data?.candidate?.visaStatus || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">現在の職種</p>
            <p>{data?.candidate?.currentJobType || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">職能試験</p>
            <p>{data?.candidate?.skillTest || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">所属組合</p>
            <p>{data?.candidate?.unionName || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">所属登録機関</p>
            <p>{data?.candidate?.registeredOrg || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600 font-semibold">自己PR</p>
            <p className="whitespace-pre-wrap">{data?.candidate?.selfPr || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600 font-semibold">自己紹介動画</p>
            {data?.candidate?.introVideoUrl ? (
              <a
                href={data.candidate.introVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline break-all"
              >
                {data.candidate.introVideoUrl}
              </a>
            ) : (
              <p>-</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">応募求人</p>
            <p className="font-medium">{data?.job?.title || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">ステータス</p>
            <select
              value={data?.status || 'UNCONFIRMED'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-black bg-white cursor-pointer disabled:opacity-50"
            >
              <option value="UNCONFIRMED">未確認</option>
              <option value="DOCUMENT">書類選考</option>
              <option value="FIRST">一次面接</option>
              <option value="SECOND">二次面接</option>
              <option value="APTITUDE">適性検査</option>
              <option value="FINAL">最終面接</option>
              <option value="OFFER">内定</option>
              <option value="REJECT">不合格</option>
              {/* backward compatibility */}
              <option value="PENDING">検討中</option>
              <option value="ACCEPTED">内定(旧)</option>
              <option value="REJECTED">不合格(旧)</option>
            </select>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">応募日</p>
            <p>{data?.createdAt ? new Date(data.createdAt).toLocaleString('ja-JP') : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
