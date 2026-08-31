'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Package, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart, cartSubtotal } from '@/store/cart'
import { useUI } from '@/store/ui'
import { formatUSD } from '@/lib/format'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const items = useCart((s) => s.items)
  const setQuantity = useCart((s) => s.setQuantity)
  const removeItem = useCart((s) => s.removeItem)

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cartOpen, closeCart])

  if (!cartOpen) return null

  const subtotal = cartSubtotal(items)

  return (
    <div className="fixed inset-0 z-[55]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--background)] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#FF6B1A]" />
            <h2 className="font-semibold text-[var(--foreground)]">Tu carrito</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-[var(--muted)] transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} className="text-[var(--foreground)]" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <Package size={48} className="text-[var(--muted-foreground)] mb-4" />
            <p className="text-[var(--foreground)] font-medium">Tu carrito está vacío</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 mb-5">
              Agrega productos desde el catálogo.
            </p>
            <Link
              href="/catalogo"
              onClick={closeCart}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {items.map((item) => {
                const img = item.product.images[0]
                return (
                  <div
                    key={item.product.code}
                    className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-lg bg-[var(--muted)] overflow-hidden flex items-center justify-center">
                      {img ? (
                        <Image src={img.url} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      ) : (
                        <Package size={24} className="text-[var(--muted-foreground)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="text-sm font-medium text-[var(--foreground)] line-clamp-2 leading-snug">
                        {item.product.name}
                      </h3>
                      <p className="text-xs font-bold text-[#fa6f00] mt-0.5">
                        {formatUSD(item.product.priceWithProfit)}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setQuantity(item.product.code, item.quantity - 1)}
                            className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                            aria-label="Restar"
                          >
                            <Minus size={13} className="text-[var(--foreground)]" />
                          </button>
                          <span className="text-sm font-medium text-[var(--foreground)] w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.product.code, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Sumar"
                          >
                            <Plus size={13} className="text-[var(--foreground)]" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.code)}
                          className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                          aria-label="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-5 py-4 shrink-0 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Subtotal</span>
                <span className="text-lg font-bold text-[var(--foreground)]">{formatUSD(subtotal)}</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/carrito"
                  onClick={closeCart}
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                >
                  Ver carrito
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
                >
                  Continuar compra
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
