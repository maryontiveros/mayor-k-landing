import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'
import { fetchPublicCategories, fetchPublicProducts } from '@/lib/api'
import { ProductCard } from '@/components/ui/ProductCard'
import { CatalogFilters } from '@/components/ui/CatalogFilters'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
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
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1e3a8a] dark:bg-[#0f172a] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <Image src="/LogoMayorK.png" alt="Mayor K" width={90} height={36} className="h-8 w-auto" />
            <span className="hidden sm:block text-white/60 text-sm font-medium">/ Catálogo</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

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
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={48} className="text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
              {categoryId
                ? 'Esta categoría no tiene productos disponibles en este momento.'
                : 'No hay productos disponibles en este momento. Vuelve pronto.'}
            </p>
            {categoryId && (
              <Link
                href="/catalogo"
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-[#fa6f00] text-white hover:bg-[#c95900] transition-colors"
              >
                Ver todos los productos
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
