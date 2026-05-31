'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cartStore'
import { MENU_ITEMS, CATEGORIES, POPULAR_ITEM_IDS } from '@/lib/data/menu'
import { formatCurrency } from '@/lib/utils/formatting'
import { Plus, ArrowRight, Flame, Star } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { BLUR_PLACEHOLDER } from '@/lib/utils/blur'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

/* ─── Shared tilt handlers ────────────────────────────── */
function onEnter(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`
  el.style.borderColor = 'rgba(201,149,58,0.3)'
  el.style.boxShadow = `0 28px 56px -14px rgba(201,149,58,0.12), 0 0 0 1px rgba(201,149,58,0.05)`
}
function onLeave(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget as HTMLElement
  el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
  el.style.borderColor = 'var(--color-brand-border)'
  el.style.boxShadow = ''
}

export function PopularItems() {
  const router = useRouter()
  const { addItem } = useCart()
  const items = POPULAR_ITEM_IDS
    .map((id) => MENU_ITEMS.find((m) => m.id === id))
    .filter(Boolean) as typeof MENU_ITEMS

  function handleAdd(item: (typeof MENU_ITEMS)[number]) {
    if (item.sizes && item.sizes.length > 0) {
      toast.info(`Choose your size for ${item.name}`, {
        action: { label: 'View Menu', onClick: () => router.push('/menu') },
      })
      return
    }
    addItem({ menuItemId: item.id, categoryId: item.cat, name: item.name, price: item.price, quantity: 1 })
    toast.success(`${item.name} added to cart`, { description: formatCurrency(item.price) })
  }

  const [featured, ...rest] = items

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-brand-bg">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(201,149,58,0.07) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(201,77,21,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center md:items-end justify-between mb-14 gap-6"
        >
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ border: '1px solid rgba(201,77,21,0.2)', background: 'rgba(201,77,21,0.05)' }}>
              <Flame className="w-3 h-3" style={{ color: '#c94d15' }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#c94d15' }}>
                Most Ordered
              </span>
            </div>
            <h2 className="font-display italic leading-none tracking-tight" style={{ fontSize: 'clamp(2.2rem,6vw,4rem)' }}>
              <span className="text-brand-text">Crowd </span>
              <span className="text-gradient-fire">Favourites</span>
            </h2>
            <p className="text-brand-dim text-sm mt-2">What people keep coming back for</p>
          </div>
          <Link
            href="/menu"
            className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.03] text-brand-muted hover:text-brand-gold"
            style={{ border: '1px solid var(--color-brand-border)', background: 'var(--color-brand-card)' }}
          >
            Explore Full Menu
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* ── Bento grid ─────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {/* ── Featured hero card (spans 2 cols on lg+) ── */}
          {featured && (() => {
            const cat = CATEGORIES.find((c) => c.id === featured.cat)
            return (
              <motion.div
                key={featured.id}
                variants={cardAnim}
                className="group relative lg:col-span-2 rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  background: 'var(--color-brand-card)',
                  border: '1px solid var(--color-brand-border)',
                  transition: 'transform 0.18s ease, border-color 0.3s, box-shadow 0.3s',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  minHeight: 380,
                }}
                onClick={() => handleAdd(featured)}
                onMouseMove={onEnter}
                onMouseLeave={onLeave}
              >
                {/* Full-bleed image */}
                <div className="absolute inset-0">
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      className="object-cover group-hover:scale-105"
                      style={{ transition: 'transform 3s ease' }}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl"
                      style={{ background: `${cat?.accentColor ?? '#c94d15'}18` }}>
                      {cat?.icon}
                    </div>
                  )}
                  {/* Multi-layer gradient for text legibility */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(8,3,0,0.97) 0%, rgba(8,3,0,0.55) 40%, rgba(8,3,0,0.1) 75%, transparent 100%)' }} />
                  <div className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(201,77,21,0.18) 0%, transparent 55%)' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-end h-full p-7 md:p-9" style={{ minHeight: 380 }}>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {featured.badge && (
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: '#c9953a', color: '#070402' }}>
                        {featured.badge}
                      </span>
                    )}
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md"
                      style={{ background: 'rgba(10,5,0,0.8)', border: '1px solid rgba(201,149,58,0.2)', color: '#c9953a' }}>
                      <Star className="w-3 h-3 fill-current" /> Chef's Pick
                    </span>
                  </div>

                  <h3 className="font-display italic text-3xl md:text-4xl text-brand-text tracking-tight mb-2 group-hover:text-brand-gold transition-colors duration-300">
                    {featured.name}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed mb-6 max-w-sm line-clamp-2">
                    {featured.desc}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="px-4 py-2.5 rounded-xl backdrop-blur-md"
                      style={{ background: 'rgba(12,5,0,0.85)', border: '1px solid rgba(201,149,58,0.22)' }}>
                      <span className="font-display italic text-2xl" style={{ color: '#c9953a' }}>
                        {featured.sizes ? `From ${formatCurrency(featured.sizes[0].price)}` : formatCurrency(featured.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[11px] uppercase tracking-widest text-white transition-all duration-200 group-hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #c94d15, #a83c0a)', boxShadow: '0 8px 24px rgba(201,77,21,0.3)' }}>
                      <Plus className="w-3.5 h-3.5" />
                      Add to Order
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })()}

          {/* ── Standard cards ────────────────────────────── */}
          {rest.map((item) => {
            const cat = CATEGORIES.find((c) => c.id === item.cat)
            return (
              <motion.div
                key={item.id}
                variants={cardAnim}
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  background: 'var(--color-brand-card)',
                  border: '1px solid var(--color-brand-border)',
                  transition: 'transform 0.18s ease, border-color 0.3s, box-shadow 0.3s',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                onClick={() => handleAdd(item)}
                onMouseMove={onEnter}
                onMouseLeave={onLeave}
              >
                {/* Image */}
                <div className="h-56 relative overflow-hidden">
                  {item.image ? (
                    <>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        className="object-cover group-hover:scale-110"
                        style={{ transition: 'transform 2.5s ease' }}
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,77,21,0.12) 0%, transparent 60%)' }} />
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-7xl"
                      style={{ background: `${cat?.accentColor ?? '#c94d15'}10` }}>
                      {cat?.icon}
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(to top, rgba(8,3,0,0.9) 0%, rgba(8,3,0,0.1) 50%, transparent 70%)' }} />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                        style={{ background: '#c9953a', color: '#070402' }}>
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Price tag */}
                  <div className="absolute bottom-4 right-4 z-20">
                    <div className="px-3.5 py-2 rounded-xl backdrop-blur-md shadow-lg"
                      style={{ background: 'rgba(12,5,0,0.85)', border: '1px solid rgba(201,149,58,0.2)' }}>
                      <span className="font-display italic text-lg" style={{ color: '#c9953a' }}>
                        {item.sizes ? `From ${formatCurrency(item.sizes[0].price)}` : formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pb-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium text-base transition-colors duration-300 group-hover:text-brand-gold text-brand-text line-clamp-1">
                      {item.name}
                    </h3>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:scale-110"
                      style={{ background: 'rgba(201,77,21,0.08)', border: '1px solid rgba(201,77,21,0.15)' }}
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = '#c94d15'; el.style.borderColor = '#c94d15' }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(201,77,21,0.08)'; el.style.borderColor = 'rgba(201,77,21,0.15)' }}
                    >
                      <Plus className="w-4 h-4" style={{ color: '#c94d15' }} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-2 text-brand-dim">
                    {item.desc}
                  </p>

                  {/* Footer reveal */}
                  <div className="mt-4 pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ borderTop: '1px solid rgba(201,77,21,0.08)' }}>
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5" style={{ color: '#c94d15' }} />
                      <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: '#c9953a' }}>
                        Add to Order
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: '#c9953a' }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link href="/menu" className="font-bold text-sm pb-1"
            style={{ color: '#c94d15', borderBottom: '1px solid rgba(201,77,21,0.3)' }}>
            View full menu →
          </Link>
        </div>
      </div>
    </section>
  )
}
