'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CandidateLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('/api/candidate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'ログインに失敗しました')
        return
      }

      // 🔴 ここが最重要
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', 'candidate')
      localStorage.setItem('candidateId', String(data.id)) // ★必須
      localStorage.setItem('userName', data.name)

      router.push('/candidate')
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 text-black">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold">求職者ログイン</h1>

        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          ログイン
        </button>
      </form>
    </div>
  )
}
