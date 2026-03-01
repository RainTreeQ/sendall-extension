/**
 * [INPUT]: None
 * [OUTPUT]: 最终组合的落地页
 * [POS]: 页面层 - 首页展示入口
 */
import { Hero } from "@/components/landing/Hero"
import { LogoBar } from "@/components/landing/LogoBar"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Testimonials } from "@/components/landing/Testimonials"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { Footer } from "@/components/landing/Footer"

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <Hero />
      <LogoBar />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
