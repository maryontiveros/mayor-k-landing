import { Phone, MapPin, Mail, MessageCircle, Share2, Globe } from 'lucide-react'

const contactItems = [
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+58 (000) 000-0000',
    href: 'tel:+580000000000',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+58 (000) 000-0000',
    href: 'https://wa.me/580000000000',
  },
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Venezuela — dirección por confirmar',
    href: null,
  },
  {
    icon: Mail,
    label: 'Correo',
    value: 'info@mayork.com',
    href: 'mailto:info@mayork.com',
  },
]

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-[#FF6B1A]/10 text-[#FF6B1A] mb-4">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            Estamos para servirte
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
            Comunícate con nosotros para cotizaciones, pedidos o cualquier consulta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contactItems.map((item) => {
              const content = (
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF6B1A]/40 transition-colors">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-[#FF6B1A]/10">
                    <item.icon size={20} className="text-[#FF6B1A]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                  </div>
                </div>
              )
              return item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              )
            })}

            {/* Social media */}
            <div className="sm:col-span-2 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF6B1A]/40 text-sm font-medium text-[var(--foreground)] transition-colors"
              >
                <Share2 size={18} className="text-[#FF6B1A]" />
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#1A6BFF]/40 text-sm font-medium text-[var(--foreground)] transition-colors"
              >
                <Globe size={18} className="text-[#1A6BFF]" />
                Facebook
              </a>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden border border-[var(--border)] h-72 lg:h-full min-h-64 bg-[var(--card)] flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin size={40} className="text-[#FF6B1A] mx-auto mb-3" />
              <p className="text-sm text-[var(--muted-foreground)]">
                Mapa de ubicación próximamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
