import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🧪</span>
        </div>
        <h1 className="font-display text-5xl text-brand-white tracking-wider mb-2">404</h1>
        <p className="text-brand-muted text-sm mb-2">
          This page is not on today&apos;s menu.
        </p>
        <p className="text-brand-dim text-xs mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
