'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Eye, EyeOff } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useCustomerAuth } from '@/store/customerAuth'
import { toast } from '@/store/toast'
import { loginCustomer, registerCustomer, forgotCustomerPassword, ApiError } from '@/lib/apiClient'

export function AuthModal() {
  const { authOpen, authMode, setAuthMode, closeAuth, onAuthSuccess } = useUI()
  const login = useCustomerAuth((s) => s.login)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotSent, setForgotSent] = useState(false)

  useEffect(() => {
    if (!authOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [authOpen, closeAuth])

  // Limpiar el formulario al cerrar
  useEffect(() => {
    if (!authOpen) {
      setName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setError(null)
      setLoading(false)
      setForgotSent(false)
    }
  }, [authOpen])

  if (!authOpen) return null

  const isRegister = authMode === 'register'
  const isForgot = authMode === 'forgot'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (isForgot) {
      if (!email.trim()) {
        setError('Ingresa tu correo electrónico.')
        return
      }
      setLoading(true)
      try {
        await forgotCustomerPassword(email.trim())
        setForgotSent(true)
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'No se pudo completar la solicitud.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (!email.trim() || !password) {
      setError('Completa todos los campos.')
      return
    }
    if (isRegister) {
      if (!name.trim()) {
        setError('Ingresa tu nombre.')
        return
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.')
        return
      }
    }

    setLoading(true)
    try {
      const result = isRegister
        ? await registerCustomer({ name: name.trim(), email: email.trim(), password, phone: phone.trim() })
        : await loginCustomer({ email: email.trim(), password })

      login(result.token, result.customer)
      toast(isRegister ? '¡Cuenta creada! Bienvenido.' : `Hola de nuevo, ${result.customer.name}.`)
      const cb = onAuthSuccess
      closeAuth()
      cb?.()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo completar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[58] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={closeAuth}
    >
      <div
        className="relative bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuth}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} className="text-[var(--foreground)]" />
        </button>

        <div className="p-6 sm:p-8">
          {isForgot ? (
            forgotSent ? (
              <ForgotSuccess onBack={() => { setForgotSent(false); setAuthMode('login') }} />
            ) : (
              <ForgotForm
                email={email}
                setEmail={setEmail}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
                onBack={() => { setError(null); setAuthMode('login') }}
              />
            )
          ) : (
            <>
              <h2 className="text-xl font-bold text-[var(--foreground)] font-display tracking-wide">
                {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {isRegister
                  ? 'Regístrate para completar tu compra.'
                  : 'Ingresa para finalizar tu pedido.'}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                {isRegister && (
                  <Field
                    label="Nombre completo"
                    value={name}
                    onChange={setName}
                    placeholder="Tu nombre"
                    autoFocus
                  />
                )}
                <Field
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="tu@correo.com"
                  autoFocus={!isRegister}
                />
                {isRegister && (
                  <Field
                    label="Teléfono (opcional)"
                    value={phone}
                    onChange={setPhone}
                    placeholder="04140000000"
                  />
                )}
                <Field
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder={isRegister ? 'Mínimo 8 caracteres' : '••••••••'}
                />

                {!isRegister && (
                  <div className="flex justify-end -mt-1">
                    <button
                      type="button"
                      onClick={() => { setError(null); setAuthMode('forgot') }}
                      className="text-xs text-[var(--muted-foreground)] hover:text-[#FF6B1A] transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-60 text-white transition-colors"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </form>

              <p className="text-sm text-[var(--muted-foreground)] mt-5 text-center">
                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                <button
                  onClick={() => {
                    setError(null)
                    setAuthMode(isRegister ? 'login' : 'register')
                  }}
                  className="font-semibold text-[#FF6B1A] hover:underline"
                >
                  {isRegister ? 'Inicia sesión' : 'Crea una'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ForgotForm({
  email,
  setEmail,
  loading,
  error,
  onSubmit,
  onBack,
}: {
  email: string
  setEmail: (v: string) => void
  loading: boolean
  error: string | null
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}) {
  return (
    <>
      <h2 className="text-xl font-bold text-[var(--foreground)] font-display tracking-wide">
        Recuperar contraseña
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mt-1">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
        <Field
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="tu@correo.com"
          autoFocus
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF6B1A] hover:bg-[#c95900] disabled:opacity-60 text-white transition-colors"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Enviar instrucciones
        </button>
      </form>

      <p className="text-sm text-[var(--muted-foreground)] mt-5 text-center">
        <button onClick={onBack} className="font-semibold text-[#FF6B1A] hover:underline">
          Volver al inicio de sesión
        </button>
      </p>
    </>
  )
}

function ForgotSuccess({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
        <svg className="w-6 h-6 text-[#FF6B1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] font-display tracking-wide">
          Revisa tu correo
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
          Si el correo está registrado, recibirás las instrucciones en tu bandeja de entrada. El enlace expira en <strong>1 hora</strong>.
        </p>
      </div>
      <button onClick={onBack} className="text-sm font-semibold text-[#FF6B1A] hover:underline mt-2">
        Volver al inicio de sesión
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoFocus,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  autoFocus?: boolean
}) {
  const isPassword = type === 'password'
  const [show, setShow] = useState(false)
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[#FF6B1A]/60 focus:ring-1 focus:ring-[#FF6B1A]/20 transition ${
            isPassword ? 'pr-10' : ''
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </label>
  )
}
