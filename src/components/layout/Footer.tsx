import Link from 'next/link'
import { FlaskConical, Phone, MapPin, Clock, Share2, Globe } from 'lucide-react'
import { BRAND } from '@/lib/data/brand'

const HOURS_DISPLAY = [
  { day: 'Monday',    time: '4:00 PM – 12:40 AM' },
  { day: 'Tuesday',   time: 'Closed', closed: true },
  { day: 'Wednesday', time: '4:00 PM – 12:40 AM' },
  { day: 'Thursday',  time: '4:00 PM – 12:40 AM' },
  { day: 'Friday',    time: '4:00 PM – 12:40 AM' },
  { day: 'Saturday',  time: '4:00 PM – 12:40 AM' },
  { day: 'Sunday',    time: '4:00 PM – 12:40 AM' },
]

export function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-brand-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-green/10 border border-brand-green/30">
                <FlaskConical className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <div className="font-display text-lg leading-none text-brand-white tracking-wider">THE KEBAB LAB</div>
                <div className="text-[10px] text-brand-green leading-none tracking-widest uppercase">Clay Oven Specialist</div>
              </div>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed mb-4">
              Where fire meets flavour. Handcrafted kebabs, stone-baked pizzas & fresh shawarma in Burnley.
            </p>
            <div className="flex gap-3">
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-card border border-brand-border hover:border-brand-green/30 transition-colors"
              >
                <Share2 className="w-4 h-4 text-brand-muted hover:text-brand-green" />
              </a>
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-card border border-brand-border hover:border-brand-green/30 transition-colors"
              >
                <Globe className="w-4 h-4 text-brand-muted hover:text-brand-green" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-lg tracking-wider text-brand-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Full Menu' },
                { href: '/menu#pizza', label: 'Pizza' },
                { href: '/menu#sharing', label: 'Sharing Platters' },
                { href: '/checkout', label: 'Order Now' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-muted text-sm hover:text-brand-green transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening hours */}
          <div>
            <h3 className="font-display text-lg tracking-wider text-brand-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-green" />
              Opening Hours
            </h3>
            <ul className="space-y-1.5">
              {HOURS_DISPLAY.map(({ day, time, closed }) => (
                <li key={day} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{day}</span>
                  <span className={closed ? 'text-red-400' : 'text-brand-white'}>{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg tracking-wider text-brand-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                <span className="text-brand-muted text-sm">{BRAND.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-green flex-shrink-0" />
                <a href={`tel:${BRAND.phoneRaw}`} className="text-brand-muted text-sm hover:text-brand-green transition-colors">
                  {BRAND.phone}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-green text-brand-dark font-semibold text-sm hover:bg-brand-green-dark transition-colors"
              >
                Order Now →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-dim text-sm">
            © {new Date().getFullYear()} The Kebab Lab. All rights reserved.
          </p>
          <p className="text-brand-dim text-xs">
            Minimum delivery order £{BRAND.delivery.minimumOrder} · Free delivery over £{BRAND.delivery.freeOver} · {BRAND.delivery.radiusMiles}-mile radius
          </p>
        </div>
      </div>
    </footer>
  )
}
