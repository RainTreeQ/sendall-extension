/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Final CTA 区域组件
 * [POS]: 组件层 - 页面底部收尾动作区块
 */
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { staggerContainer, fadeInUp } from "@/lib/motion"

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-foreground relative overflow-hidden text-background">
      {/* Abstract background graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-4xl mx-auto space-y-10"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            开启多维并发工作流
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light"
          >
            现在就加入 10,000+ 高效开发者的行列。微拟物美学、毫秒级同步、全面数据加密，只为更好的你。
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Button 
              size="xl" 
              variant="default" 
              className="w-full sm:w-auto bg-white text-foreground hover:bg-white/90 shadow-[0_8px_32px_rgba(255,255,255,0.2)] font-semibold"
            >
              立刻免费安装
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
            >
              查看 GitHub 源码
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
