import type { Metadata } from 'next'

// Página privada del cliente (pedidos): no indexable ni compartible por buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function MisPedidosLayout({ children }: { children: React.ReactNode }) {
  return children
}
