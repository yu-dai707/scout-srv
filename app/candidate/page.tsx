'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <p className="text-slate-600 text-sm">認証確認中...</p>
      </div>
    )
  }

  const menuItems = [
    { onClick: () => router.push('/candidate/profile'), label: 'マイプロフィール', icon: '👤', color: 'from-indigo-600 to-indigo-700' },
    { onClick: () => router.push('/candidate/jobs'), label: '求人を探す', icon: '🔍', color: 'from-blue-600 to-blue-700' },
    { onClick: () => router.push('/candidate/scouts'), label: 'スカウト一覧', icon: '🎁', color: 'from-emerald-600 to-emerald-700' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                マイダッシュボード
              </h1>
              <p className="text-slate-600">
                ようこそ、<span className="font-semibold text-slate-900">{name ?? 'ゲスト'}</span> さん
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = '/candidate/login'
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.label}
                </h3>
                <div className="flex items-center text-slate-600 group-hover:gap-2 transition-all font-medium text-sm">
                  アクセス
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">次のステップ</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>プロフィールを完成させて、企業からのスカウト機会を増やしましょう</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>興味のある求人に応募して、あなたの次のキャリアを見つけてください</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">✓</span>
              <span>企業からのスカウトをチェックして、新しいチャンスを逃さないようにしましょう</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
