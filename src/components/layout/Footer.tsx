'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, Share2, Globe } from 'lucide-react'
import { KebabLabLogo } from '@/components/ui/KebabLabLogo'
import { BRAND } from '@/lib/data/brand'
import { HalalStamp } from '@/components/ui/HalalStamp'

const HOURS_DISPLAY = [
  { day: 'Monday',    time: '4:00 PM – 12:40 AM' },
  { day: 'Tuesday',   time: 'Closed', closed: true },
  { day: 'Wednesday', time: '4:00 PM – 12:40 AM' },
  { day: 'Thursday',  time: '4:00 PM – 12:40 AM' },
  { day: 'Friday',    time: '4:00 PM – 12:40 AM' },
  { day: 'Saturday',  time: '4:00 PM – 12:40 AM' },
  { day: 'Sunday',    time: '4:00 PM – 12:40 AM' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function Footer() {
  return (
    <footer className="bg-brand-card/50 border-t border-brand-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="lg:col-span-1">
            <div className="mb-5">
              <KebabLabLogo size={44} showWordmark={true} />
            </div>

            <p className="text-brand-muted text-sm leading-relaxed mb-5 max-w-xs">
              Where fire meets flavour. Handcrafted kebabs, stone-baked pizzas &amp; fresh shawarma in Burnley.
            </p>

            {/* Halal stamp */}
            <div className="flex items-center gap-4 mb-5 py-4 px-4 rounded-xl"
              style={{ background: 'rgba(15,155,94,0.06)', border: '1px solid rgba(15,155,94,0.15)' }}>
              <HalalStamp size={72} className="flex-shrink-0" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1 text-brand-green-light">
                  Halal Certified
                </p>
                <p className="text-[10px] text-brand-muted leading-snug">
                  All meats sourced from certified halal suppliers
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <a href={BRAND.social.instagram} target="_blank" rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-card border border-brand-border hover:border-brand-gold/30 transition-colors">
                <Share2 className="w-4 h-4 text-brand-muted hover:text-brand-gold" />
              </a>
              <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer"
                aria-label="Follow on Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-card border border-brand-border hover:border-brand-gold/30 transition-colors">
                <Globe className="w-4 h-4 text-brand-muted hover:text-brand-gold" />
              </a>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={fadeUp}>
            <h3 className="font-display italic text-lg tracking-wide text-brand-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Full Menu' },
                { href: '/deals', label: 'Meal Deals' },
                { href: '/about', label: 'About Us' },
                { href: '/menu#pizza', label: 'Pizza' },
                { href: '/menu#sharing', label: 'Sharing Platters' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-muted text-sm hover:text-brand-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Opening hours */}
          <motion.div variants={fadeUp}>
            <h3 className="font-display italic text-lg tracking-wide text-brand-text mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              Opening Hours
            </h3>
            <ul className="space-y-1.5">
              {HOURS_DISPLAY.map(({ day, time, closed }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{day}</span>
                  <span className={closed ? 'text-red-400' : 'text-brand-text'}>{time}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp}>
            <h3 className="font-display italic text-lg tracking-wide text-brand-text mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-brand-muted text-sm">{BRAND.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href={`tel:${BRAND.phoneRaw}`} className="text-brand-muted text-sm hover:text-brand-gold transition-colors">
                  {BRAND.phone}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-fire text-white font-medium text-sm hover:bg-brand-fire-dark transition-colors"
              >
                Order Now &rarr;
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-brand-dim text-sm">
            © {new Date().getFullYear()} The Kebab Lab. All rights reserved.
          </p>
          <p className="text-brand-dim text-xs">
            Min. delivery £{BRAND.delivery.minimumOrder} · Free over £{BRAND.delivery.freeOver} · {BRAND.delivery.radiusMiles}-mile radius
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
