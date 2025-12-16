export default function Footer() {
  return (
    <footer className="w-full border-t mt-12 py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm muted">© {new Date().getFullYear()} Scout.dev — All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a className="text-sm muted hover:underline" href="#">利用規約</a>
          <a className="text-sm muted hover:underline" href="#">プライバシー</a>
        </div>
      </div>
    </footer>
  )
}
