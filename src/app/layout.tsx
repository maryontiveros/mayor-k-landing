import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

export const metadata: Metadata = {
  title: 'Mayor K C.A. | Ferretería al Mayor',
  description:
    'Distribuidora y mayorista de ferretería en Venezuela. Amplio catálogo de productos de ferretería a precios mayoristas.',
  keywords: 'ferretería, mayorista, herramientas, Venezuela, Mayor K',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
