'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Package, LogIn } from 'lucide-react'
import { CatalogHeader } from '@/components/layout/CatalogHeader'
import { OrderDetailModal } from '@/components/ui/OrderDetailModal'
import { useCustomerAuth } from '@/store/customerAuth'
import { useUI } from '@/store/ui'
import { fetchMyOrders, ApiError } from '@/lib/apiClient'
import { formatUSD, orderNumber } from '@/lib/format'
import { ORDER_STATUS } from '@/lib/orderStatus'
import type { Order } from '@/lib/api'

export default function MisPedidosPage() {
  const { token, customer, hasHydrated, logout } = useCustomerAuth()
  const openAuth = useUI((s) => s.openAuth)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)

  useEffect(() => {
    if (!hasHydrated) return
    if (!token) {
      setLoading(false)
      return
    }
    let cancelled = false
    fetchMyOrders(token)
      .then((o) => !cancelled && setOrders(o))
      .catch((err) => {
        if (cancelled) return
        // token inválido/expirado → cerrar sesión
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) logout()
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [hasHydrated, token, logout])

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <CatalogHeader title="Mis pedidos" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6">Mis pedidos</h1>

        {!hasHydrated || loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[var(--muted-foreground)]" />
          </div>
        ) : !token ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LogIn size={44} className="text-[var(--muted-foreground)] mb-4" />
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Inicia sesión</h2>
            <p className="text-[var(--muted-foreground)] text-sm mb-5">Accede para ver tu historial de pedidos.</p>
            <button
              onClick={() => openAuth('login')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={44} className="text-[var(--muted-foreground)] mb-4" />
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Aún no tienes pedidos</h2>
            <Link
              href="/catalogo"
              className="mt-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const status = ORDER_STATUS[order.status]
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0)
              return (
                <button
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="w-full text-left rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[#FF6B1A]/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)] font-mono">
                        {orderNumber(order.id)}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('es-VE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        · {itemCount} artículo{itemCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {order.paymentMethod?.name ?? 'Pago'} · {order.shippingOption?.name ?? 'Envío'}
                    </span>
                    <span className="text-sm font-bold text-[#fa6f00]">{formatUSD(order.total)}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>

      {selected && (
        <OrderDetailModal order={selected} customerName={customer?.name} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
