import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  sub?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  accent?: 'green' | 'blue' | 'orange' | 'purple'
}

const ACCENT = {
  green:  { icon: 'text-brand-green bg-brand-green/10 border-brand-green/20', trend: 'text-brand-green' },
  blue:   { icon: 'text-blue-400 bg-blue-400/10 border-blue-400/20',         trend: 'text-blue-400'   },
  orange: { icon: 'text-orange-400 bg-orange-400/10 border-orange-400/20',   trend: 'text-orange-400' },
  purple: { icon: 'text-purple-400 bg-purple-400/10 border-purple-400/20',   trend: 'text-purple-400' },
}

export function StatsCard({ title, value, sub, icon: Icon, trend, accent = 'green' }: StatsCardProps) {
  const styles = ACCENT[accent]

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center', styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn('text-xs font-semibold', trend.value >= 0 ? styles.trend : 'text-red-400')}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div className="font-display text-3xl text-brand-white tracking-wider leading-none mb-1">{value}</div>
      <div className="text-brand-muted text-sm">{title}</div>
      {sub && <div className="text-brand-dim text-xs mt-0.5">{sub}</div>}
    </div>
  )
}
