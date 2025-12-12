// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          外国人向けスカウトサービス
        </h1>
        <p className="text-center text-sm text-slate-600 mb-8">
          ログインするユーザー種別を選択してください
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 企業側 */}
          <Link
            href="/company/login"
            className="block border rounded-lg p-4 hover:shadow-md hover:border-blue-500 transition"
          >
            <h2 className="text-lg font-semibold mb-2 text-center text-black">
              企業としてログイン
            </h2>
            <p className="text-xs text-slate-600 text-center">
              求人の掲載や、候補者へのスカウトを行いたい企業の方はこちら
            </p>
          </Link>

          {/* 求職者側 */}
          <Link
            href="/candidate/login"
            className="block border rounded-lg p-4 hover:shadow-md hover:border-emerald-500 transition"
          >
            <h2 className="text-lg font-semibold mb-2 text-center text-black">
              求職者としてログイン
            </h2>
            <p className="text-xs text-slate-600 text-center">
              仕事を探している外国人の方はこちら
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
