'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function CatalogHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#0E1116]/95 backdrop-blur-sm border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 min-w-0">
          {/* Home pill — hover slides in "inicio" */}
          <Link
            href="/"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#FF6B1A]/50 bg-white/5 hover:bg-[#FF6B1A]/10 transition-all duration-200 shrink-0"
          >
            <span className="text-white/40 group-hover:text-[#FF6B1A] group-hover:-translate-x-0.5 transition-all duration-200 text-sm select-none">
              ←
            </span>
            <Image
              src="/mayork-mark-on-dark.svg"
              alt="Mayor K"
              width={22}
              height={22}
              className="w-[22px] h-[22px] shrink-0"
            />
            <span className="font-bold text-sm text-white leading-none">
              mayor<span className="text-[#1A6BFF]">k</span><span className="text-[#FF6B1A]">.</span>
            </span>
            {/* Slide-in text on hover */}
            <span className="max-w-0 overflow-hidden group-hover:max-w-[3.5rem] transition-all duration-300 ease-out text-xs text-white/50 group-hover:text-white/70 whitespace-nowrap">
              inicio
            </span>
          </Link>

          {/* Breadcrumb */}
          <span className="text-white/20 select-none text-lg leading-none">·</span>
          <span className="text-white/60 text-sm font-medium truncate">Catálogo</span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
