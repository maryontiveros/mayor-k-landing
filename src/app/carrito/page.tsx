'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Package, Minus, Plus, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import { CatalogHeader } from '@/components/layout/CatalogHeader'
import { useCart, cartSubtotal } from '@/store/cart'
import { formatUSD } from '@/lib/format'

export default function CarritoPage() {
  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s.hasHydrated)
  const setQuantity = useCart((s) => s.setQuantity)
  const removeItem = useCart((s) => s.removeItem)

  const subtotal = cartSubtotal(items)

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <CatalogHeader title="Carrito" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6">Tu carrito</h1>

        {!hasHydrated ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[var(--muted-foreground)]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={48} className="text-[var(--muted-foreground)] mb-4" />
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Tu carrito está vacío</h2>
            <p className="text-[var(--muted-foreground)] text-sm mb-5">
              Explora el catálogo y agrega productos.
            </p>
            <Link
              href="/catalogo"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de items */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {items.map((item) => {
                const img = item.product.images[0]
                const lineTotal = item.product.priceWithProfit * item.quantity
                return (
                  <div
                    key={item.product.code}
                    className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-lg bg-[var(--muted)] overflow-hidden flex items-center justify-center">
                      {img ? (
                        <Image src={img.url} alt={item.product.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <Package size={28} className="text-[var(--muted-foreground)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-xs text-[var(--muted-foreground)] font-mono">{item.product.code}</span>
                      <h3 className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 leading-snug">
                        {item.product.name}
                      </h3>
                      <p className="text-sm font-bold text-[#fa6f00] mt-0.5">
                        {formatUSD(item.product.priceWithProfit)}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQuantity(item.product.code, item.quantity - 1)}
                            className="p-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                            aria-label="Restar"
                          >
                            <Minus size={14} className="text-[var(--foreground)]" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={item.product.stock}
                            value={item.quantity}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10)
                              if (!isNaN(v)) setQuantity(item.product.code, v)
                            }}
                            className="w-14 text-center text-sm py-1 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[#FF6B1A]/60"
                          />
                          <button
                            onClick={() => setQuantity(item.product.code, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Sumar"
                          >
                            <Plus size={14} className="text-[var(--foreground)]" />
                          </button>
                          {item.quantity >= item.product.stock && (
                            <span className="text-xs text-[var(--muted-foreground)]">máx.</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[var(--foreground)]">{formatUSD(lineTotal)}</span>
                          <button
                            onClick={() => removeItem(item.product.code)}
                            className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sticky top-20 flex flex-col gap-4">
                <h2 className="font-semibold text-[var(--foreground)]">Resumen</h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Subtotal</span>
                  <span className="font-bold text-[var(--foreground)]">{formatUSD(subtotal)}</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  El costo de envío se calcula en el siguiente paso.
                </p>
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
                >
                  Continuar compra
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/catalogo"
                  className="text-center text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
