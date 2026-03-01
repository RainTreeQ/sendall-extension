/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Hero 区域组件
 * [POS]: 组件层 - 页面头部区块
 */
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      </div>

      <motion.div 
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.div variants={fadeInUp} className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-sm">
              🚀 AI Broadcast Extension v1.0 is Live
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            同步掌控所有窗口 <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">提升十倍生产力</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            无缝跨屏流转与同步交互的浏览器插件设计方案。摆脱重复操作，用极致的微拟物设计驱动你的每一次点击。
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button size="xl" variant="primary" className="w-full sm:w-auto">
              立即开始使用
            </Button>
            <Button size="xl" variant="secondary" className="w-full sm:w-auto">
              查看开发文档
            </Button>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            className="text-sm text-muted-foreground pt-4"
          >
            已有超过 10,000+ 极客开发者安装
          </motion.p>
        </div>

        <motion.div 
          variants={scaleIn}
          className="mt-16 mx-auto max-w-5xl rounded-3xl border border-border bg-card shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden aspect-[16/9] relative flex items-center justify-center bg-muted/30"
        >
          {/* Mock visual placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-muted/50" />
          <div className="relative flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_40px_rgba(0,0,0,0.1)]">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-muted-foreground font-medium">应用演示视频占位</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
