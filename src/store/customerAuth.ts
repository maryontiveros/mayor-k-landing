'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Customer } from '@/lib/api'

interface CustomerAuthState {
  token: string | null
  customer: Customer | null
  hasHydrated: boolean
  login: (token: string, customer: Customer) => void
  setCustomer: (customer: Customer) => void
  logout: () => void
}

export const useCustomerAuth = create<CustomerAuthState>()(
  persist(
    (set) => ({
      token: null,
      customer: null,
      hasHydrated: false,
      login: (token, customer) => set({ token, customer }),
      setCustomer: (customer) => set({ customer }),
      logout: () => set({ token: null, customer: null }),
    }),
    {
      name: 'mayor-k-customer-auth',
      partialize: (state) => ({ token: state.token, customer: state.customer }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    },
  ),
)
