import type { Metadata } from 'next'

// Página transaccional: no debe indexarse ni compartirse por buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
