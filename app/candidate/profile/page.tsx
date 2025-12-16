'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Profile = {
  id: number
  name: string
  email: string
  nationality: string | null
  japaneseLevel: string | null
  skills: string | null
  visaStatus: string | null
  currentJobType: string | null
  skillTest: string | null
  unionName: string | null
  registeredOrg: string | null
  selfPr: string | null
  introVideoUrl: string | null
}

type RowProps = {
  label: string
  value: string | null | undefined
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex flex-col gap-1 rounded border bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm">{value && value.length > 0 ? value : '-'}</p>
    </div>
  )
}

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const candidateId = localStorage.getItem('candidateId')
    if (!candidateId) {
      window.location.href = '/candidate/login'
      return
    }

    fetch(`/api/candidate/profile?candidateId=${candidateId}`)
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? '取得に失敗しました')
        return json
      })
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="p-6">読み込み中...</p>
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <Link
        href="/candidate"
        className="inline-block text-sm text-indigo-600 mb-4 hover:underline"
      >
        ← トップに戻る
      </Link>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold">プロフィール</h1>

          <Link
            href="/candidate/profile/edit"
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            編集する
          </Link>
        </div>

        {/* 基本情報 */}
        <div className="grid gap-3 md:grid-cols-2">
          <Row label="名前" value={profile.name} />
          <Row label="メールアドレス" value={profile.email} />
          <Row label="国籍" value={profile.nationality} />
          <Row label="日本語レベル（N1〜N5）" value={profile.japaneseLevel} />
          <Row label="スキル" value={profile.skills} />
          <Row label="VISAステータス" value={profile.visaStatus} />
          <Row label="現在の職種（特定技能など）" value={profile.currentJobType} />
          <Row label="職能試験" value={profile.skillTest} />
          <Row label="所属組合" value={profile.unionName} />
          <Row label="所属登録機関" value={profile.registeredOrg} />
        </div>

        {/* 自己PR */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-1">自己PR</p>
          <p className="text-sm whitespace-pre-wrap rounded border bg-slate-50 p-3">
            {profile.selfPr ?? '-'}
          </p>
        </div>

        {/* 自己紹介動画 */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-1">自己紹介動画</p>
          {profile.introVideoUrl ? (
            <video
              src={profile.introVideoUrl}
              controls
              className="w-full max-w-md rounded border"
            />
          ) : (
            <p className="text-sm text-slate-600">-</p>
          )}
        </div>
      </div>
    </div>
  )
}
