import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { WhyUsSection } from '@/components/sections/WhyUsSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <CategoriesSection />
        <WhyUsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
