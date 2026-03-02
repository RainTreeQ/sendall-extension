/**
 * [INPUT]: None
 * [OUTPUT]: 落地页 Footer 区域组件
 * [POS]: 组件层 - 页面页脚区块
 */
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, Linkedin, MessageCircle } from "lucide-react"

export function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Integrations", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Community", href: "#" },
        { label: "Blog", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Partners", href: "#" }
      ]
    }
  ]

  const socialLinks = [
    { icon: <Github size={20} />, href: "#" },
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" },
    { icon: <MessageCircle size={20} />, href: "#" }
  ]

  return (
    <footer className="bg-background pt-20 pb-10 border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                广
              </div>
              广发
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              提升浏览器开发效率十倍的终极利器。专注于并发测试与多开自动化。
            </p>
          </div>
          
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h3 className="font-semibold text-foreground tracking-wide">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="bg-border/50 mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} 广发. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx} 
                href={social.href}
                className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
