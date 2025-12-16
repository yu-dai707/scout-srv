'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CandidateTopPage() {
  const [name, setName] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const storedName = localStorage.getItem('userName')

    if (!token || role !== 'candidate') {
      window.location.href = '/candidate/login'
      return
    }

    setName(storedName)
    setCheckingAuth(false)
  }, [])

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 text-sm">認証確認中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center text-black">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-1">求職者トップ</h1>
        <p className="text-sm text-slate-700 mb-6">
          ようこそ、{name ?? 'ゲスト'} さん
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => router.push('/candidate/profile')}
            className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
          >
            プロフィール
          </button>

          <button
            onClick={() => router.push('/candidate/jobs')}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            求人一覧
          </button>
        </div>

        <button
          onClick={() => {
            localStorage.clear()
            window.location.href = '/candidate/login'
          }}
          className="w-full bg-slate-500 text-white py-2 rounded hover:bg-slate-600"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
