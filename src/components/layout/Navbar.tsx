'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, User, Package, LogOut, ShoppingCart } from 'lucide-react'
import { CartButton, AccountButton } from '@/components/layout/HeaderActions'
import { useCustomerAuth } from '@/store/customerAuth'
import { useUI } from '@/store/ui'
import { useCart, cartCount } from '@/store/cart'
import { toast } from '@/store/toast'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Productos', href: '#productos' },
  { label: '¿Por qué nosotros?', href: '#ventajas' },
  { label: 'Contacto', href: '#contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { customer, hasHydrated, logout } = useCustomerAuth()
  const openAuth = useUI((s) => s.openAuth)
  const openCart = useUI((s) => s.openCart)
  const items = useCart((s) => s.items)
  const count = cartCount(items)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0E1116]/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="#inicio" className="flex items-center gap-3 shrink-0">
          <Image src="/mayork-mark-on-dark.svg" alt="Mayor K" width={36} height={36} className="h-9 w-auto" />
          <span className="font-bold text-lg text-white leading-none">
            mayor<span className="text-[#1A6BFF]">k</span><span className="text-[#FF6B1A]">.</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/catalogo"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
          >
            Ver Catálogo
          </Link>
          <div className="hidden md:block">
            <AccountButton />
          </div>
          <CartButton />
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-[#0E1116]/98 backdrop-blur-sm border-t border-white/10">
          <ul className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-white/90 hover:text-white font-medium transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  setOpen(false)
                  openCart()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border border-white/30 text-white/80 hover:text-white transition-colors"
              >
                <ShoppingCart size={16} />
                Carrito{count > 0 ? ` (${count})` : ''}
              </button>
            </li>
            <li>
              <Link
                href="/catalogo"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-lg text-center font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
              >
                Ver Catálogo
              </Link>
            </li>
            {hasHydrated && customer ? (
              <>
                <li>
                  <Link
                    href="/mis-pedidos"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border border-white/30 text-white/80 hover:text-white transition-colors"
                  >
                    <Package size={16} />
                    Mis pedidos
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout()
                      setOpen(false)
                      toast('Sesión cerrada', 'info')
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border border-white/30 text-white/80 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    setOpen(false)
                    openAuth('login')
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border border-white/30 text-white/80 hover:text-white transition-colors"
                >
                  <User size={16} />
                  Inicia Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
