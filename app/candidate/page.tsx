// app/candidate/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function CandidateTopPage() {
  const [name, setName] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedName = localStorage.getItem('userName')
    const storedRole = localStorage.getItem('userRole')

    if (!token || storedRole !== 'candidate') {
      window.location.href = '/candidate/login'
      return
    }

    setName(storedName)
    setRole(storedRole)
    setCheckingAuth(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    window.location.href = '/candidate/login'
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
        <h1 className="text-2xl font-bold mb-2 text-black">
          求職者トップページ
        </h1>
        <p className="mb-4 text-sm text-slate-700">
          ようこそ、{name ?? 'ゲスト'} さん（ロール: {role}）
        </p>

        <div className="grid gap-3 md:grid-cols-2 mb-6">
          <button
            className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
            onClick={() => alert('ここに「プロフィール編集ページ」への遷移を実装していく')}
          >
            プロフィールを編集
          </button>

          <button
            className="w-full bg-emerald-600 text-white py-2 rounded text-sm hover:bg-emerald-700"
            onClick={() => alert('ここに「マッチした求人一覧」画面への遷移を実装していく')}
          >
            マッチしている求人を見る
          </button>

          <button
            className="w-full bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700"
            onClick={() => alert('ここに「すべての求人一覧」画面への遷移を実装していく')}
          >
            求人一覧を見る
          </button>

          <button
            className="w-full bg-teal-600 text-white py-2 rounded text-sm hover:bg-teal-700"
            onClick={() => alert('ここに「スカウト一覧」画面への遷移を実装していく')}
          >
            スカウトを確認する
          </button>
        </div>

        <button
          className="w-full bg-slate-500 text-white py-2 rounded text-sm hover:bg-slate-600"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
