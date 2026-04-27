import { ShieldCheck, Award, Users } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="nosotros" className="py-20 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-[#1e40af]/10 text-[#1e40af] dark:bg-[#3b82f6]/15 dark:text-[#3b82f6] mb-4">
            Sobre Nosotros
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
            ¿Quiénes somos?
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Mayor K C.A. es una empresa venezolana dedicada a la distribución mayorista de productos de ferretería.
            Con años de experiencia en el sector, ofrecemos calidad, variedad y los mejores precios del mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#fa6f00]/10 mb-4">
              <Award size={28} className="text-[#fa6f00]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Experiencia</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
              Años de trayectoria en el sector ferretero nos avalan como distribuidores confiables y reconocidos en Venezuela.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#1e40af]/10 mb-4">
              <ShieldCheck size={28} className="text-[#1e40af]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Calidad garantizada</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
              Todos nuestros productos son seleccionados con los más altos estándares de calidad para satisfacer las exigencias del mercado profesional.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#fa6f00]/10 mb-4">
              <Users size={28} className="text-[#fa6f00]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Atención personalizada</h3>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
              Nuestro equipo está disponible para asesorarte y ofrecerte la mejor solución para tu negocio o proyecto.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
