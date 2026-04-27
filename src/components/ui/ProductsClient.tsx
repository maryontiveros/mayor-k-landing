'use client'

import { useState } from 'react'
import { Search, Package } from 'lucide-react'
import Link from 'next/link'
import { PublicProduct } from '@/lib/api'
import { ProductCard } from './ProductCard'

interface Props {
  products: PublicProduct[]
  categoryId?: number
}

export function ProductsClient({ products, categoryId }: Props) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase().trim())
      )
    : products

  return (
    <>
      <div className="relative mb-6 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none"
        />
        <input
          type="search"
          placeholder="Buscar por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[#fa6f00]/60 focus:ring-1 focus:ring-[#fa6f00]/20 transition"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={48} className="text-[var(--muted-foreground)] mb-4" />
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            {query ? 'Sin resultados' : 'No hay productos disponibles'}
          </h3>
          <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
            {query
              ? `No se encontraron productos para "${query}".`
              : categoryId
                ? 'Esta categoría no tiene productos disponibles en este momento.'
                : 'No hay productos disponibles en este momento. Vuelve pronto.'}
          </p>
          <div className="mt-4 flex gap-3 flex-wrap justify-center">
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
            {categoryId && !query && (
              <Link
                href="/catalogo"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#fa6f00] text-white hover:bg-[#c95900] transition-colors"
              >
                Ver todos los productos
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
