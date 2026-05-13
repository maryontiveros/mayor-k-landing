import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad | mayork.',
  description: 'Política de privacidad de Mayor K C.A. Conoce cómo recopilamos, usamos y protegemos tu información personal.',
}

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
          >
            ← Volver al inicio
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">
            Política de Privacidad
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-10">
            Vigente desde el 01/10/2019
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-[var(--foreground)]">
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Mayor K C.A. (&quot;nosotros&quot; o &quot;nuestro&quot;) opera mayor-k-app. Esta página te informa sobre nuestras políticas en cuanto a la recopilación, uso y divulgación de Información Personal que recibimos de los usuarios del sitio. Utilizamos tu información personal únicamente para brindar y mejorar el servicio. Al usar el sitio, aceptas la recopilación y el uso de información de acuerdo con esta política.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Recopilación y uso de información</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                Mientras usas nuestro sitio, es posible que te solicitemos cierta información de identificación personal que puede utilizarse para contactarte o identificarte. La información de identificación personal puede incluir, entre otros, tu nombre, correo electrónico y número de teléfono (&quot;Información Personal&quot;).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Datos de registro</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                Como muchos operadores de sitios, recopilamos información que tu navegador envía cada vez que visitas nuestro sitio (&quot;Datos de Registro&quot;). Estos Datos de Registro pueden incluir información como la dirección de Protocolo de Internet (&quot;IP&quot;) de tu computadora, el tipo de navegador, la versión del navegador, las páginas de nuestro sitio que visitas, la hora y fecha de tu visita, el tiempo que pasas en esas páginas y otras estadísticas. Además, podemos utilizar servicios de terceros como Google Analytics para recopilar, monitorear y analizar esta información.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Comunicaciones</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                Podemos usar tu Información Personal para contactarte con boletines informativos, materiales de marketing o promocionales y otra información que consideremos de tu interés.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Cookies</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                Las cookies son archivos con una pequeña cantidad de datos que pueden incluir un identificador único anónimo. Las cookies se envían a tu navegador desde un sitio web y se almacenan en el disco duro de tu computadora. Al igual que muchos sitios, usamos &quot;cookies&quot; para recopilar información. Puedes configurar tu navegador para que rechace todas las cookies o para que te avise cuando se envía una cookie. Sin embargo, si no aceptas cookies, es posible que no puedas usar algunas partes de nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Seguridad</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                La seguridad de tu Información Personal es importante para nosotros, pero recuerda que ningún método de transmisión por Internet ni ningún método de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por utilizar medios comercialmente aceptables para proteger tu Información Personal, no podemos garantizar su seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Cambios a esta Política de Privacidad</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                Esta Política de Privacidad entra en vigencia el 01/10/2019 y permanecerá en vigor, salvo con respecto a cualquier cambio en sus disposiciones en el futuro, que entrará en vigor inmediatamente después de su publicación en esta página. Nos reservamos el derecho de actualizar o cambiar nuestra Política de Privacidad en cualquier momento. Si realizamos cambios materiales a esta Política de Privacidad, te notificaremos a través de la dirección de correo electrónico que nos hayas proporcionado o mediante un aviso destacado en nuestro sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Contáctanos</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-3">
                Si tienes alguna pregunta sobre esta Política de Privacidad, puedes comunicarte con nosotros:
              </p>
              <ul className="space-y-1 text-[var(--muted-foreground)]">
                <li>📞 +58 412-5176074</li>
                <li>✉️ mayork.ventas@gmail.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
