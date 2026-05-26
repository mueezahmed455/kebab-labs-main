const FEATURES = [
  { icon: '🔥', title: 'Clay Oven Cooked',   sub: 'Authentic charcoal flavour' },
  { icon: '🌿', title: 'Always Fresh',        sub: 'Prepared daily, never frozen' },
  { icon: '🚗', title: 'Fast Delivery',       sub: '30-45 min to your door' },
  { icon: '⭐', title: '5-Star Quality',       sub: 'Rated 4.9 by our regulars' },
]

export function FeaturesBar() {
  return (
    <section className="bg-brand-navy border-y border-brand-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 py-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-xl">
                {icon}
              </div>
              <div>
                <p className="text-brand-white text-sm font-semibold">{title}</p>
                <p className="text-brand-dim text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
