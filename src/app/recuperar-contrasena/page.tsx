'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { resetCustomerPassword, ApiError } from '@/lib/apiClient'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-[var(--muted-foreground)] text-sm">
          Enlace inválido. Solicita un nuevo correo de recuperación.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm font-semibold text-[#FF6B1A] hover:underline"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">¡Contraseña actualizada!</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] text-white transition-colors"
        >
          Ir al inicio
        </button>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await resetCustomerPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Token inválido o expirado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-xl font-bold text-[var(--foreground)] font-display tracking-wide">
        Nueva contraseña
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mt-1">
        Elige una contraseña segura para tu cuenta.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <PasswordField
          label="Nueva contraseña"
          value={password}
          onChange={setPassword}
          show={showPassword}
          onToggle={() => setShowPassword((s) => !s)}
          placeholder="Mínimo 8 caracteres"
          autoFocus
        />
        <PasswordField
          label="Confirmar contraseña"
          value={confirm}
          onChange={setConfirm}
          show={showPassword}
          onToggle={() => setShowPassword((s) => !s)}
          placeholder="Repite la contraseña"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-60 text-white transition-colors"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Actualizar contraseña
        </button>
      </form>
    </>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  autoFocus,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[#FF6B1A]/60 focus:ring-1 focus:ring-[#FF6B1A]/20 transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  )
}

export default function RecuperarContrasenaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-md bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--border)] p-8">
        <div className="mb-6">
          <span className="text-2xl font-black text-[#FF6B1A] font-display tracking-tight">Mayor K</span>
        </div>
        <Suspense fallback={<div className="text-sm text-[var(--muted-foreground)]">Cargando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
