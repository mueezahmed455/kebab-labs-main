'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CheckoutForm {
  name: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  notes: string
  payment: 'card' | 'cash'
  privacyConsent: boolean
}

interface PromoState {
  code: string
  discount: number
  label: string
}

interface CheckoutStore {
  step: 1 | 2 | 3
  form: CheckoutForm
  orderReference: string
  promo: PromoState | null
  setStep: (step: 1 | 2 | 3) => void
  updateForm: (fields: Partial<CheckoutForm>) => void
  setOrderReference: (ref: string) => void
  setPromo: (promo: PromoState) => void
  clearPromo: () => void
  reset: () => void
}

const defaultForm: CheckoutForm = {
  name: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: 'Burnley',
  postcode: '',
  notes: '',
  payment: 'card',
  privacyConsent: false,
}

export const useCheckout = create<CheckoutStore>()(
  persist(
    (set) => ({
      step: 1,
      form: defaultForm,
      orderReference: '',
      promo: null,

      setStep: (step) => set({ step }),
      updateForm: (fields) =>
        set((state) => ({ form: { ...state.form, ...fields } })),
      setOrderReference: (ref) => set({ orderReference: ref }),
      setPromo: (promo) => set({ promo }),
      clearPromo: () => set({ promo: null }),
      reset: () => set({ step: 1, form: defaultForm, orderReference: '', promo: null }),
    }),
    { name: 'kebab-lab-checkout', skipHydration: true }
  )
)
