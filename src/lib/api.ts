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
  categoryId: number
  category: { id: number; name: string }
  images: ProductImage[]
  position: number
  onSale: boolean
  onPreSale: boolean
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
