'use client'

import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import type { PublicProduct } from '@/lib/api'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'
import { toast } from '@/store/toast'

interface Props {
  product: PublicProduct
  quantity?: number
  variant?: 'compact' | 'full'
  openCartOnAdd?: boolean
}

export function AddToCartButton({ product, quantity = 1, variant = 'compact', openCartOnAdd }: Props) {
  const addItem = useCart((s) => s.addItem)
  const inCart = useCart((s) => s.items.find((i) => i.product.code === product.code)?.quantity ?? 0)
  const openCart = useUI((s) => s.openCart)
  const [added, setAdded] = useState(false)

  const outOfStock = product.stock <= 0
  const atMax = inCart >= product.stock

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (outOfStock) return
    if (atMax) {
      toast(`Solo hay ${product.stock} disponible(s) de "${product.name}"`, 'error')
      return
    }
    const full = addItem(product, quantity)
    toast(full ? `${product.name} agregado al carrito` : `Stock máximo alcanzado para "${product.name}"`, full ? 'success' : 'error')
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    if (openCartOnAdd) openCart()
  }

  const label = outOfStock ? 'Sin stock' : added ? 'Agregado' : variant === 'full' ? 'Agregar al carrito' : 'Agregar'

  if (variant === 'full') {
    return (
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors w-full"
      >
        {added ? <Check size={16} /> : <ShoppingCart size={16} />}
        {label}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      className="mt-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
      aria-label={`Agregar ${product.name} al carrito`}
    >
      {added ? <Check size={13} /> : <ShoppingCart size={13} />}
      {label}
    </button>
  )
}
