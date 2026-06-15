export function formatUSD(n: number): string {
  return `$${n.toFixed(2)}`
}

/** Número de pedido legible y consistente entre UI, comprobante y correo. */
export function orderNumber(id: string): string {
  return `#${id.slice(-8).toUpperCase()}`
}
