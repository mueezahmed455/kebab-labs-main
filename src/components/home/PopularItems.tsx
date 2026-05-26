'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/cartStore'
import { MENU_ITEMS, CATEGORIES, POPULAR_ITEM_IDS } from '@/lib/data/menu'
import { formatCurrency } from '@/lib/utils/formatting'
import { Plus, ArrowRight, Star, Flame } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function PopularItems() {
  const router = useRouter()
  const { addItem } = useCart()
  const items = POPULAR_ITEM_IDS.map((id) => MENU_ITEMS.find((m) => m.id === id)).filter(
    Boolean,
  ) as typeof MENU_ITEMS

  function handleAdd(item: (typeof MENU_ITEMS)[number]) {
    if (item.sizes && item.sizes.length > 0) {
      toast.info(`Choose your size for ${item.name}`, {
        action: { label: 'View Menu', onClick: () => router.push('/menu') },
      })
      return
    }
    addItem({
      menuItemId: item.id,
      categoryId: item.cat,
      name: item.name,
      price: item.price,
      quantity: 1,
    })
    toast.success(`${item.name} added to cart`, {
      description: formatCurrency(item.price),
    })
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-brand-bg">
      {/* Decorative glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(201,149,58,0.06) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(201,77,21,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6"
        >
          <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{
                  border: '1px solid rgba(201,149,58,0.2)',
                  background: 'rgba(201,149,58,0.06)',
                  color: '#c9953a',
                }}
              >
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
                  Chef&apos;s Recommendations
                </span>
              </motion.div>
              <h2
                className="font-display italic leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}
              >
                <span className="text-brand-text">Lab </span>
                <span className="text-gradient-gold">Signatures</span>
              </h2>
          </div>
          <Link
            href="/menu"
            className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.03] text-brand-muted hover:text-brand-gold"
            style={{
              border:     '1px solid var(--color-brand-border)',
              background: 'var(--color-brand-card)',
            }}
          >
            Explore Full Menu
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {items.map((item) => {
            const cat = CATEGORIES.find((c) => c.id === item.cat)
            return (
              <motion.div
                key={item.id}
                variants={cardAnim}
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  background:    'var(--color-brand-card)',
                  border:        '1px solid var(--color-brand-border)',
                  transition:    'transform 0.15s ease, border-color 0.3s, box-shadow 0.3s',
                  transformStyle:'preserve-3d',
                  willChange:    'transform',
                }}
                onClick={() => handleAdd(item)}
                onMouseMove={(e) => {
                  const el = e.currentTarget as HTMLElement
                  const r = el.getBoundingClientRect()
                  const x = (e.clientX - r.left) / r.width - 0.5
                  const y = (e.clientY - r.top) / r.height - 0.5
                  el.style.transform = `perspective(700px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) scale3d(1.025,1.025,1.025)`
                  el.style.borderColor = 'rgba(201,149,58,0.3)'
                  el.style.boxShadow = `0 24px 50px -12px rgba(201,149,58,0.1), 0 0 0 1px rgba(201,149,58,0.04)`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
                  el.style.borderColor = 'var(--color-brand-border)'
                  el.style.boxShadow = ''
                }}
              >
                {/* Image */}
                <div className="h-64 relative overflow-hidden">
                  {item.image ? (
                    <>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[2.5s] group-hover:scale-112"
                        style={{ transition: 'transform 2.5s ease' }}
                      />
                      {/* Steam effect on hover */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background:
                            'radial-gradient(ellipse at 50% 100%, rgba(201,77,21,0.1) 0%, transparent 60%)',
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className="h-full flex items-center justify-center text-7xl"
                      style={{ background: 'rgba(18,8,0,0.6)' }}
                    >
                      {cat?.icon}
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(8,3,0,0.9) 0%, rgba(8,3,0,0.15) 45%, transparent 70%)',
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {item.badge && (
                      <span
                        className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm"
                        style={{ background: '#c9953a', color: '#070402' }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.vegetarian && (
                      <span
                        className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                        style={{
                          background: 'rgba(15,155,94,0.85)',
                          color: '#fff',
                          border: '1px solid rgba(15,155,94,0.3)',
                        }}
                      >
                        Vegetarian
                      </span>
                    )}
                  </div>

                  {/* Price tag */}
                  <div className="absolute bottom-4 right-4 z-20">
                    <div
                      className="px-4 py-2 rounded-xl backdrop-blur-md shadow-lg"
                      style={{
                        background: 'rgba(12,5,0,0.82)',
                        border: '1px solid rgba(201,149,58,0.2)',
                      }}
                    >
                      <span className="font-display italic text-xl" style={{ color: '#c9953a' }}>
                        {item.sizes
                          ? `From ${formatCurrency(item.sizes[0].price)}`
                          : formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>

                  {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3
                      className="font-medium text-lg transition-colors duration-300 group-hover:text-brand-gold text-brand-text"
                    >
                      {item.name}
                    </h3>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 group-hover:scale-110"
                      style={{
                        background: 'rgba(201,77,21,0.08)',
                        border: '1px solid rgba(201,77,21,0.15)',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = '#c94d15'
                        el.style.borderColor = '#c94d15'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(201,77,21,0.08)'
                        el.style.borderColor = 'rgba(201,77,21,0.15)'
                      }}
                    >
                      <Plus className="w-5 h-5" style={{ color: '#c94d15' }} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-2 text-brand-dim">
                    {item.desc}
                  </p>

                  {/* Footer reveal */}
                  <div
                    className="mt-5 pt-5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ borderTop: '1px solid rgba(201,77,21,0.08)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5" style={{ color: '#c94d15' }} />
                      <span
                        className="text-[10px] font-semibold tracking-wider uppercase"
                        style={{ color: '#c9953a' }}
                      >
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

        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/menu"
            className="font-bold text-sm pb-1"
            style={{ color: '#c94d15', borderBottom: '1px solid rgba(201,77,21,0.3)' }}
          >
            View full menu →
          </Link>
        </div>
      </div>
    </section>
  )
}
