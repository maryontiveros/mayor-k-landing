'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PublicProduct } from '@/lib/api'

export interface CartItem {
  product: PublicProduct
  quantity: number
}

// La disponibilidad puede ser fraccionaria; respetamos el stock como tope máximo.
// Es una validación orientativa: el checkout revalida contra la BD.
function clampToStock(quantity: number, stock: number | undefined): number {
  if (typeof stock !== 'number') return quantity
  return Math.min(quantity, Math.max(0, stock))
}

interface CartState {
  items: CartItem[]
  hasHydrated: boolean
  /** Agrega al carrito respetando el stock. Devuelve true si se agregó la cantidad completa. */
  addItem: (product: PublicProduct, quantity?: number) => boolean
  removeItem: (code: string) => void
  /** Ajusta la cantidad respetando el stock. Devuelve true si se aplicó la cantidad pedida. */
  setQuantity: (code: string, quantity: number) => boolean
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      addItem: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.product.code === product.code)
        const desired = (existing?.quantity ?? 0) + quantity
        const applied = clampToStock(desired, product.stock)
        if (applied <= (existing?.quantity ?? 0)) return false // ya en el tope de stock
        set((state) =>
          existing
            ? {
                items: state.items.map((i) =>
                  // refrescamos el product (precio/stock más recientes) además de la cantidad
                  i.product.code === product.code ? { product, quantity: applied } : i,
                ),
              }
            : { items: [...state.items, { product, quantity: applied }] },
        )
        return applied === desired
      },
      removeItem: (code) =>
        set((state) => ({ items: state.items.filter((i) => i.product.code !== code) })),
      setQuantity: (code, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((i) => i.product.code !== code) }))
          return true
        }
        const item = get().items.find((i) => i.product.code === code)
        const applied = clampToStock(quantity, item?.product.stock)
        set((state) => ({
          items: state.items.map((i) => (i.product.code === code ? { ...i, quantity: applied } : i)),
        }))
        return applied === quantity
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'mayor-k-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    },
  ),
)

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.priceWithProfit * i.quantity, 0)
}
