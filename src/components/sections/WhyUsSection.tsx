import { TrendingDown, Package, Headphones, Truck } from 'lucide-react'

const features = [
  {
    icon: TrendingDown,
    color: '#fa6f00',
    title: 'Precios Mayoristas',
    description:
      'Ofrecemos los mejores precios del mercado para compras al por mayor. Ideal para constructoras, ferreterías y contratistas.',
  },
  {
    icon: Package,
    color: '#1e40af',
    title: 'Amplio Catálogo',
    description:
      'Contamos con una extensa variedad de productos de ferretería en todas las categorías para cubrir cualquier necesidad.',
  },
  {
    icon: Headphones,
    color: '#fa6f00',
    title: 'Atención Personalizada',
    description:
      'Nuestro equipo de expertos te asesora para encontrar el producto correcto al mejor precio para tu proyecto.',
  },
  {
    icon: Truck,
    color: '#1e40af',
    title: 'Distribución Directa',
    description:
      'Distribución directa desde nuestros almacenes. Pedidos al mayor con entregas coordinadas según tu necesidad.',
  },
]

export function WhyUsSection() {
  return (
    <section id="ventajas" className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-[#1e40af]/10 text-[#1e40af] dark:bg-[#3b82f6]/15 dark:text-[#3b82f6] mb-4">
            Nuestras Ventajas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
            Somos la mejor opción para abastecerte de ferretería al mayor en Venezuela.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-[var(--muted)] border border-[var(--border)] hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl mb-4"
                style={{ backgroundColor: `${f.color}18` }}
              >
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
