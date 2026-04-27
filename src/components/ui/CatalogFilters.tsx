'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PublicCategory } from '@/lib/api'

export function CatalogFilters({ categories }: { categories: PublicCategory[] }) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('categoria')

  function select(id: string | null) {
    const url = id ? `/catalogo?categoria=${id}` : '/catalogo'
    router.push(url)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
          !active
            ? 'bg-[#fa6f00] border-[#fa6f00] text-white'
            : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#fa6f00]/50 hover:text-[var(--foreground)]'
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => select(String(cat.id))}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            active === String(cat.id)
              ? 'bg-[#fa6f00] border-[#fa6f00] text-white'
              : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#fa6f00]/50 hover:text-[var(--foreground)]'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
