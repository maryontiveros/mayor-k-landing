import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#1e3a8a] dark:bg-[#030712] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image src="/LogoMayorK_t.png" alt="Mayor K" width={120} height={48} className="h-10 w-auto mb-3" />
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
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white/90">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>📞 +58 (000) 000-0000</li>
              <li>📍 Venezuela</li>
              <li>✉️ info@mayork.com</li>
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
