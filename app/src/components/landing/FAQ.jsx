/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 FAQ 区域组件
 * [POS]: 组件层 - 常见问题区块
 */
import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "@/lib/motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "什么是 广发？",
      answer: "它是一个基于浏览器插件技术（Manifest V3）的多屏同步工具。允许你将一个主控浏览器实例的操作（如输入、点击、滚动），毫秒级同步到任意数量的受控浏览器实例中，非常适合需要多开账号、自动化测试等场景。"
    },
    {
      question: "它的连接原理是什么，安全吗？",
      answer: "我们采用基于 WebRTC 的 P2P 点对点连接技术。数据仅在你的设备之间加密传输，不经过任何第三方中转服务器，绝对保证你的隐私和数据安全。"
    },
    {
      question: "支持哪些浏览器？",
      answer: "目前完美支持所有基于 Chromium 的现代浏览器，包括 Google Chrome, Microsoft Edge, Brave, Vivaldi 以及 Arc 等。"
    },
    {
      question: "是否有连接数量限制？",
      answer: "Community 版限制最多同时连接 3 个受控实例。升级到 Pro 或 Team 版后，将解除所有连接数量限制，你可以根据硬件性能无限拓展。"
    },
    {
      question: "如果我不满意可以退款吗？",
      answer: "当然可以。我们提供 14 天无理由全额退款保证。只需联系我们的支持团队，即可快速处理。"
    }
  ]

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/10 border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              常见问题解答
            </h2>
            <p className="text-lg text-muted-foreground">
              如果这里没有你想要的答案，欢迎随时联系我们的技术支持。
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-card rounded-[2rem] p-8 md:p-12 border border-border shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-border/50 py-2 last:border-0"
                >
                  <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4 pr-12">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
