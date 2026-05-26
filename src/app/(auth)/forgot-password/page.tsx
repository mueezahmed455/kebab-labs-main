'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Valid email required'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/account`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-green/10 border border-brand-green/30 mb-4">
            <FlaskConical className="w-7 h-7 text-brand-green" />
          </div>
          <h1 className="font-display text-4xl text-brand-white tracking-wider">RESET PASSWORD</h1>
          <p className="text-brand-muted text-sm mt-1">We&apos;ll send you a reset link</p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-card border border-brand-green/30 rounded-2xl p-6 text-center"
            >
              <CheckCircle className="w-12 h-12 text-brand-green mx-auto mb-3" />
              <p className="text-brand-white font-semibold mb-1">Check your inbox</p>
              <p className="text-brand-muted text-sm">We sent a password reset link to your email address.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4"
            >
              {serverError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{serverError}
                </div>
              )}

              <div>
                <label className="block text-brand-muted text-xs font-medium tracking-widest uppercase mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-xl bg-brand-surface border text-brand-white text-sm placeholder:text-brand-dim focus:outline-none transition-colors',
                      errors.email ? 'border-red-500/50' : 'border-brand-border focus:border-brand-green/50'
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />{errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                ) : 'Send Reset Link'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-brand-muted text-sm hover:text-brand-green transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
