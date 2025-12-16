'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CandidateRegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/candidate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '登録に失敗しました')
        return
      }

      alert('登録が完了しました')
      router.push('/candidate/login')
    } catch (e) {
      console.error(e)
      setError('サーバーエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 text-black">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold">求職者登録</h1>

        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="お名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-slate-400"
        >
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>
    </div>
  )
}
