'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Modal from 'src/components/modal'

const JP_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'] as const

export default function CandidateProfileEditPage() {
  const router = useRouter()

  const [candidateId, setCandidateId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  // ===== フォーム state（全部）=====
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nationality, setNationality] = useState('')
  const [japaneseLevel, setJapaneseLevel] =
    useState<(typeof JP_LEVELS)[number]>('N3')
  const [skills, setSkills] = useState('')
  const [visaStatus, setVisaStatus] = useState('')
  const [currentJobType, setCurrentJobType] = useState('')
  const [skillTest, setSkillTest] = useState('')
  const [unionName, setUnionName] = useState('')
  const [registeredOrg, setRegisteredOrg] = useState('')
  const [selfPr, setSelfPr] = useState('')
  const [introVideoFile, setIntroVideoFile] = useState<File | null>(null)

  // ===== 初期ロード =====
  useEffect(() => {
    const cidStr = localStorage.getItem('candidateId')
    if (!cidStr) {
      window.location.href = '/candidate/login'
      return
    }

    const cid = Number(cidStr)
    if (!Number.isFinite(cid)) {
      window.location.href = '/candidate/login'
      return
    }

    setCandidateId(cid)

    fetch(`/api/candidate/profile?candidateId=${cid}`)
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? '取得に失敗しました')
        return json
      })
      .then((p) => {
        setName(p.name ?? '')
        setEmail(p.email ?? '')
        setNationality(p.nationality ?? '')
        setJapaneseLevel(p.japaneseLevel ?? 'N3')
        setSkills(p.skills ?? '')
        setVisaStatus(p.visaStatus ?? '')
        setCurrentJobType(p.currentJobType ?? '')
        setSkillTest(p.skillTest ?? '')
        setUnionName(p.unionName ?? '')
        setRegisteredOrg(p.registeredOrg ?? '')
        setSelfPr(p.selfPr ?? '')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // ===== 保存前確認 =====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim()) {
      setError('名前とメールアドレスは必須です')
      return
    }

    setOpenConfirm(true)
  }

  // ===== 保存処理 =====
  const handleSave = async () => {
    if (!candidateId) return

    setSaving(true)
    setError(null)

    try {
      const fd = new FormData()
      fd.append('candidateId', String(candidateId))
      fd.append('name', name)
      fd.append('email', email)
      fd.append('nationality', nationality)
      fd.append('japaneseLevel', japaneseLevel)
      fd.append('skills', skills)
      fd.append('visaStatus', visaStatus)
      fd.append('currentJobType', currentJobType)
      fd.append('skillTest', skillTest)
      fd.append('unionName', unionName)
      fd.append('registeredOrg', registeredOrg)
      fd.append('selfPr', selfPr)

      if (introVideoFile) {
        fd.append('introVideo', introVideoFile)
      }

      const res = await fetch('/api/candidate/profile', {
        method: 'PUT',
        body: fd,
      })

      const contentType = res.headers.get('content-type')
      let data: any = null
      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      }

      if (!res.ok) {
        throw new Error(data?.error ?? '保存に失敗しました')
      }

      setOpenConfirm(false)
      router.push('/candidate/profile')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="p-6">読み込み中...</p>
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <Link
        href="/candidate/profile"
        className="inline-block text-sm text-indigo-600 mb-4 hover:underline"
      >
        ← プロフィールに戻る
      </Link>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="名前 *" value={name} onChange={setName} />
          <Input label="メールアドレス *" value={email} onChange={setEmail} />
          <Input label="国籍" value={nationality} onChange={setNationality} />

          <div>
            <label className="text-xs text-slate-600">日本語レベル（N1〜N5）</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={japaneseLevel}
              onChange={(e) =>
                setJapaneseLevel(e.target.value as (typeof JP_LEVELS)[number])
              }
            >
              {JP_LEVELS.map((lv) => (
                <option key={lv} value={lv}>
                  {lv}
                </option>
              ))}
            </select>
          </div>

          <Input label="スキル" value={skills} onChange={setSkills} />
          <Input label="VISAステータス" value={visaStatus} onChange={setVisaStatus} />
          <Input
            label="現在の職種（特定技能など）"
            value={currentJobType}
            onChange={setCurrentJobType}
          />
          <Input label="職能試験" value={skillTest} onChange={setSkillTest} />
          <Input label="所属組合" value={unionName} onChange={setUnionName} />
          <Input
            label="所属登録機関"
            value={registeredOrg}
            onChange={setRegisteredOrg}
          />

          <div>
            <label className="text-xs text-slate-600">自己PR</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={4}
              value={selfPr}
              onChange={(e) => setSelfPr(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">自己紹介動画</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setIntroVideoFile(e.target.files?.[0] ?? null)}
              className="block mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
        </form>
      </div>

      <Modal
        open={openConfirm}
        title="保存確認"
        message="この内容でプロフィールを保存しますか？"
        confirmText={saving ? '保存中...' : '保存'}
        cancelText="キャンセル"
        onClose={() => (!saving ? setOpenConfirm(false) : null)}
        onConfirm={saving ? undefined : handleSave}
      />
    </div>
  )
}

/* ===== 共通 Input ===== */
function Input({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-slate-600">{label}</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
