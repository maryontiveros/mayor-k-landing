'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { CatalogHeader } from '@/components/layout/CatalogHeader'
import { useCart } from '@/store/cart'
import { useCustomerAuth } from '@/store/customerAuth'
import { confirmCasheaOrder, ApiError } from '@/lib/apiClient'

function CasheaReturnInner() {
  const params = useParams<{ orderId: string }>()
  const search = useSearchParams()
  const token = useCustomerAuth((s) => s.token)
  const authHydrated = useCustomerAuth((s) => s.hasHydrated)
  const clearCart = useCart((s) => s.clear)

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const ran = useRef(false)

  const orderId = params?.orderId
  const idNumber = search.get('idNumber')

  useEffect(() => {
    if (!authHydrated || ran.current) return
    ran.current = true

    if (!idNumber) {
      setStatus('error')
      setMessage('No se recibió el identificador de la orden de Cashea.')
      return
    }
    if (!token) {
      setStatus('error')
      setMessage('Tu sesión expiró. Inicia sesión y revisa "Mis pedidos".')
      return
    }

    confirmCasheaOrder(token, orderId, idNumber)
      .then(() => {
        clearCart()
        setStatus('success')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err instanceof ApiError ? err.message : 'No se pudo confirmar el pago con Cashea.')
      })
  }, [authHydrated, idNumber, token, orderId, clearCart])

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <CatalogHeader title="Pago Cashea" />
      <main className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-[var(--muted-foreground)] mb-4" />
            <h1 className="text-xl font-semibold text-[var(--foreground)]">Confirmando tu pago…</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">No cierres esta ventana.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 size={56} className="text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-[var(--foreground)]">¡Pago confirmado!</h1>
            <p className="text-[var(--muted-foreground)] mt-1">Tu pedido fue registrado correctamente.</p>
            <div className="flex gap-3 mt-6">
              <Link
                href="/mis-pedidos"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
              >
                Ver mis pedidos
              </Link>
              <Link
                href="/catalogo"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle size={56} className="text-red-500 mb-4" />
            <h1 className="text-xl font-semibold text-[var(--foreground)]">No pudimos confirmar el pago</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-sm">{message}</p>
            <Link
              href="/mis-pedidos"
              className="mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
            >
              Ir a mis pedidos
            </Link>
          </>
        )}
      </main>
    </div>
  )
}

export default function CasheaReturnPage() {
  return (
    <Suspense>
      <CasheaReturnInner />
    </Suspense>
  )
}
