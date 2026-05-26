export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-brand-dark pb-16">
      {/* Skeleton tabs */}
      <div className="sticky top-16 z-30 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 py-4 overflow-x-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-brand-card border border-brand-border animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Array.from({ length: 3 }).map((_, section) => (
          <div key={section} className="mb-14">
            <div className="h-8 w-48 bg-brand-card rounded-lg animate-pulse mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, card) => (
                <div key={card} className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-32 bg-brand-surface" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-brand-surface rounded" />
                    <div className="h-3 w-full bg-brand-surface rounded" />
                    <div className="h-3 w-1/2 bg-brand-surface rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
