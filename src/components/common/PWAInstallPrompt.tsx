'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share, PlusSquare, Smartphone, Sparkles, Download, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Detect if app is already running as standalone (installed)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      setIsStandalone(isStandaloneMode)
    }

    checkStandalone()

    // Detect iOS
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      const isIphone = /iphone|ipad|ipod/.test(userAgent)
      const isSafari = /safari/.test(userAgent) && !/crios|fxios|opera|twitter|fbav/.test(userAgent)
      setIsIOS(isIphone)
    }

    detectIOS()

    // Handle beforeinstallprompt for Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Optionally auto-prompt once if never dismissed
      const dismissed = localStorage.getItem('kebab-lab-pwa-dismissed')
      if (!dismissed) {
        // We can show a toast or a small banner instead of auto-opening the big modal
        // to avoid annoying the user
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for custom trigger event from other components (tab bar, nav, settings)
    const handleTrigger = () => {
      setShowPrompt(true)
    }

    window.addEventListener('trigger-pwa-install', handleTrigger)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('trigger-pwa-install', handleTrigger)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show native install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      toast.success('Thank you for installing The Kebab Lab App!', {
        description: 'You can now launch it directly from your home screen.',
      })
      setIsStandalone(true)
      setDeferredPrompt(null)
    } else {
      toast.info('App installation cancelled.')
    }
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('kebab-lab-pwa-dismissed', 'true')
  }

  // If already installed and running standalone, do not show any installer triggers
  if (isStandalone) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-brand-border bg-brand-card p-8 shadow-2xl z-10"
          >
            {/* Ambient fire glow background */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[100px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(201,77,21,0.2) 0%, transparent 70%)' }} />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full blur-[100px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(212,164,74,0.1) 0%, transparent 70%)' }} />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-surface border border-brand-border hover:border-brand-gold/30 hover:text-brand-gold transition-all duration-200"
              aria-label="Close installation window"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-brand-gold/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,77,21,0.15), rgba(212,164,74,0.05))',
                  boxShadow: '0 8px 32px rgba(201,77,21,0.1)',
                }}>
                <Sparkles className="h-8 w-8 text-brand-gold animate-pulse" />
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-brand-gold mb-1">Install Official App</span>
              <h2 className="font-display italic text-3xl text-brand-text leading-none">The Kebab Lab</h2>
              <p className="text-xs text-brand-muted mt-2 max-w-xs">
                Install our optimized mobile app on your phone for ultra-fast ordering, offline menu browsing, and live delivery tracking.
              </p>
            </div>

            {/* Dynamic steps based on OS */}
            {isIOS ? (
              /* iOS Safari Instructions */
              <div className="space-y-4 my-6 bg-brand-surface/40 border border-brand-border/60 rounded-2xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-1 text-center">iOS Installation Guide</p>
                <div className="h-[1px] w-8 bg-brand-gold/30 mx-auto mb-4" />

                <div className="flex items-start gap-4 text-left">
                  <div className="h-8 w-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <div>
                    <h3 className="text-xs font-semibold text-brand-text mb-0.5 flex items-center gap-1.5">
                      Tap the Share Button
                    </h3>
                    <p className="text-[11px] text-brand-muted leading-relaxed">
                      Locate and tap the share icon <Share className="inline h-3.5 w-3.5 text-brand-gold mx-0.5" /> in your Safari browser navigation bar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="h-8 w-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <div>
                    <h3 className="text-xs font-semibold text-brand-text mb-0.5 flex items-center gap-1.5">
                      Select Add to Home Screen
                    </h3>
                    <p className="text-[11px] text-brand-muted leading-relaxed">
                      Scroll down the options list and select <span className="text-brand-white font-medium">Add to Home Screen</span> <PlusSquare className="inline h-3.5 w-3.5 text-brand-gold mx-0.5" />.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="h-8 w-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <div>
                    <h3 className="text-xs font-semibold text-brand-text mb-0.5">
                      Confirm & Launch
                    </h3>
                    <p className="text-[11px] text-brand-muted leading-relaxed">
                      Tap <span className="text-brand-white font-medium">Add</span> in the top-right corner. The Kebab Lab app icon will now appear on your home screen!
                    </p>
                  </div>
                </div>
              </div>
            ) : deferredPrompt ? (
              /* Chrome/Android One-click Install */
              <div className="my-8 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleInstallClick}
                  className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-sm text-white overflow-hidden shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-brand-fire) 0%, var(--color-brand-fire-dark) 100%)',
                    boxShadow: '0 10px 30px rgba(224,96,48,0.3)',
                  }}
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12 bg-white/10" />
                  <Download className="h-4.5 w-4.5 animate-bounce" />
                  <span>Install App in 1-Click</span>
                </motion.button>
                <p className="text-[10px] text-brand-dim mt-3">Supports Chrome, Edge, Brave, and other Chromium browsers</p>
              </div>
            ) : (
              /* Unsupported Desktop or Fallback instructions */
              <div className="space-y-4 my-6 bg-brand-surface/40 border border-brand-border/60 rounded-2xl p-5 text-center">
                <Smartphone className="h-8 w-8 text-brand-gold mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-brand-text">How to Install</p>
                <p className="text-[11px] text-brand-muted leading-relaxed max-w-xs mx-auto">
                  Simply open your mobile browser menu (three dots in Chrome or share option in Safari) and select <span className="text-brand-white font-medium">Install App</span> or <span className="text-brand-white font-medium">Add to Home Screen</span>.
                </p>
              </div>
            )}

            {/* Quality Seal */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-brand-border/50 text-brand-dim">
              <ShieldCheck className="h-4 w-4 text-brand-green" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Premium Safe & Certified PWA</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Global helper to trigger PWA install modal from anywhere
export function triggerPWAInstall() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trigger-pwa-install'))
  }
}
