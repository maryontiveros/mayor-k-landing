import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient — replace with <Image> once you have a real photo */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#0f172a]">
        {/* Decorative circles for depth */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#fa6f00]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#1e40af]/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#fa6f00]/5 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <Image
            src="/LogoMayorK_t.png"
            alt="Mayor K"
            width={220}
            height={90}
            className="h-20 w-auto drop-shadow-2xl"
            priority
          />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
          Mayor K <span className="text-[#fa6f00]">C.A.</span>
        </h1>
        <p className="text-xl sm:text-2xl font-light text-white/90 mb-3">
          Distribuidora Mayorista de Ferretería
        </p>
        <p className="text-base sm:text-lg text-white/70 mb-10 max-w-xl mx-auto">
          Amplio catálogo de productos de ferretería. Precios mayoristas para profesionales y empresas en Venezuela.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold bg-[#fa6f00] hover:bg-[#c95900] text-white transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105"
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#nosotros" aria-label="Scroll hacia abajo">
          <ChevronDown size={32} className="text-white/60" />
        </a>
      </div>
    </section>
  )
}
