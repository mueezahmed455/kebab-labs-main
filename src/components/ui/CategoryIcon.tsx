'use client'
import React from 'react'

interface CategoryIconProps {
  id: string
  className?: string
  size?: number
  strokeWidth?: number
}

export function CategoryIcon({ 
  id, 
  className = '', 
  size = 24, 
  strokeWidth = 1.8 
}: CategoryIconProps) {
  
  // Custom luxury geometric SVG paths for each food category
  // Using clean vector lines to replace amateurish system emojis
  const renderIcon = () => {
    switch (id) {
      case 'kebabs':
        // Flame + Skewer concept
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M5 20l14-14" />
            <path d="M19 5l-2-2" />
            <path d="M7 21l-2-2" />
            <path d="M9 11.5c.5-2 2-3.5 3-4.5.5 1.5 1 3 0 4.5s-2 2-3 0z" className="text-brand-fire fill-brand-fire/10" />
            <path d="M12.5 15c.5-1.5 1.5-2.5 2.5-3.5.5 1 1 2.5 0 3.5s-2 1.5-2.5 0z" className="text-brand-gold fill-brand-gold/10" />
          </svg>
        )
      
      case 'shawarma':
        // Modern wrap logo with steam
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="7" y="6" width="10" height="15" rx="3" className="fill-brand-gold/5" />
            <path d="M7 11h10" />
            <path d="M7 16h10" />
            <path d="M10 21V6" />
            <path d="M14 21V6" />
            <path d="M9 3c0-.8.5-1.5 1.2-1.5s1.2.7 1.2 1.5" />
            <path d="M12.6 3c0-.8.5-1.5 1.2-1.5s1.2.7 1.2 1.5" />
          </svg>
        )

      case 'donner':
        // Vertical rotating grill spit
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12 3v18M6 21h12" />
            <path d="M9 6h6c1 0 2 .8 2 2v6c0 1.2-1 2-2 2H9c-1 0-2-.8-2-2V8c0-1.2 1-2 2-2z" className="fill-brand-fire/5" />
            <path d="M7 9h10" />
            <path d="M7 12h10" />
            <path d="M7 15h10" />
          </svg>
        )

      case 'combos':
        // Crossed flame skewers
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M4 20L20 4M20 20L4 4" />
            <circle cx="12" cy="12" r="3" className="fill-brand-gold/20 text-brand-gold" />
            <path d="M12 7c1.5-1.5 2.5-3 2.5-3s-1.5 1-2.5 2.5z" />
            <path d="M12 17c-1.5 1.5-2.5 3-2.5 3s1.5-1 2.5-2.5z" />
          </svg>
        )

      case 'deals':
        // Premium gift tag with star
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" className="fill-brand-green/5" />
            <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
            <path d="M12 10.5l.8 1.6 1.8.3-1.3 1.2.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.2 1.8-.3z" className="text-brand-green fill-brand-green" />
          </svg>
        )

      case 'burgers':
        // Premium minimalist geometric burger
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M3 11h18M3 15h18" />
            <path d="M4 11a8 8 0 0 1 16 0" className="fill-brand-gold/10" />
            <rect x="4" y="15" width="16" height="4" rx="2" className="fill-brand-gold/10" />
            <path d="M5 11c0 1.5 1 2 2 2s2-.5 3-2M9 11c0 1.5 1 2 2 2s2-.5 3-2M13 11c0 1.5 1 2 2 2s2-.5 3-2M17 11c0 1.5 1 2 2 2s2-.5 3-2" />
          </svg>
        )

      case 'pizza':
        // Premium slice outline
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12 2L3 17.5a1 1 0 0 0 .8 1.5h16.4a1 1 0 0 0 .8-1.5L12 2z" className="fill-brand-fire/5" />
            <path d="M12 2c-.2.5-.5 1-1 1.5s-1 .8-1.5 1" />
            <path d="M3 18c1.5-.5 3-.5 4.5 0s3 .5 4.5 0M12 18c1.5.5 3 .5 4.5 0s3-.5 4.5 0" />
            <circle cx="10" cy="14" r="1" className="fill-brand-fire text-brand-fire" />
            <circle cx="14" cy="11" r="1.2" className="fill-brand-fire text-brand-fire" />
            <circle cx="11" cy="8" r="0.8" className="fill-brand-fire text-brand-fire" />
          </svg>
        )

      case 'sharing':
        // Circular sharing platter
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <circle cx="12" cy="12" r="9" className="fill-brand-gold/5" />
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="12" r="3" className="fill-brand-bg" />
            <circle cx="7.5" cy="7.5" r="1.5" className="fill-brand-gold" />
            <circle cx="16.5" cy="7.5" r="1.5" className="fill-brand-gold" />
            <circle cx="7.5" cy="16.5" r="1.5" className="fill-brand-gold" />
            <circle cx="16.5" cy="16.5" r="1.5" className="fill-brand-gold" />
          </svg>
        )

      case 'extras':
        // Minimal geometric fries box
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M6 12L5 22h14l-1-10" className="fill-brand-gold/5" />
            <path d="M9 12V3M12 12V2M15 12V4M7.5 12V6M16.5 12V5" />
            <path d="M5 12h14" />
          </svg>
        )

      case 'drinks':
        // Highball luxury glass
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M6 3l1.5 18h9L18 3H6z" className="fill-brand-green/5" />
            <path d="M7.5 21h9" />
            <path d="M14.5 3l-4.5 12M15 8h-3.5" />
            <path d="M6 7h12" />
          </svg>
        )

      default:
        // Default clean food cover (dome)
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M3 19h18M5 19a7 7 0 0 1 14 0" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        )
    }
  }

  return (
    <div 
      className={className} 
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${id} icon`}
    >
      {renderIcon()}
    </div>
  )
}
