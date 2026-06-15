import type { Order } from './api'

export const ORDER_STATUS: Record<Order['status'], { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-amber-500/15 text-amber-600' },
  confirmed: { label: 'Confirmado', className: 'bg-blue-500/15 text-blue-600' },
  paid: { label: 'Pagado', className: 'bg-green-500/15 text-green-600' },
  shipped: { label: 'Enviado', className: 'bg-indigo-500/15 text-indigo-600' },
  cancelled: { label: 'Cancelado', className: 'bg-red-500/15 text-red-600' },
}
