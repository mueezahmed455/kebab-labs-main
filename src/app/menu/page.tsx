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
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
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
      <div className="relative">
        {/* Page header */}
        <div className="pt-8 pb-4 bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-brand-green text-sm font-medium tracking-widest uppercase mb-2">Order Online</p>
              <h1 className="font-display text-4xl md:text-6xl text-brand-text tracking-wider">THE MENU</h1>
            </motion.div>
          </div>
        </div>

        <CategoryTabs
          categories={CATEGORIES}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
          {isSearching ? (
            <div>
              <p className="text-brand-muted text-sm mb-6">
                {filteredItems.length > 0
                  ? `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''} for "${search}"`
                  : `No results for "${search}"`}
              </p>
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
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
