/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Features 区域组件
 * [POS]: 组件层 - 解决方案特性区块 (Bento Grid)
 */
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion"
import { Layers, Zap, RefreshCw as Sync, ShieldCheck, PaintBucket, Keyboard } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "全局状态无缝同步",
      description: "在任意标签页的改动，瞬间同步至所有关联浏览器实例，无需刷新。",
      icon: <Sync size={32} />,
      span: "md:col-span-2",
      bgClass: "from-primary/10 to-primary/5",
    },
    {
      title: "极致性能表现",
      description: "基于 Rust + Wasm 的底层核心，内存占用低于 10MB。",
      icon: <Zap size={32} />,
      span: "col-span-1",
      bgClass: "from-accent/10 to-accent/5",
    },
    {
      title: "微拟物设计系统",
      description: "告别死板的扁平化，拥抱光影交织的三维质感，每次交互都是享受。",
      icon: <PaintBucket size={32} />,
      span: "col-span-1",
      bgClass: "from-secondary/10 to-secondary/5",
    },
    {
      title: "企业级安全隔离",
      description: "严格遵守 Manifest V3 规范，数据加密存储，权限最小化分配。",
      icon: <ShieldCheck size={32} />,
      span: "col-span-1",
      bgClass: "from-muted-foreground/10 to-muted/10",
    },
    {
      title: "快捷键效率驱动",
      description: "完全支持全键盘操作，Vim-like 模式让你手不离键盘即可掌控全局。",
      icon: <Keyboard size={32} />,
      span: "md:col-span-2 lg:col-span-1",
      bgClass: "from-primary/5 to-accent/5",
    },
  ]

  return (
    <section className="py-20 md:py-28 lg:py-32 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-16"
        >
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
            >
              为了<span className="text-primary">极客</span>而生
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground"
            >
              我们重新构想了浏览器插件的可能。不仅仅是功能堆砌，而是打造优雅、高效的生产力引擎。
            </motion.p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <motion.div 
                key={i} 
                variants={scaleIn}
                className={`group relative p-8 rounded-3xl border border-border bg-card shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 overflow-hidden ${item.span}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgClass} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)] mb-8 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed mt-auto">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
