'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CompanyRegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/company/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, country, city }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '登録に失敗しました')
        return
      }

      alert('登録が完了しました')
      router.push('/company/login')
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
        <h1 className="text-xl font-bold">企業登録</h1>

        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="企業名"
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

        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="国"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="都市"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-slate-400"
        >
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>
    </div>
  )
}
