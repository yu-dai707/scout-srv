// app/company/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CompanyLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/company/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'ログインに失敗しました')
        return
      }

      // ログイン情報を保存
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('companyName', data.user.name ?? '')
      localStorage.setItem('companyId', String(data.user.id))

      // ログイン成功 → 企業トップページへ
      window.location.href = '/company'
    } catch (err) {
      console.error(err)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          企業ログイン
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              メールアドレス
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              パスワード
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-4">
          アカウントをお持ちでない方は{' '}
          <Link href="/company/register" className="text-blue-600 hover:underline font-semibold">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  )
}
