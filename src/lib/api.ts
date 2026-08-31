const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface PublicCategory {
  id: number
  name: string
  imageUrl: string | null
  _count: { products: number }
}

export interface ProductImage {
  id: string
  url: string
}

export interface PublicProduct {
  code: string
  name: string
  description: string
  price: number
  priceWithProfit: number
  /** Disponibilidad orientativa para validar cantidades en UI; se revalida en el checkout. */
  stock: number
  categoryId: number
  category: { id: number; name: string }
  images: ProductImage[]
  position: number
  onSale: boolean
  onPreSale: boolean
}

export interface PaymentMethod {
  id: string
  name: string
  type: string
  instructions: string
  details: Record<string, unknown> | null
}

export interface ShippingOption {
  id: string
  name: string
  cost: number
  description: string
  requiresAddress: boolean
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export interface OrderAddress {
  fullName?: string
  phone?: string
  line1?: string
  city?: string
  state?: string
  reference?: string
}

export interface OrderItem {
  id: string
  productCode: string
  nameSnapshot: string
  unitPriceSnapshot: number
  quantity: number
}

export interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'cancelled'
  subtotal: number
  shippingCost: number
  total: number
  paymentReference: string
  shippingAddress: OrderAddress | null
  notes: string
  casheaOrderId: string | null
  createdAt: string
  items: OrderItem[]
  paymentMethod: { id: string; name: string; type: string; instructions: string } | null
  shippingOption: { id: string; name: string; cost: number } | null
}

export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  try {
    const res = await fetch(`${API_URL}/v1/public/categories`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function fetchPublicProducts(categoryId?: number): Promise<PublicProduct[]> {
  try {
    const url = categoryId
      ? `${API_URL}/v1/public/products?categoryId=${categoryId}`
      : `${API_URL}/v1/public/products`
    const res = await fetch(url, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
