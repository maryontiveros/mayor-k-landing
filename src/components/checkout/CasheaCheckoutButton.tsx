'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import type { CartItem } from '@/store/cart'

interface Props {
  orderId: string
  items: CartItem[]
  shippingCost: number
  cedula: string
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_CASHEA_PUBLIC_KEY
const STORE_ID = process.env.NEXT_PUBLIC_CASHEA_STORE_ID
const EXTERNAL_CLIENT_ID = process.env.NEXT_PUBLIC_CASHEA_EXTERNAL_CLIENT_ID

// Monta el botón de Web Checkout de Cashea usando su SDK (clave pública).
// El SDK es un bundle de navegador, por eso se importa dinámicamente en el cliente.
export function CasheaCheckoutButton({ orderId, items, shippingCost, cedula }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false

    async function mount() {
      if (!PUBLIC_KEY || !STORE_ID || !EXTERNAL_CLIENT_ID) {
        setErrorMsg('La integración con Cashea no está configurada.')
        setStatus('error')
        return
      }

      try {
        const mod = await import('cashea-web-checkout-sdk')
        // El bundle UMD exporta la clase como default
        const CheckoutSDK = (mod as { default?: unknown }).default ?? mod
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sdk = new (CheckoutSDK as any)({ apiKey: PUBLIC_KEY })

        const payload = {
          identificationNumber: cedula,
          externalClientId: EXTERNAL_CLIENT_ID,
          invoiceId: orderId,
          deliveryMethod: 'IN_STORE',
          merchantName: 'Mayor K',
          redirectUrl: `${window.location.origin}/checkout/cashea-return/${orderId}`,
          deliveryPrice: shippingCost,
          orders: [
            {
              store: { id: Number(STORE_ID), name: 'Mayor K', enabled: true },
              products: items.map((i) => ({
                id: i.product.code,
                name: i.product.name,
                sku: i.product.code,
                description: i.product.description || i.product.name,
                imageUrl: i.product.images[0]?.url || '',
                quantity: i.quantity,
                price: i.product.priceWithProfit,
                tax: 0,
                discount: 0,
              })),
            },
          ],
        }

        if (cancelled || !containerRef.current) return
        containerRef.current.innerHTML = ''
        sdk.createCheckoutButton({ payload, container: containerRef.current })
        setStatus('ready')
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'No se pudo cargar Cashea.')
        setStatus('error')
      }
    }

    mount()
    return () => {
      cancelled = true
    }
  }, [orderId, items, shippingCost, cedula])

  return (
    <div className="flex flex-col gap-2">
      {status === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Loader2 size={16} className="animate-spin" />
          Cargando Cashea…
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}
      <div ref={containerRef} />
    </div>
  )
}
