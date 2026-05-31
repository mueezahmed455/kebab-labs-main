'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { MapPin, Phone, Clock, ExternalLink, Navigation, ShieldCheck } from 'lucide-react'

const HOURS = [
  { day: 'Monday',    hours: '4:00 pm – 12:40 am', open: true  },
  { day: 'Tuesday',   hours: 'Closed',              open: false },
  { day: 'Wednesday', hours: '4:00 pm – 12:40 am', open: true  },
  { day: 'Thursday',  hours: '4:00 pm – 12:40 am', open: true  },
  { day: 'Friday',    hours: '4:00 pm – 12:40 am', open: true  },
  { day: 'Saturday',  hours: '4:00 pm – 12:40 am', open: true  },
  { day: 'Sunday',    hours: '4:00 pm – 12:40 am', open: true  },
]

const today = new Date().getDay() // 0 = Sun, 1 = Mon, ...
const dayOrder = [1, 2, 3, 4, 5, 6, 0]

export function FindUs() {
  const [mapLoaded, setMapLoaded] = useState(false)
  return (
    <section className="py-24 md:py-32 bg-brand-bg relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full blur-[200px] pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(ellipse, var(--color-brand-fire) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{
              border: '1px solid rgba(201,77,21,0.25)',
              background: 'rgba(201,77,21,0.07)',
            }}
          >
            <MapPin className="w-3 h-3" style={{ color: 'var(--color-brand-fire)' }} />
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--color-brand-fire)' }}>
              Burnley, Lancashire
            </span>
          </div>
          <h2
            className="font-display italic leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem,7vw,4.5rem)' }}
          >
            <span className="text-brand-text">Come Find </span>
            <span className="text-gradient-fire">Us</span>
          </h2>
          <p className="text-brand-muted mt-4 max-w-md mx-auto">
            Right in the heart of Burnley on Colne Road. Walk in or order online — we're ready from 4pm daily (closed Tuesdays).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Map — takes 3 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 rounded-2xl overflow-hidden min-h-[400px] relative"
            style={{ border: '1px solid var(--color-brand-border)' }}
          >
            {mapLoaded ? (
              <iframe
                src="https://maps.google.com/maps?q=53.8007574,-2.2364854&hl=en&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px', display: 'block', filter: 'invert(0.9) hue-rotate(185deg) saturate(0.8) brightness(0.85)' }}
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Kebab Lab location on Google Maps"
              />
            ) : (
              /* Luxury map placeholder — loads Google Maps only on click */
              <div
                className="group relative w-full min-h-[400px] cursor-pointer flex flex-col items-center justify-center gap-4"
                onClick={() => setMapLoaded(true)}
                role="button"
                aria-label="Load interactive map"
                style={{
                  background: 'linear-gradient(145deg, #0d0d0e 0%, #111212 40%, #0c0e0d 100%)',
                }}
              >
                {/* Grid lines texture */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'linear-gradient(rgba(212,164,74,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,164,74,0.6) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
                {/* Blurred glow behind icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(201,77,21,0.15), transparent 70%)' }} />

                <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
                  <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center border group-hover:border-brand-gold/40 transition-all duration-300 shadow-lg"
                    style={{ background: 'rgba(201,149,58,0.08)', border: '1px solid rgba(201,149,58,0.18)' }}>
                    <MapPin className="w-7 h-7 text-brand-gold" />
                  </div>
                  <div>
                    <p className="font-display italic text-xl text-brand-text tracking-tight">123 Colne Road, Burnley</p>
                    <p className="text-brand-muted text-sm mt-1">BB10 1LN · Lancashire</p>
                  </div>
                  <button
                    type="button"
                    className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-brand-bg transition-all group-hover:scale-105 duration-200"
                    style={{ background: 'linear-gradient(135deg, var(--color-brand-gold), var(--color-brand-gold-dark))' }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    View Interactive Map
                  </button>
                  <p className="text-brand-dim text-[10px]">Click to load Google Maps</p>
                </div>

                {/* Corner decorative address badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md"
                  style={{ background: 'rgba(10,10,12,0.85)', border: '1px solid rgba(201,149,58,0.2)', color: 'var(--color-brand-text)' }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-brand-gold" />
                  <span className="text-xs font-semibold">123 Colne Road, Burnley</span>
                </div>
              </div>
            )}

            {/* Map overlay badge — shows when map is loaded */}
            {mapLoaded && (
              <div
                className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold backdrop-blur-md"
                style={{
                  background: 'rgba(10,10,12,0.85)',
                  border: '1px solid rgba(201,149,58,0.2)',
                  color: 'var(--color-brand-text)',
                }}
              >
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#c9953a' }} />
                123 Colne Road, Burnley
              </div>
            )}
          </motion.div>

          {/* Info card — takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Address + phone */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: 'var(--color-brand-card)',
                border: '1px solid var(--color-brand-border)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,77,21,0.1)', border: '1px solid rgba(201,77,21,0.2)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--color-brand-fire)' }} />
                </div>
                <div>
                  <p className="text-brand-text font-semibold text-sm mb-0.5">Address</p>
                  <p className="text-brand-muted text-sm leading-relaxed">123 Colne Road<br />Burnley, BB10 1LN</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(15,155,94,0.1)', border: '1px solid rgba(15,155,94,0.2)' }}
                >
                  <Phone className="w-5 h-5" style={{ color: 'var(--color-brand-green)' }} />
                </div>
                <div>
                  <p className="text-brand-text font-semibold text-sm mb-0.5">Phone</p>
                  <a
                    href="tel:01282454626"
                    className="text-brand-muted text-sm hover:text-brand-green transition-colors"
                  >
                    01282 454 626
                  </a>
                </div>
              </div>

              {/* Food hygiene badge */}
              <div className="flex items-center gap-3 pt-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,149,58,0.1)', border: '1px solid rgba(201,149,58,0.2)' }}
                >
                  <ShieldCheck className="w-5 h-5" style={{ color: '#c9953a' }} />
                </div>
                <div>
                  <p className="text-brand-text font-semibold text-sm mb-0.5">Food Hygiene Rating</p>
                  <p className="text-brand-muted text-sm">FHRS 5 — Highest Rating ✓</p>
                </div>
              </div>
            </div>

            {/* Opening hours */}
            <div
              className="rounded-2xl p-6 flex-1"
              style={{
                background: 'var(--color-brand-card)',
                border: '1px solid var(--color-brand-border)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" style={{ color: '#c9953a' }} />
                <span className="text-brand-text font-semibold text-sm">Opening Hours</span>
              </div>
              <div className="space-y-2">
                {HOURS.map((h, i) => {
                  const isToday = dayOrder[i] === today
                  return (
                    <div
                      key={h.day}
                      className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg"
                      style={isToday ? { background: 'rgba(201,149,58,0.07)', border: '1px solid rgba(201,149,58,0.15)' } : {}}
                    >
                      <span className={`font-medium ${isToday ? 'text-brand-gold' : 'text-brand-muted'}`}>
                        {h.day}{isToday && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">(Today)</span>}
                      </span>
                      <span className={h.open ? (isToday ? 'text-brand-gold font-semibold' : 'text-brand-dim') : 'text-red-400 font-medium'}>
                        {h.hours}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=The+Kebab+Lab+Burnley&destination_place_id=ChIJh5-X8-x3h0cRwrKo_qDz5dg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 text-white"
                style={{ background: 'var(--color-brand-fire)' }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
              <a
                href="https://www.google.com/maps/place/The+Kebab+Lab+Burnley+ltd/@53.8007574,-2.2364854,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{
                  background: 'var(--color-brand-surface)',
                  border: '1px solid var(--color-brand-border)',
                  color: 'var(--color-brand-text)',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
