import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { AboutUsSection } from "@/components/AboutUsSection"

export const metadata = {
  title: "Sobre Nosotros - ArgoStore",
  description: "Conoce nuestra historia, misión y compromiso con la moda de calidad. ArgoStore, democratizando la moda desde 2009.",
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AboutUsSection />
      </main>
      <Footer />
    </div>
  )
} 