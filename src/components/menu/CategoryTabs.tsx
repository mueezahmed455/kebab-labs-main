'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import type { Category } from '@/types/menu'
import { cn } from '@/lib/utils'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

interface CategoryTabsProps {
  categories: Category[]
  search: string
  onSearchChange: (v: string) => void
}

export function CategoryTabs({ categories, search, onSearchChange }: CategoryTabsProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollTabIntoView = useCallback((id: string) => {
    const container = scrollRef.current
    if (!container) return
    const tab = container.querySelector(`[data-tab="${id}"]`) as HTMLElement | null
    if (!tab) return
    const offset = tab.offsetLeft - container.offsetLeft - 16
    container.scrollTo({ left: offset, behavior: 'smooth' })
  }, [])

  const handleTabClick = useCallback((id: string) => {
    const section = document.getElementById(id)
    if (section) {
      const y = section.getBoundingClientRect().top + window.scrollY - 140
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setActiveId(id)
    scrollTabIntoView(id)
  }, [scrollTabIntoView])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const sections = categories.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[]

    sections.forEach((section) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(section.id)
            scrollTabIntoView(section.id)
          }
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(section)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [categories, scrollTabIntoView])

  return (
    <div className="sticky top-16 z-40 bg-brand-bg border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3">
          <div
            ref={scrollRef}
            className="flex-1 flex gap-2 overflow-x-auto hide-scrollbar"
            role="tablist"
            aria-label="Menu categories"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                data-tab={cat.id}
                role="tab"
                aria-selected={activeId === cat.id}
                onClick={() => handleTabClick(cat.id)}
               className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 group',
                  activeId === cat.id
                    ? 'bg-brand-green text-brand-bg shadow-lg shadow-brand-green/10'
                    : 'bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-green/30'
                )}
              >
                <CategoryIcon 
                  id={cat.id} 
                  size={15} 
                  className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    activeId === cat.id ? "text-brand-bg" : "text-brand-muted group-hover:text-brand-text"
                  )} 
                />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search…"
              aria-label="Search menu items"
              className="w-36 sm:w-48 pl-9 pr-3 py-1.5 rounded-xl bg-brand-card border border-brand-border text-brand-text text-sm placeholder:text-brand-dim focus:outline-none focus:border-brand-green/50 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
