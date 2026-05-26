'use client'
import { useMemo } from 'react'
import { formatCurrency } from '@/lib/utils/formatting'

interface DataPoint {
  label: string
  value: number
}

interface RevenueChartProps {
  data: DataPoint[]
  height?: number
}

export function RevenueChart({ data, height = 160 }: RevenueChartProps) {
  const max = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data])

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
      <p className="text-brand-muted text-xs font-medium tracking-widest uppercase mb-4">Revenue (Last 7 Days)</p>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((point) => {
          const pct = (point.value / max) * 100
          return (
            <div key={point.label} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-brand-green text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {formatCurrency(point.value)}
              </span>
              <div className="w-full rounded-t-lg bg-brand-green/10 border border-brand-green/20 relative overflow-hidden" style={{ height: `${Math.max(pct, 4)}%` }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-brand-green/40 rounded-t-lg transition-all"
                  style={{ height: '100%' }}
                />
              </div>
              <span className="text-brand-dim text-[10px]">{point.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
