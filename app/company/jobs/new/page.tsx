// app/company/jobs/new/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function NewJobPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [requiredLanguage, setRequiredLanguage] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [visaSupport, setVisaSupport] = useState(false)

  const [companyId, setCompanyId] = useState<number | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const storedCompanyId = localStorage.getItem('companyId')

    if (!token || role !== 'company' || !storedCompanyId) {
      window.location.href = '/company/login'
      return
    }

    const parsedId = Number(storedCompanyId)
    if (Number.isNaN(parsedId)) {
      window.location.href = '/company/login'
      return
    }

    setCompanyId(parsedId)
    setCheckingAuth(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyId) return

    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
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
          companyId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '求人の登録に失敗しました')
        return
      }

      setMessage('求人を登録しました！')
      // フォームをクリア
      setTitle('')
      setDescription('')
      setLocation('')
      setRequiredLanguage('')
      setRequiredSkills('')
      setVisaSupport(false)
    } catch (err) {
      console.error(err)
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-black">
          新規求人登録
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-black"> 
              求人タイトル
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              勤務地
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="例: Tokyo, Japan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              必要な言語
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="例: Japanese N2, English"
              value={requiredLanguage}
              onChange={(e) => setRequiredLanguage(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              必要なスキル
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="例: JavaScript, React, Node.js"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              求人の詳細
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="visaSupport"
              type="checkbox"
              checked={visaSupport}
              onChange={(e) => setVisaSupport(e.target.checked)}
            />
            <label htmlFor="visaSupport" className="text-sm text-black">
              ビザサポートあり
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '登録中...' : '求人を登録する'}
          </button>
        </form>
      </div>
    </div>
  )
}
