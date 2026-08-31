'use client'

import { useEffect, useState } from 'react'
import { X, Download, Loader2 } from 'lucide-react'
import type { Order } from '@/lib/api'
import { formatUSD, orderNumber } from '@/lib/format'
import { ORDER_STATUS } from '@/lib/orderStatus'
import { useCustomerAuth } from '@/store/customerAuth'
import { fetchOrderReceiptBlob } from '@/lib/apiClient'
import { toast } from '@/store/toast'

interface Props {
  order: Order
  customerName?: string
  onClose: () => void
}

export function OrderDetailModal({ order, customerName, onClose }: Props) {
  const token = useCustomerAuth((s) => s.token)
  const [downloading, setDownloading] = useState(false)

  async function downloadPdf() {
    if (!token) return
    setDownloading(true)
    try {
      const blob = await fetchOrderReceiptBlob(token, order.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `comprobante-${order.id.slice(-8).toUpperCase()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast('No se pudo descargar el comprobante.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const status = ORDER_STATUS[order.status]
  const address = order.shippingAddress
  const date = new Date(order.createdAt).toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="no-print absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} className="text-[var(--foreground)]" />
        </button>

        {/* Comprobante imprimible */}
        <div id="receipt" className="p-6 sm:p-8 flex flex-col gap-4 text-[var(--foreground)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Mayor K</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Comprobante de compra</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-[#fa6f00]">{orderNumber(order.id)}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{date}</p>
              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                {status.label}
              </span>
            </div>
          </div>

          {customerName && (
            <div className="text-sm">
              <span className="text-[var(--muted-foreground)]">Cliente: </span>
              <span className="font-medium">{customerName}</span>
            </div>
          )}

          {/* Ítems */}
          <div className="border-t border-[var(--border)] pt-3 flex flex-col gap-1.5">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between gap-2 text-sm">
                <span className="text-[var(--muted-foreground)]">
                  {it.quantity}× {it.nameSnapshot}
                </span>
                <span>{formatUSD(it.unitPriceSnapshot * it.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="border-t border-[var(--border)] pt-3 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Subtotal</span>
              <span>{formatUSD(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Envío{order.shippingOption ? ` · ${order.shippingOption.name}` : ''}</span>
              <span>{order.shippingCost > 0 ? formatUSD(order.shippingCost) : 'Gratis'}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total</span>
              <span className="text-[#fa6f00]">{formatUSD(order.total)}</span>
            </div>
          </div>

          {/* Pago */}
          {(order.paymentMethod || order.paymentReference) && (
            <div className="border-t border-[var(--border)] pt-3 text-sm">
              <p className="text-xs font-semibold uppercase text-[var(--muted-foreground)] mb-1">Pago</p>
              {order.paymentMethod && <p>Método: {order.paymentMethod.name}</p>}
              {order.paymentReference && (
                <p>
                  Referencia: <span className="font-mono">{order.paymentReference}</span>
                </p>
              )}
            </div>
          )}

          {/* Envío */}
          {address && (address.line1 || address.fullName) && (
            <div className="border-t border-[var(--border)] pt-3 text-sm">
              <p className="text-xs font-semibold uppercase text-[var(--muted-foreground)] mb-1">Datos de envío</p>
              {address.fullName && <p>{address.fullName}{address.phone ? ` · ${address.phone}` : ''}</p>}
              {address.line1 && (
                <p className="text-[var(--muted-foreground)]">
                  {address.line1}
                  {address.city ? `, ${address.city}` : ''}
                  {address.state ? `, ${address.state}` : ''}
                </p>
              )}
              {address.reference && <p className="text-[var(--muted-foreground)] italic">Ref: {address.reference}</p>}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex justify-center">
          <button
            onClick={downloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-60 text-white transition-colors"
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  )
}
