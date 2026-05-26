export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero skeleton */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="h-6 w-48 bg-brand-card rounded animate-pulse mx-auto" />
          <div className="h-20 w-96 bg-brand-card rounded animate-pulse mx-auto max-w-full" />
          <div className="h-4 w-72 bg-brand-card rounded animate-pulse mx-auto" />
          <div className="flex gap-4 justify-center mt-8">
            <div className="h-12 w-36 rounded-xl bg-brand-card animate-pulse" />
            <div className="h-12 w-36 rounded-xl bg-brand-card animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
