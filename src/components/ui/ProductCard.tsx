import Image from 'next/image'
import { Package } from 'lucide-react'
import { PublicProduct } from '@/lib/api'

export function ProductCard({ product, onClick }: { product: PublicProduct; onClick?: () => void }) {
  const firstImage = product.images[0]

  return (
    <div onClick={onClick} className={`group flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:shadow-md hover:border-[#fa6f00]/40 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="relative aspect-[4/3] bg-[var(--muted)] flex items-center justify-center overflow-hidden">
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
      <div className="p-2.5 flex flex-col gap-0.5">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-xs text-[var(--muted-foreground)] font-mono shrink-0">{product.code}</span>
          <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug line-clamp-2 font-display tracking-wide min-w-0">
            {product.name}
          </h3>
        </div>
        <p className="text-xs font-bold text-[#fa6f00]">
          ${product.priceWithProfit.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
