'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-700/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="font-display text-4xl text-brand-white tracking-wider mb-2">SOMETHING BROKE</h1>
        <p className="text-brand-muted text-sm mb-2">
          We hit an unexpected error. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-brand-dim text-xs mb-6 font-mono">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
