import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { fetchPublicCategories, fetchPublicProducts } from '@/lib/api'
import { CatalogFilters } from '@/components/ui/CatalogFilters'
import { ProductsClient } from '@/components/ui/ProductsClient'
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
            <Image src="/LogoMayorK_t.png" alt="Mayor K" width={90} height={36} className="h-8 w-auto" />
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

        {/* Products grid with client-side search */}
        <ProductsClient products={products} categoryId={categoryId} />
      </main>
    </div>
  )
}
