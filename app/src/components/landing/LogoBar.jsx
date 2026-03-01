/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Logo Bar 区域组件
 * [POS]: 组件层 - 信任背书区块
 */
import { motion } from "framer-motion"

export function LogoBar() {
  const logos = [
    { name: "Acme Corp", icon: "🏢" },
    { name: "Global Tech", icon: "🌐" },
    { name: "Innovate AI", icon: "🤖" },
    { name: "CloudSync", icon: "☁️" },
    { name: "DataFlow", icon: "📊" },
  ]

  return (
    <section className="py-16 md:py-24 border-y border-border/50 bg-background/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            Trusted by industry leaders
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {logos.map((logo, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default"
              >
                <span className="text-2xl">{logo.icon}</span>
                <span className="font-bold text-xl text-foreground/80 tracking-tight">{logo.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
