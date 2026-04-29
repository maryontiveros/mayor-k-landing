import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0E1116] via-[#1e3a8a] to-[#0E1116]">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#FF6B1A]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#1A6BFF]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#FF6B1A]/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/mayork-mark-on-dark.svg"
            alt="Mayor K"
            width={160}
            height={160}
            className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-2xl"
            priority
          />
        </div>

        <div className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
          mayor<span className="text-[#1A6BFF]">k</span><span className="text-[#FF6B1A]">.</span>
        </div>

        <p className="text-xl sm:text-2xl font-light text-white/90 mb-3">
          Distribuidora Mayorista de Ferretería
        </p>
        <p className="text-base sm:text-lg text-white/70 mb-10 max-w-xl mx-auto">
          Amplio catálogo de productos de ferretería. Precios mayoristas para profesionales y empresas en Venezuela.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105"
          >
            Ver Catálogo Completo
          </Link>
          <a
            href="#nosotros"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-white/40 hover:border-white text-white hover:bg-white/10 transition-all"
          >
            Conocer más
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#nosotros" aria-label="Scroll hacia abajo">
          <ChevronDown size={32} className="text-white/60" />
        </a>
      </div>
    </section>
  )
}
