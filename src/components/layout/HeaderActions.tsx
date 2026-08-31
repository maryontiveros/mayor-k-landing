'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Package, LogOut } from 'lucide-react'
import { useCart, cartCount } from '@/store/cart'
import { useCustomerAuth } from '@/store/customerAuth'
import { useUI } from '@/store/ui'
import { toast } from '@/store/toast'

export function CartButton() {
  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s.hasHydrated)
  const openCart = useUI((s) => s.openCart)
  const count = cartCount(items)

  return (
    <button
      onClick={openCart}
      className="relative p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="Abrir carrito"
    >
      <ShoppingCart size={20} />
      {hasHydrated && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#FF6B1A] text-white text-[10px] font-bold">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}

export function AccountButton() {
  const { customer, hasHydrated, logout } = useCustomerAuth()
  const openAuth = useUI((s) => s.openAuth)
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Hasta hidratar, mostramos el botón de acceso (estado público) para evitar mismatch
  if (!hasHydrated || !customer) {
    return (
      <button
        onClick={() => openAuth('login')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 hover:border-white/60 text-white/80 hover:text-white transition-colors"
      >
        <User size={15} />
        Inicia Sesión
      </button>
    )
  }

  const firstName = customer.name.split(' ')[0]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-white/30 hover:border-white/60 text-white/80 hover:text-white transition-colors"
      >
        <User size={15} />
        <span className="max-w-[90px] truncate">{firstName}</span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl py-1 z-50">
          <Link
            href="/mis-pedidos"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <Package size={15} />
            Mis pedidos
          </Link>
          <button
            onClick={() => {
              logout()
              setMenuOpen(false)
              toast('Sesión cerrada', 'info')
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
