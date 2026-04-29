import { fetchPublicCategories, fetchPublicProducts } from '@/lib/api'
import { CatalogFilters } from '@/components/ui/CatalogFilters'
import { ProductsClient } from '@/components/ui/ProductsClient'
import { CatalogHeader } from '@/components/layout/CatalogHeader'
import { Suspense } from 'react'

interface PageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const { categoria } = await searchParams
  const categoryId = categoria ? Number(categoria) : undefined

  const [categories, products] = await Promise.all([
    fetchPublicCategories(),
    fetchPublicProducts(categoryId),
  ])

  const activeCategory = categoryId ? categories.find((c) => c.id === categoryId) : null

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <CatalogHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            {activeCategory ? activeCategory.name : 'Catálogo de Productos'}
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense>
            <CatalogFilters categories={categories} />
          </Suspense>
        </div>

        {/* Products grid */}
        <ProductsClient products={products} categoryId={categoryId} />
      </main>
    </div>
  )
}
