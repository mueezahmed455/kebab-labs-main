'use client'
import { useState, useMemo, useCallback } from 'react'
import { CATEGORIES, MENU_ITEMS } from '@/lib/data/menu'
import type { MenuItem } from '@/types/menu'
import { CategoryTabs } from '@/components/menu/CategoryTabs'
import { CategorySection } from '@/components/menu/CategorySection'
import { ItemCard } from '@/components/menu/ItemCard'
import { ItemModal } from '@/components/menu/ItemModal'

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
    <>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredItems.map((item) => {
                const cat = CATEGORIES.find((c) => c.id === item.cat)!
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    category={cat}
                    onOpenModal={setModalItem}
                  />
                )
              })}
            </div>
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
    </>
  )
}
