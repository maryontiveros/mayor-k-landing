import Image from 'next/image'
import { Package } from 'lucide-react'
import { PublicProduct } from '@/lib/api'

export function ProductCard({ product }: { product: PublicProduct }) {
  const firstImage = product.images[0]

  return (
    <div className="group flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:shadow-md hover:border-[#fa6f00]/40 transition-all duration-200">
      <div className="relative aspect-square bg-[var(--muted)] flex items-center justify-center overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <Package size={40} className="text-[var(--muted-foreground)]" />
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#fa6f00]">
          {product.category.name}
        </p>
        <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-1">
            {product.description}
          </p>
        )}
      </div>
    </div>
  )
}
