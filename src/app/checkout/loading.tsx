export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-brand-dark py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-brand-card rounded" />
        <div className="h-12 w-64 bg-brand-card rounded mx-auto" />
        <div className="flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-2 w-24 bg-brand-card rounded" />
          ))}
        </div>
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-brand-surface rounded" />
              <div className="h-10 w-full bg-brand-surface rounded-xl" />
            </div>
          ))}
        </div>
        <div className="h-12 w-full bg-brand-card rounded-xl" />
      </div>
    </div>
  )
}
