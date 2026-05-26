'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FlaskConical, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-brand-muted text-xs font-medium tracking-widest uppercase mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
      router.push('/account')
      router.refresh()
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.')
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-green/10 border border-brand-green/30 mb-4">
            <FlaskConical className="w-7 h-7 text-brand-green" />
          </div>
          <h1 className="font-display text-4xl text-brand-white tracking-wider">WELCOME BACK</h1>
          <p className="text-brand-muted text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <Field label="Email Address" error={errors.email?.message}>
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
          </Field>

          <Field label="Password" error={errors.password?.message}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-xl bg-brand-surface border text-brand-white text-sm placeholder:text-brand-dim focus:outline-none transition-colors',
                  errors.password ? 'border-red-500/50' : 'border-brand-border focus:border-brand-green/50'
                )}
              />
            </div>
          </Field>

          <div className="text-right">
            <Link href="/forgot-password" className="text-brand-muted text-xs hover:text-brand-green transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-green hover:underline">Create one</Link>
        </p>

        <div className="text-center mt-4">
          <Link href="/menu" className="text-brand-dim text-xs hover:text-brand-muted transition-colors">
            Continue as guest →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
