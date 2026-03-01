/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Problem/Agitation 区域组件
 * [POS]: 组件层 - 痛点共鸣区块
 */
import { motion } from "framer-motion"
import { AlertCircle, XCircle, ArrowRight } from "lucide-react"
import { staggerContainer, fadeInUp } from "@/lib/motion"

export function ProblemSection() {
  const painPoints = [
    {
      title: "重复填写枯燥无味",
      desc: "多平台发布相同内容时，需要反复复制粘贴，浪费大量生命。",
    },
    {
      title: "状态同步严重延迟",
      desc: "跨浏览器操作时，账号状态、登录凭证无法实时同步，造成信息断层。",
    },
    {
      title: "UI生硬毫无质感",
      desc: "传统扩展界面粗糙，不符合现代极客开发者的审美需求。",
    }
  ]

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/20 relative">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl mx-auto text-center space-y-12"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              还在为跨端数据同步而痛苦吗？
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              在多开浏览器、多平台分发的时候，我们总是遇到相同的阻碍。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {painPoints.map((point, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <XCircle size={64} className="text-destructive" />
                </div>
                
                <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                  <AlertCircle size={32} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.desc}</p>
                
                <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-destructive text-sm font-medium inline-flex items-center gap-1">
                    这正是我们要解决的
                    <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
