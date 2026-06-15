'use client'

import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastState {
  toasts: Toast[]
  add: (message: string, type?: Toast['type']) => void
  remove: (id: number) => void
}

let counter = 0

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  add: (message, type = 'success') =>
    set((state) => ({ toasts: [...state.toasts, { id: ++counter, message, type }] })),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function toast(message: string, type: Toast['type'] = 'success') {
  useToast.getState().add(message, type)
}
