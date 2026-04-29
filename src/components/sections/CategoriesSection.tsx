import Image from 'next/image'
import Link from 'next/link'
import { Wrench, ArrowRight } from 'lucide-react'
import { fetchPublicCategories, PublicCategory } from '@/lib/api'

function CategoryCard({ category }: { category: PublicCategory }) {
  return (
    <Link
      href={`/catalogo?categoria=${category.id}`}
      className="group flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF6B1A]/50 hover:shadow-lg transition-all duration-200 w-full overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-[var(--muted)] flex items-center justify-center">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 176px"
          />
        ) : (
          <Wrench size={32} className="text-[#FF6B1A]" />
        )}
      </div>
      <div className="p-3 text-center">
        <p className="font-semibold text-[var(--foreground)] group-hover:text-[#FF6B1A] transition-colors text-sm">
          {category.name}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {category._count.products} producto{category._count.products !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  )
}

export async function CategoriesSection() {
  const categories = await fetchPublicCategories()

  return (
    <section id="productos" className="py-20 bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-[#FF6B1A]/10 text-[#FF6B1A] mb-4">
            Nuestros Productos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            Amplio catálogo de ferretería
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
            Explora nuestra variedad de productos organizados por categorías. Haz clic en cualquiera para ver el catálogo completo.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)]">
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] h-48 rounded-2xl bg-[var(--border)] animate-pulse" />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#FF6B1A] hover:bg-[#D94F00] text-white transition-colors shadow-md"
          >
            Ver todos los productos <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
