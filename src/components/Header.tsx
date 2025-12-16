import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header w-full border-b border-transparent">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="brand text-xl">Scout<span className="text-gray-400">.dev</span></Link>
          <nav className="hidden md:flex items-center gap-4 muted">
            <Link href="/jobs" className="hover:underline">求人一覧</Link>
            <Link href="/company" className="hover:underline">企業ページ</Link>
            <Link href="/candidate" className="hover:underline">応募者ページ</Link>
            <Link href="/scouts" className="hover:underline">スカウト</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/company/login" className="text-sm muted">企業ログイン</Link>
          <Link href="/candidate/login" className="btn-primary text-sm">応募者ログイン</Link>
        </div>
      </div>
    </header>
  )
}
