/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Testimonials 区域组件
 * [POS]: 组件层 - 用户评价区块
 */
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "@/lib/motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Testimonials() {
  const testimonials = [
    {
      quote: "这改变了我们 QA 团队的工作方式。一次点击，5个不同的浏览器实例同时执行测试步骤，省下了一半以上的时间。",
      name: "Sarah Chen",
      role: "Lead QA Engineer",
      company: "TechFlow",
      initials: "SC"
    },
    {
      quote: "作为一个需要同时管理多个社交媒体账号的运营，这个插件简直是神器。不再需要反复复制粘贴相同的推文。",
      name: "Alex Rivera",
      role: "Social Media Manager",
      company: "GrowthX",
      initials: "AR"
    },
    {
      quote: "微拟物的 UI 设计深得我心。它不仅是一个工具，更像是一件艺术品。快捷键的支持让我能用 Vim 的方式控制所有页面。",
      name: "David Kim",
      role: "Full Stack Developer",
      company: "Indie Hacker",
      initials: "DK"
    },
    {
      quote: "P2P 的连接方式让我非常放心，不用担心账号密码等敏感数据经过第三方服务器。安全性满分。",
      name: "Elena Rostova",
      role: "Security Researcher",
      company: "CyberDefend",
      initials: "ER"
    }
  ]

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/30 border-t border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-background/50 to-transparent pointer-events-none z-10 hidden md:block" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-background/50 to-transparent pointer-events-none z-10 hidden md:block" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-16"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
            >
              深受极客喜爱
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              听听正在使用 AI Broadcast Extension 的开发者和专家怎么说。
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {testimonials.map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="relative p-8 md:p-10 rounded-3xl bg-card border border-border shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300"
              >
                <div className="absolute top-6 left-6 text-6xl text-primary/10 font-serif leading-none select-none">
                  "
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <p className="text-lg text-foreground mb-8 leading-relaxed italic relative z-10 pl-6 border-l-2 border-primary/20">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <Avatar className="w-12 h-12 ring-2 ring-background border border-border shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                      <AvatarImage src={`https://avatar.vercel.sh/${item.initials}`} alt={item.name} />
                      <AvatarFallback className="bg-muted text-muted-foreground">{item.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.role} @ {item.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
