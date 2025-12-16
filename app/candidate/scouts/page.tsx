'use client'

export default function CandidateScoutsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">スカウト一覧</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <p className="text-sm text-slate-700 mb-4">
          企業から届いたスカウトが表示されます。
        </p>

        <ul className="text-sm text-slate-600 space-y-2">
          <li>・株式会社サンプルA からのスカウト</li>
          <li>・IT企業B からのスカウト</li>
        </ul>
      </div>
    </div>
  )
}
