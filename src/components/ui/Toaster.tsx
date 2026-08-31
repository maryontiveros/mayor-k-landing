'use client'

import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useToast, type Toast } from '@/store/toast'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const COLORS = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-[#1A6BFF]',
}

function ToastRow({ toast }: { toast: Toast }) {
  const remove = useToast((s) => s.remove)
  const Icon = ICONS[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => remove(toast.id), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, remove])

  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-lg px-4 py-3 min-w-[260px] max-w-sm animate-in slide-in-from-bottom-2">
      <Icon size={18} className={COLORS[toast.type]} />
      <span className="text-sm text-[var(--foreground)] flex-1">{toast.message}</span>
      <button
        onClick={() => remove(toast.id)}
        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        aria-label="Cerrar"
      >
        <X size={15} />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useToast((s) => s.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastRow key={t.id} toast={t} />
      ))}
    </div>
  )
}
