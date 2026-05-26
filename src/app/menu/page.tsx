'use client'
import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, MENU_ITEMS } from '@/lib/data/menu'
import type { MenuItem } from '@/types/menu'
import { CategoryTabs } from '@/components/menu/CategoryTabs'
import { CategorySection } from '@/components/menu/CategorySection'
import { ItemCard } from '@/components/menu/ItemCard'
import { ItemModal } from '@/components/menu/ItemModal'
import { PageTransition } from '@/components/common/PageTransition'

const container = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 } 
  },
}

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  },
}

export default function MenuPage() {
  const [search, setSearch] = useState('')
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return MENU_ITEMS
    return MENU_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    )
  }, [search])

  const handleCloseModal = useCallback(() => setModalItem(null), [])

  const modalCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === modalItem?.cat) ?? null,
    [modalItem]
  )

  const isSearching = search.trim().length > 0

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-brand-bg">
        {/* Page header */}
        <div className="pt-24 pb-12 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(201,149,58,0.04),transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="text-brand-gold text-[10px] font-semibold uppercase mb-4 tracking-[0.4em]">The Laboratory</p>
              <h1 className="font-display italic text-6xl md:text-8xl text-brand-text tracking-tight leading-none">
                Our <span className="text-gradient-gold">Menu</span>
              </h1>
            </motion.div>
          </div>
        </div>

        <CategoryTabs
          categories={CATEGORIES}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
          {isSearching ? (
            <div className="min-h-[400px]">
              <p className="text-brand-muted text-sm mb-8 font-medium">
                {filteredItems.length > 0
                  ? `${filteredItems.length} precision results for "${search}"`
                  : `No matches found for "${search}"`}
              </p>
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {filteredItems.map((item) => {
                  const cat = CATEGORIES.find((c) => c.id === item.cat)!
                  return (
                    <motion.div key={item.id} variants={itemAnim}>
                      <ItemCard
                        item={item}
                        category={cat}
                        onOpenModal={setModalItem}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          ) : (
            CATEGORIES.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                items={MENU_ITEMS.filter((item) => item.cat === cat.id)}
                onOpenModal={setModalItem}
              />
            ))
          )}
        </div>

        <ItemModal
          item={modalItem}
          category={modalCategory}
          onClose={handleCloseModal}
        />
      </div>
    </PageTransition>
  )
}
