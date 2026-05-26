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
}

interface CheckoutStore {
  step: 1 | 2 | 3
  form: CheckoutForm
  orderReference: string
  setStep: (step: 1 | 2 | 3) => void
  updateForm: (fields: Partial<CheckoutForm>) => void
  setOrderReference: (ref: string) => void
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
}

export const useCheckout = create<CheckoutStore>()(
  persist(
    (set) => ({
      step: 1,
      form: defaultForm,
      orderReference: '',

      setStep: (step) => set({ step }),
      updateForm: (fields) =>
        set((state) => ({ form: { ...state.form, ...fields } })),
      setOrderReference: (ref) => set({ orderReference: ref }),
      reset: () => set({ step: 1, form: defaultForm, orderReference: '' }),
    }),
    { name: 'kebab-lab-checkout', skipHydration: true }
  )
)
