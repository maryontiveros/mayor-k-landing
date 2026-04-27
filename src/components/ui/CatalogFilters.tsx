'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { PublicCategory } from '@/lib/api'

export function CatalogFilters({ categories }: { categories: PublicCategory[] }) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('categoria')
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    setPendingId(null)
  }, [active])

  function select(id: string | null) {
    const key = id ?? 'all'
    if (pendingId === key) return
    setPendingId(key)
    router.push(id ? `/catalogo?categoria=${id}` : '/catalogo')
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        disabled={!!pendingId}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border disabled:opacity-60 ${
          !active
            ? 'bg-[#fa6f00] border-[#fa6f00] text-white'
            : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#fa6f00]/50 hover:text-[var(--foreground)]'
        }`}
      >
        {pendingId === 'all' && <Loader2 size={13} className="animate-spin" />}
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => select(String(cat.id))}
          disabled={!!pendingId}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border disabled:opacity-60 ${
            active === String(cat.id)
              ? 'bg-[#fa6f00] border-[#fa6f00] text-white'
              : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#fa6f00]/50 hover:text-[var(--foreground)]'
          }`}
        >
          {pendingId === String(cat.id) && <Loader2 size={13} className="animate-spin" />}
          {cat.name}
        </button>
      ))}
    </div>
  )
}
