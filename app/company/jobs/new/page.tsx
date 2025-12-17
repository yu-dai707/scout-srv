// app/company/jobs/new/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-slate-600 text-sm">認証確認中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            新規求人登録
          </h1>
          <Link href="/company" className="text-slate-600 hover:text-slate-900 font-medium">
            TOP
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2"> 
                求人タイトル
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="例: Senior Software Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                勤務地
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="例: Tokyo, Japan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                必要言語
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="例: Japanese N2, English"
                value={requiredLanguage}
                onChange={(e) => setRequiredLanguage(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                必須スキル
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="例: JavaScript, React, Node.js"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                求人の詳細
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[120px]"
                placeholder="職務内容、要件、待遇などを詳しく記入してください..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <input
                id="visaSupport"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                checked={visaSupport}
                onChange={(e) => setVisaSupport(e.target.checked)}
              />
              <label htmlFor="visaSupport" className="text-sm font-medium text-slate-700 cursor-pointer">
                ビザサポート対応
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}
            {message && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-600 font-medium">{message}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? '登録中...' : '求人を登録する'}
              </button>
              <Link
                href="/company"
                className="flex-1 text-center px-6 py-3 text-slate-700 font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
