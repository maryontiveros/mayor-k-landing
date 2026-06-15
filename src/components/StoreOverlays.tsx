'use client'

import { CartDrawer } from '@/components/ui/CartDrawer'
import { AuthModal } from '@/components/ui/AuthModal'
import { Toaster } from '@/components/ui/Toaster'

// Monta los overlays globales del storefront (carrito, login/registro, toasts)
export function StoreOverlays() {
  return (
    <>
      <CartDrawer />
      <AuthModal />
      <Toaster />
    </>
  )
}
