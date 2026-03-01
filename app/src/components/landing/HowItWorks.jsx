/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 How It Works 区域组件
 * [POS]: 组件层 - 步骤演示区块
 */
import { motion } from "framer-motion"
import { staggerContainer, slideInLeft, slideInRight } from "@/lib/motion"
import { Download, Link2, Zap, ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "安装并获取密钥",
      description: "一键安装扩展，在主控端生成你的专属加密连接密钥。",
      icon: <Download size={24} />,
    },
    {
      step: 2,
      title: "建立端对端连接",
      description: "在其他浏览器实例输入密钥，瞬间完成安全的 WebRTC 打洞连接。",
      icon: <Link2 size={24} />,
    },
    {
      step: 3,
      title: "全自动多屏广播",
      description: "现在你的所有输入、点击、滚动，都将毫秒级同步至所有终端。",
      icon: <Zap size={24} />,
    },
  ]

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            三步极简配置，开箱即用
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            无需繁琐的服务端部署，点对点连接，安全稳定。
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-border border-dashed z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((item, index) => (
              <motion.div 
                key={index} 
                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                className="relative z-10 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-32 h-32 rounded-[2rem] bg-card border border-border shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center relative group hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-[0_4px_12px_rgba(var(--primary),0.3)] border-2 border-background">
                    {item.step}
                  </div>
                  <div className="text-primary group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="md:hidden mt-4 text-border">
                    <ArrowRight size={24} className="rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
