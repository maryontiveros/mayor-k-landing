import { Phone, Mail, MessageCircle, Share2 } from 'lucide-react'

const contactItems = [
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+58 412-5176074',
    href: 'tel:+584125176074',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+58 412-5176074',
    href: 'https://wa.me/584125176074',
  },
  {
    icon: Mail,
    label: 'Correo',
    value: 'mayork.ventas@gmail.com',
    href: 'mailto:mayork.ventas@gmail.com',
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

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {contactItems.map((item) => (
              <a key={item.label} href={item.href!} target="_blank" rel="noopener noreferrer">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF6B1A]/40 transition-colors">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-[#FF6B1A]/10">
                    <item.icon size={20} className="text-[#FF6B1A]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)] whitespace-nowrap">{item.value}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Social media */}
          <div className="flex gap-3 mt-5">
            <a
              href="https://www.instagram.com/mayorkca?igsh=MXBrc3lqNHBwcDA1bA=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[#FF6B1A]/40 text-sm font-medium text-[var(--foreground)] transition-colors"
            >
              <Share2 size={18} className="text-[#FF6B1A]" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
