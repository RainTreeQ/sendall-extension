/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Pricing 区域组件
 * [POS]: 组件层 - 定价方案区块
 */
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

export function Pricing() {
  const plans = [
    {
      name: "Community",
      price: "$0",
      period: "forever",
      description: "适合个人开发者与小规模自动化尝试",
      features: [
        { name: "最多连接 3 个实例", included: true },
        { name: "基础文本同步", included: true },
        { name: "社区支持", included: true },
        { name: "高级快捷键模式", included: false },
        { name: "自定义脚本注入", included: false },
        { name: "数据端到端加密", included: false }
      ],
      cta: "免费获取",
      ctaVariant: "outline",
      highlight: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "per user/month",
      description: "适合需要高效多开管理的极客与运营",
      features: [
        { name: "无限制实例连接数", included: true },
        { name: "全类型交互同步 (点击、滚动等)", included: true },
        { name: "24/7 优先支持", included: true },
        { name: "高级快捷键模式", included: true },
        { name: "自定义脚本注入", included: true },
        { name: "数据端到端加密", included: true }
      ],
      cta: "立即升级",
      ctaVariant: "primary",
      highlight: true
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      description: "适合需要统一管控的 QA 团队",
      features: [
        { name: "包含 10 个 Pro 席位", included: true },
        { name: "全类型交互同步", included: true },
        { name: "SLA 保障及专线支持", included: true },
        { name: "SSO 单点登录集成", included: true },
        { name: "自动化测试 API 接入", included: true },
        { name: "企业级权限控制", included: true }
      ],
      cta: "联系销售",
      ctaVariant: "secondary",
      highlight: false
    }
  ]

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              透明的定价策略
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              无隐藏费用，随时取消。选择最适合你工作流的方案。
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
            {plans.map((plan, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                className={`relative flex flex-col p-8 rounded-[2rem] bg-card border ${plan.highlight ? 'border-primary ring-2 ring-primary/20 shadow-[0_12px_40px_color-mix(in_srgb,var(--primary)_15%,transparent),inset_0_1px_0_rgba(255,255,255,0.2)] md:scale-105 z-10' : 'border-border shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)]'} transition-transform duration-300 hover:-translate-y-2`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="px-4 py-1 text-sm font-semibold rounded-full shadow-[0_4px_12px_color-mix(in_srgb,var(--primary)_30%,transparent)]">
                      最受欢迎
                    </Badge>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground h-12 text-sm leading-relaxed">{plan.description}</p>
                </div>
                
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground font-medium">/{plan.period}</span>
                </div>
                
                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className={`flex items-start gap-3 ${feature.included ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm font-medium">{feature.name}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant={plan.ctaVariant} 
                  size="lg" 
                  className={`w-full rounded-2xl ${plan.highlight ? 'shadow-[0_8px_20px_color-mix(in_srgb,var(--primary)_40%,transparent)] hover:shadow-[0_12px_28px_color-mix(in_srgb,var(--primary)_50%,transparent)]' : ''}`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
