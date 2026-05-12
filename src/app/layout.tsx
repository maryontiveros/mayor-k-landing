import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://mayork.net'),
  title: 'mayork. | Ferretería al Mayor',
  description:
    'Distribuidora y mayorista de ferretería en Venezuela. Amplio catálogo de productos de ferretería a precios mayoristas.',
  keywords: 'ferretería, mayorista, herramientas, Venezuela, Mayor K',
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicons/safari-pinned-tab.svg' },
    ],
  },
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
