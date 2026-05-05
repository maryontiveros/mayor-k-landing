'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Package } from 'lucide-react'
import { PublicProduct } from '@/lib/api'

interface Props {
  product: PublicProduct
  onClose: () => void
}

export function ProductModal({ product, onClose }: Props) {
  const [activeImage, setActiveImage] = useState(product.images[0] ?? null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} className="text-[var(--foreground)]" />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-72 shrink-0 aspect-square bg-[var(--muted)] flex items-center justify-center rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden">
            {activeImage ? (
              <Image
                src={activeImage.url}
                alt={product.name}
                fill
                className="object-contain p-3"
                sizes="(max-width: 640px) 100vw, 288px"
              />
            ) : (
              <Package size={56} className="text-[var(--muted-foreground)]" />
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-3 flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#fa6f00]">
              {product.category.name}
            </p>
            <h2 className="text-xl font-bold text-[var(--foreground)] leading-snug">
              {product.name}
            </h2>
            <p className="text-2xl font-bold text-[#fa6f00]">
              ${product.priceWithProfit.toFixed(2)}
            </p>
            {product.description && (
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}
            <p className="text-xs text-[var(--muted-foreground)] mt-auto pt-3 border-t border-[var(--border)]">
              Código: <span className="font-mono">{product.code}</span>
            </p>
          </div>
        </div>

        {/* Thumbnail gallery */}
        {product.images.length > 1 && (
          <div className="px-6 pb-5 flex gap-2 overflow-x-auto">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img)}
                className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImage?.id === img.id
                    ? 'border-[#fa6f00]'
                    : 'border-[var(--border)] hover:border-[#fa6f00]/50'
                }`}
              >
                <Image src={img.url} alt={product.name} fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
