import { Heart, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

/**
 * 落地页页脚。仅使用设计系统颜色与组件。
 */
export function Footer() {
  const { locale } = useSiteSettings();
  const copy = locale === "zh-CN"
    ? {
      subtitle: "SendAll · 开源核心 + Pro 功能",
      pricing: "定价",
      support: "支持",
      github: "GitHub",
      footerNav: "页脚导航",
    }
    : {
      subtitle: "SendAll · Open Source Core + Pro Features",
      pricing: "Pricing",
      support: "Support",
      github: "GitHub",
      footerNav: "Footer Navigation",
    };

  return (
    <footer className="w-full border-t border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          {copy.subtitle}
        </p>
        <nav aria-label={copy.footerNav} className="flex gap-6">
          <a
            href="/#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.pricing}
          </a>
          <a
            href="/#support"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.support}
            <Heart className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://github.com/RainTreeQ/sendall-extension"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.github}
          </a>
        </nav>
      </div>
    </footer>
  );
}
