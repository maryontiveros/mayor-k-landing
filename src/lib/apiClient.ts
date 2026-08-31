// Cliente API del lado del navegador para el storefront.
// Adjunta el token de cliente (Bearer) cuando se le pasa.
import type {
  PaymentMethod,
  ShippingOption,
  Customer,
  Order,
  OrderAddress,
} from './api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.token) headers['Authorization'] = `Bearer ${options.token}`

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : null) || 'Ocurrió un error. Intenta de nuevo.'
    throw new ApiError(message, res.status)
  }

  return data as T
}

export { ApiError }

// ----- Autenticación de clientes -----

export interface AuthResult {
  token: string
  customer: Customer
}

export function registerCustomer(input: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<AuthResult> {
  return request<AuthResult>('/v1/customer/register', { method: 'POST', body: input })
}

export function loginCustomer(input: { email: string; password: string }): Promise<AuthResult> {
  return request<AuthResult>('/v1/customer/login', { method: 'POST', body: input })
}

export function getMe(token: string): Promise<Customer> {
  return request<Customer>('/v1/customer/me', { token })
}

export function forgotCustomerPassword(email: string): Promise<{ message: string }> {
  return request<{ message: string }>('/v1/customer/forgot-password', { method: 'POST', body: { email } })
}

export function resetCustomerPassword(token: string, password: string): Promise<{ message: string }> {
  return request<{ message: string }>('/v1/customer/reset-password', { method: 'POST', body: { token, password } })
}

// ----- Métodos de pago y envío (públicos) -----

export function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  return request<PaymentMethod[]>('/v1/public/payment-methods')
}

export function fetchShippingOptions(): Promise<ShippingOption[]> {
  return request<ShippingOption[]>('/v1/public/shipping-options')
}

// ----- Órdenes (cliente autenticado) -----

export interface CreateOrderInput {
  items: { code: string; quantity: number }[]
  paymentMethodId: string
  shippingOptionId: string
  address?: OrderAddress
  paymentReference?: string
  notes?: string
  idempotencyKey: string
}

export function createOrder(token: string, input: CreateOrderInput): Promise<Order> {
  return request<Order>('/v1/customer/orders', { method: 'POST', body: input, token })
}

export function fetchMyOrders(token: string): Promise<Order[]> {
  return request<Order[]>('/v1/customer/orders', { token })
}

export function fetchMyOrder(token: string, id: string): Promise<Order> {
  return request<Order>(`/v1/customer/orders/${id}`, { token })
}

// Descarga el comprobante PDF canónico (idéntico al adjunto del correo).
export async function fetchOrderReceiptBlob(token: string, orderId: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/v1/customer/orders/${orderId}/receipt`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new ApiError('No se pudo generar el comprobante.', res.status)
  }
  return res.blob()
}

export function setOrderPaymentReference(
  token: string,
  orderId: string,
  paymentReference: string,
): Promise<Order> {
  return request<Order>(`/v1/customer/orders/${orderId}/payment-reference`, {
    method: 'PATCH',
    body: { paymentReference },
    token,
  })
}

export function confirmCasheaOrder(token: string, orderId: string, idNumber: string): Promise<Order> {
  return request<Order>(`/v1/customer/orders/${orderId}/cashea/confirm`, {
    method: 'POST',
    body: { idNumber },
    token,
  })
}
