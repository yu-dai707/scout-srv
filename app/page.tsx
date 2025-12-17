// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Scout
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            グローバルな採用をシンプルに
          </p>
          <p className="text-slate-500">
            企業と外国人求職者をつなぐモダンな採用プラットフォーム
          </p>
        </div>

        {/* Login Options */}
        <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto mb-12">
          {/* 企業側 */}
          <Link
            href="/company/login"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-900">
                企業として利用
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                求人の掲載、外国人候補者へのスカウト、応募者管理をシームレスに。
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                ログインする
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 求職者側 */}
          <Link
            href="/candidate/login"
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-slate-900">
                求職者として利用
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                プロフィール作成、求人検索、スカウト受け取り。あなたの次のキャリアを見つけよう。
              </p>
              <div className="mt-6 flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
                ログインする
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-500 text-sm">
          <p>セキュアで透明性のある採用を実現します</p>
        </div>
      </div>
    </div>
  )
}
