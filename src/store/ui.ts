'use client'

import { create } from 'zustand'

type AuthMode = 'login' | 'register'

interface UIState {
  cartOpen: boolean
  authOpen: boolean
  authMode: AuthMode
  // callback opcional a ejecutar tras autenticarse con éxito (p. ej. continuar al checkout)
  onAuthSuccess: (() => void) | null
  openCart: () => void
  closeCart: () => void
  openAuth: (mode?: AuthMode, onSuccess?: () => void) => void
  closeAuth: () => void
  setAuthMode: (mode: AuthMode) => void
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  authOpen: false,
  authMode: 'login',
  onAuthSuccess: null,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openAuth: (mode = 'login', onSuccess) =>
    set({ authOpen: true, authMode: mode, onAuthSuccess: onSuccess ?? null }),
  closeAuth: () => set({ authOpen: false, onAuthSuccess: null }),
  setAuthMode: (mode) => set({ authMode: mode }),
}))
