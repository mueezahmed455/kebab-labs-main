'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FlaskConical, Mail, Lock, User, Phone, AlertCircle, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
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

function InputIcon({ icon: Icon, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ElementType; error?: string }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim" />
      <input
        {...props}
        className={cn(
          'w-full pl-10 pr-4 py-3 rounded-xl bg-brand-surface border text-brand-white text-sm placeholder:text-brand-dim focus:outline-none transition-colors',
          error ? 'border-red-500/50' : 'border-brand-border focus:border-brand-green/50'
        )}
      />
    </div>
  )
}

export default function RegisterPage() {
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
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName, phone: data.phone || '' },
        },
      })
      if (error) throw error
      router.push('/account')
      router.refresh()
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
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
          <h1 className="font-display text-4xl text-brand-white tracking-wider">CREATE ACCOUNT</h1>
          <p className="text-brand-muted text-sm mt-1">Join The Kebab Lab family</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{serverError}
            </div>
          )}

          <Field label="Full Name" error={errors.fullName?.message}>
            <InputIcon icon={User} {...register('fullName')} placeholder="John Smith" autoComplete="name" error={errors.fullName?.message} />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <InputIcon icon={Mail} {...register('email')} type="email" placeholder="you@example.com" autoComplete="email" error={errors.email?.message} />
          </Field>

          <Field label="Phone (optional)" error={errors.phone?.message}>
            <InputIcon icon={Phone} {...register('phone')} type="tel" placeholder="01282 000 000" autoComplete="tel" error={errors.phone?.message} />
          </Field>

          <Field label="Password" error={errors.password?.message}>
            <InputIcon icon={Lock} {...register('password')} type="password" placeholder="Min. 8 characters" autoComplete="new-password" error={errors.password?.message} />
          </Field>

          <Field label="Confirm Password" error={errors.confirmPassword?.message}>
            <InputIcon icon={Lock} {...register('confirmPassword')} type="password" placeholder="Repeat password" autoComplete="new-password" error={errors.confirmPassword?.message} />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-green text-brand-dark font-bold text-sm hover:bg-brand-green-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-green hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
