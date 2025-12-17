'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CompanyTopPage() {
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    const storedCompanyName = localStorage.getItem('companyName')
    const storedCompanyId = localStorage.getItem('companyId')

    if (!token || role !== 'company' || !storedCompanyId) {
      window.location.href = '/company/login'
      return
    }

    setCompanyName(storedCompanyName)
    setCheckingAuth(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('companyName')
    localStorage.removeItem('companyId')
    window.location.href = '/company/login'
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-slate-600 text-sm">認証確認中...</p>
      </div>
    )
  }

  const menuItems = [
    { href: '/company/jobs/new', label: '求人を作成する', icon: '✏️', color: 'from-blue-600 to-blue-700' },
    { href: '/company/jobs', label: '自社の求人一覧', icon: '📋', color: 'from-emerald-600 to-emerald-700' },
    { href: '/company/applications', label: '応募者一覧', icon: '👥', color: 'from-indigo-600 to-indigo-700' },
    { href: '/company/candidates', label: '求職者一覧', icon: '🔍', color: 'from-pink-600 to-pink-700' },
    { href: '/company/scouts', label: 'スカウト送信履歴', icon: '🎯', color: 'from-teal-600 to-teal-700' },
    { href: '/company/profile', label: '企業プロフィール', icon: '🏢', color: 'from-purple-600 to-purple-700' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                ダッシュボード
              </h1>
              <p className="text-slate-600">
                ようこそ、<span className="font-semibold text-slate-900">{companyName ?? '企業様'}</span> さん
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xl mb-4 shadow-md`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.label}
                </h3>
                <div className="flex items-center text-slate-600 group-hover:gap-2 transition-all font-medium text-sm">
                  アクセス
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats (Optional) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-600 text-sm font-semibold mb-1">公開中の求人</p>
            <p className="text-3xl font-bold text-blue-600">-</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-600 text-sm font-semibold mb-1">受け取った応募</p>
            <p className="text-3xl font-bold text-emerald-600">-</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-600 text-sm font-semibold mb-1">送信スカウト</p>
            <p className="text-3xl font-bold text-purple-600">-</p>
          </div>
        </div>
      </div>
    </div>
  )
}
