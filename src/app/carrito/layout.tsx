import type { Metadata } from 'next'

// Página transaccional (carrito): no aporta valor de indexación.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
  return children
}
