import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0E1116] dark:bg-[#030712] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/mayork-mark-on-dark.svg" alt="Mayor K" width={36} height={36} className="h-9 w-auto" />
              <span className="font-bold text-lg text-white leading-none">
                mayor<span className="text-[#1A6BFF]">k</span><span className="text-[#FF6B1A]">.</span>
              </span>
            </div>
            <p className="text-sm text-white/70 max-w-xs">
              Distribuidora mayorista de ferretería. Calidad y variedad para profesionales y empresas.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white/90">Navegación</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
              <li><a href="#productos" className="hover:text-white transition-colors">Productos</a></li>
              <li><a href="#ventajas" className="hover:text-white transition-colors">¿Por qué nosotros?</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo de Productos</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white/90">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>📞 +58 412-5176074</li>
              <li>✉️ mayork.ventas@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Mayor K C.A. — RIF J-410044535. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
