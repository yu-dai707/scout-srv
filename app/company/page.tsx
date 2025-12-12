// app/company/page.tsx
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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 text-sm">認証確認中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl text-black">
        <h1 className="text-2xl font-bold mb-2">企業トップページ</h1>
        <p className="mb-5 text-sm text-slate-700">ようこそ、{companyName ?? '企業様'} さん</p>

        <div className="grid gap-3 md:grid-cols-2 mb-6">
          <Link
            className="w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
            href="/company/jobs/new"
          >
            求人を作成する
          </Link>

          <Link
            className="w-full text-center bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 text-sm"
            href="/company/jobs"
          >
            自社の求人一覧
          </Link>

          <Link
            className="w-full text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 text-sm"
            href="/company/candidates"
          >
            求職者を検索する
          </Link>

          <Link
            className="w-full text-center bg-teal-600 text-white py-2 rounded hover:bg-teal-700 text-sm"
            href="/company/scouts"
          >
            送ったスカウト一覧
          </Link>
        </div>

        <button
          className="w-full bg-slate-500 text-white py-2 rounded hover:bg-slate-600 text-sm"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}
