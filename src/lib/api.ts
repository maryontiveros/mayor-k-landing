import { unstable_cache } from 'next/cache'

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
  categoryId: number
  category: { id: number; name: string }
  images: ProductImage[]
  position: number
}

async function _fetchCategories(): Promise<PublicCategory[]> {
  const res = await fetch(`${API_URL}/v1/public/categories`)
  if (!res.ok) return []
  return res.json()
}

async function _fetchProducts(categoryId?: number): Promise<PublicProduct[]> {
  const url = categoryId
    ? `${API_URL}/v1/public/products?categoryId=${categoryId}`
    : `${API_URL}/v1/public/products`
  const res = await fetch(url)
  if (!res.ok) return []
  return res.json()
}

// Cache compartido entre todas las peticiones al servidor — se invalida cada 5 minutos.
// unstable_cache persiste entre requests distintos (a diferencia de next: { revalidate }),
// por lo que múltiples usuarios que abran /catalogo al mismo tiempo comparten la misma
// respuesta cacheada sin generar requests adicionales a la API.
export const fetchPublicCategories = unstable_cache(
  async () => {
    try {
      return await _fetchCategories()
    } catch {
      return []
    }
  },
  ['public-categories'],
  { revalidate: 300, tags: ['categories'] },
)

export const fetchPublicProducts = unstable_cache(
  async (categoryId?: number) => {
    try {
      return await _fetchProducts(categoryId)
    } catch {
      return []
    }
  },
  ['public-products'],
  { revalidate: 300, tags: ['products'] },
)
