'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2, Package, LogIn, CheckCircle2, ArrowRight } from 'lucide-react'
import { CatalogHeader } from '@/components/layout/CatalogHeader'
import { CasheaCheckoutButton } from '@/components/checkout/CasheaCheckoutButton'
import { useCart, cartSubtotal } from '@/store/cart'
import { useCustomerAuth } from '@/store/customerAuth'
import { useUI } from '@/store/ui'
import { toast } from '@/store/toast'
import { formatUSD, orderNumber } from '@/lib/format'
import {
  fetchPaymentMethods,
  fetchShippingOptions,
  createOrder,
  setOrderPaymentReference,
  ApiError,
} from '@/lib/apiClient'
import type { PaymentMethod, ShippingOption, Order, OrderAddress } from '@/lib/api'

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
}

export default function CheckoutPage() {
  const items = useCart((s) => s.items)
  const cartHydrated = useCart((s) => s.hasHydrated)
  const clearCart = useCart((s) => s.clear)
  const { token, customer, hasHydrated: authHydrated } = useCustomerAuth()
  const openAuth = useUI((s) => s.openAuth)

  const [phase, setPhase] = useState<'form' | 'payment' | 'cashea' | 'success'>('form')
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [paymentId, setPaymentId] = useState('')
  const [shippingId, setShippingId] = useState('')
  const [address, setAddress] = useState<OrderAddress>({})
  const [cedula, setCedula] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idempotencyKey] = useState(newIdempotencyKey)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

  const subtotal = cartSubtotal(items)
  const selectedPayment = methods.find((m) => m.id === paymentId) || null
  const selectedShipping = options.find((o) => o.id === shippingId) || null
  const shippingCost = selectedShipping?.cost ?? 0
  const total = subtotal + shippingCost
  const isCashea = selectedPayment?.type === 'cashea'

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchPaymentMethods(), fetchShippingOptions()])
      .then(([m, o]) => {
        if (cancelled) return
        setMethods(m)
        setOptions(o)
      })
      .catch(() => {
        if (!cancelled) toast('No se pudieron cargar las opciones de pago/envío', 'error')
      })
      .finally(() => !cancelled && setLoadingData(false))
    return () => {
      cancelled = true
    }
  }, [])

  const payload = useMemo(
    () => ({
      items: items.map((i) => ({ code: i.product.code, quantity: i.quantity })),
      paymentMethodId: paymentId,
      shippingOptionId: shippingId,
      address: selectedShipping?.requiresAddress ? address : undefined,
      notes: notes.trim() || undefined,
      idempotencyKey,
    }),
    [items, paymentId, shippingId, selectedShipping, address, notes, idempotencyKey],
  )

  // Paso 1: reservar la orden en estado pendiente para obtener el número de pedido.
  async function reserveOrder() {
    setError(null)
    if (!token) {
      openAuth('login')
      return
    }
    if (!shippingId) return setError('Selecciona una opción de envío.')
    if (selectedShipping?.requiresAddress) {
      if (!address.fullName?.trim() || !address.phone?.trim() || !address.line1?.trim() || !address.city?.trim()) {
        return setError('Completa los datos de envío (nombre, teléfono, dirección y ciudad).')
      }
    }
    if (!paymentId) return setError('Selecciona un método de pago.')
    if (isCashea && !cedula.trim()) {
      return setError('Ingresa tu número de cédula para pagar con Cashea.')
    }

    setSubmitting(true)
    try {
      const order = await createOrder(token, payload)
      setCreatedOrder(order)
      setPhase(isCashea ? 'cashea' : 'payment')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  // Paso 2: adjuntar la referencia de pago (obligatoria) y completar el pedido.
  async function confirmPayment() {
    setError(null)
    if (!token || !createdOrder) return
    if (!paymentReference.trim()) {
      return setError('Ingresa la referencia de tu pago para completar el pedido.')
    }
    setSubmitting(true)
    try {
      await setOrderPaymentReference(token, createdOrder.id, paymentReference.trim())
      clearCart()
      setPhase('success')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo confirmar el pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  // ----- Estados de carga / gating -----
  if (!cartHydrated || !authHydrated || loadingData) {
    return (
      <Shell title="Checkout">
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[var(--muted-foreground)]" />
        </div>
      </Shell>
    )
  }

  if (phase === 'success' && createdOrder) {
    return (
      <Shell title="Pedido confirmado">
        <OrderConfirmation order={createdOrder} reference={paymentReference.trim()} />
      </Shell>
    )
  }

  if (items.length === 0 && phase === 'form') {
    return (
      <Shell title="Checkout">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={48} className="text-[var(--muted-foreground)] mb-4" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Tu carrito está vacío</h2>
          <Link
            href="/catalogo"
            className="mt-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </Shell>
    )
  }

  if (!customer) {
    return (
      <Shell title="Checkout">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <LogIn size={44} className="text-[var(--muted-foreground)] mb-4" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">Inicia sesión para continuar</h2>
          <p className="text-[var(--muted-foreground)] text-sm mb-5 max-w-sm">
            Puedes armar tu carrito sin cuenta, pero necesitas iniciar sesión para completar la compra.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  const isPaymentStep = phase === 'payment' || phase === 'cashea'

  return (
    <Shell title="Finalizar compra">
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-6">Finalizar compra</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {!isPaymentStep ? (
            <>
              {/* 1. Envío / Despacho — primero, para que el total ya incluya el envío */}
              <Section title="Envío / Despacho">
                {options.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No hay opciones de envío disponibles.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {options.map((o) => (
                      <label
                        key={o.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                          shippingId === o.id
                            ? 'border-[#FF6B1A] bg-[#FF6B1A]/5'
                            : 'border-[var(--border)] hover:bg-[var(--muted)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingId === o.id}
                          onChange={() => setShippingId(o.id)}
                          className="mt-1 accent-[#FF6B1A]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-[var(--foreground)]">{o.name}</p>
                            <span className="text-sm font-bold text-[var(--foreground)]">
                              {o.cost > 0 ? formatUSD(o.cost) : 'Gratis'}
                            </span>
                          </div>
                          {o.description && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{o.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {selectedShipping?.requiresAddress && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    <Input label="Nombre completo" value={address.fullName ?? ''} onChange={(v) => setAddress((a) => ({ ...a, fullName: v }))} />
                    <Input label="Teléfono" value={address.phone ?? ''} onChange={(v) => setAddress((a) => ({ ...a, phone: v }))} />
                    <div className="sm:col-span-2">
                      <Input label="Dirección" value={address.line1 ?? ''} onChange={(v) => setAddress((a) => ({ ...a, line1: v }))} />
                    </div>
                    <Input label="Ciudad" value={address.city ?? ''} onChange={(v) => setAddress((a) => ({ ...a, city: v }))} />
                    <Input label="Estado" value={address.state ?? ''} onChange={(v) => setAddress((a) => ({ ...a, state: v }))} />
                    <div className="sm:col-span-2">
                      <Input label="Referencia (opcional)" value={address.reference ?? ''} onChange={(v) => setAddress((a) => ({ ...a, reference: v }))} />
                    </div>
                  </div>
                )}
              </Section>

              {/* 2. Método de pago — colapsable: solo título, se expande al seleccionar */}
              <Section title="Método de pago">
                {methods.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No hay métodos de pago disponibles.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {methods.map((m) => {
                      const selected = paymentId === m.id
                      return (
                        <div
                          key={m.id}
                          className={`rounded-xl border transition-colors ${
                            selected ? 'border-[#FF6B1A] bg-[#FF6B1A]/5' : 'border-[var(--border)] hover:bg-[var(--muted)]'
                          }`}
                        >
                          <label className="flex items-center gap-3 p-3 cursor-pointer">
                            <input
                              type="radio"
                              name="payment"
                              checked={selected}
                              onChange={() => setPaymentId(m.id)}
                              className="accent-[#FF6B1A]"
                            />
                            <span className="text-sm font-semibold text-[var(--foreground)]">{m.name}</span>
                          </label>
                          {selected && m.instructions && (
                            <div className="px-3 pb-3 pl-9">
                              <p className="text-xs text-[var(--muted-foreground)] whitespace-pre-line leading-relaxed">
                                {m.instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
                {isCashea && (
                  <Input
                    label="Cédula de identidad"
                    value={cedula}
                    onChange={setCedula}
                    placeholder="Ej. 12345678"
                  />
                )}
              </Section>

              <Section title="Notas (opcional)">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Indicaciones para tu pedido"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[#FF6B1A]/60 resize-none"
                />
              </Section>
            </>
          ) : (
            /* Paso 2 — instrucciones de pago + referencia (obligatoria) */
            <Section title="Realiza tu pago">
              <div className="rounded-lg bg-[var(--muted)] p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Número de pedido</p>
                <p className="text-lg font-bold font-mono text-[#fa6f00]">
                  {createdOrder && orderNumber(createdOrder.id)}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Incluye este número como referencia/concepto al realizar tu pago.
                </p>
              </div>

              {selectedPayment?.instructions && (
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
                    Cómo pagar con {selectedPayment.name}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] whitespace-pre-line leading-relaxed">
                    {selectedPayment.instructions}
                  </p>
                </div>
              )}

              {phase === 'payment' && (
                <Input
                  label="Referencia de pago *"
                  value={paymentReference}
                  onChange={setPaymentReference}
                  placeholder="Nº de referencia / confirmación de tu pago"
                />
              )}
            </Section>
          )}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sticky top-20 flex flex-col gap-3">
            <h2 className="font-semibold text-[var(--foreground)]">Resumen del pedido</h2>
            {createdOrder && (
              <div className="flex justify-between items-center text-sm bg-[var(--muted)] rounded-lg px-3 py-2">
                <span className="text-[var(--muted-foreground)]">Nº de pedido</span>
                <span className="font-bold font-mono text-[#fa6f00]">{orderNumber(createdOrder.id)}</span>
              </div>
            )}
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {items.map((i) => (
                <div key={i.product.code} className="flex justify-between gap-2 text-sm">
                  <span className="text-[var(--muted-foreground)] truncate">
                    {i.quantity}× {i.product.name}
                  </span>
                  <span className="text-[var(--foreground)] shrink-0">
                    {formatUSD(i.product.priceWithProfit * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border)] pt-3 flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span className="text-[var(--foreground)]">{formatUSD(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Envío</span>
                <span className="text-[var(--foreground)]">{shippingCost > 0 ? formatUSD(shippingCost) : '—'}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span className="text-[var(--foreground)]">Total</span>
                <span className="text-[#fa6f00]">{formatUSD(total)}</span>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {phase === 'cashea' && createdOrder ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-[var(--muted-foreground)]">
                  Pedido creado. Continúa con Cashea para completar el pago inicial.
                </p>
                <CasheaCheckoutButton
                  orderId={createdOrder.id}
                  items={items}
                  shippingCost={shippingCost}
                  cedula={cedula}
                />
              </div>
            ) : phase === 'payment' ? (
              <button
                onClick={confirmPayment}
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-60 text-white transition-colors"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Confirmar pedido
                {!submitting && <CheckCircle2 size={16} />}
              </button>
            ) : (
              <button
                onClick={reserveOrder}
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-60 text-white transition-colors"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {isCashea ? 'Continuar a Cashea' : 'Generar pedido'}
                {!submitting && !isCashea && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <CatalogHeader title={title} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col gap-3">
      <h2 className="font-semibold text-[var(--foreground)]">{title}</h2>
      {children}
    </section>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[#FF6B1A]/60 focus:ring-1 focus:ring-[#FF6B1A]/20 transition"
      />
    </label>
  )
}

function OrderConfirmation({ order, reference }: { order: Order; reference?: string }) {
  return (
    <div className="max-w-xl mx-auto flex flex-col items-center text-center py-8">
      <CheckCircle2 size={56} className="text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-[var(--foreground)]">¡Pedido confirmado!</h1>
      <p className="text-[var(--muted-foreground)] mt-1">
        Pedido <span className="font-mono">{orderNumber(order.id)}</span>
      </p>

      <div className="w-full mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left flex flex-col gap-3">
        {order.items.map((it) => (
          <div key={it.id} className="flex justify-between gap-2 text-sm">
            <span className="text-[var(--muted-foreground)]">
              {it.quantity}× {it.nameSnapshot}
            </span>
            <span className="text-[var(--foreground)]">{formatUSD(it.unitPriceSnapshot * it.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold">
          <span className="text-[var(--foreground)]">Total</span>
          <span className="text-[#fa6f00]">{formatUSD(order.total)}</span>
        </div>
        {reference && (
          <div className="border-t border-[var(--border)] pt-3 text-sm">
            <span className="text-[var(--muted-foreground)]">Referencia de pago: </span>
            <span className="font-mono text-[var(--foreground)]">{reference}</span>
          </div>
        )}
        <p className="text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] pt-3">
          Te enviamos un correo con el resumen de tu compra. Puedes hacer seguimiento desde tu lista de pedidos.
        </p>
      </div>

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
    </div>
  )
}
