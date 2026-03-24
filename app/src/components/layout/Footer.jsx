import { Heart, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSiteSettings } from "@/lib/site-settings";

/**
 * 落地页页脚。仅使用设计系统颜色与组件。
 */
export function Footer() {
  const { locale } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const copy = locale === "zh-CN"
    ? {
      subtitle: "Sendol · 开源核心 + Pro 功能",
      pricing: "定价",
      support: "使用说明",
      github: "GitHub",
      footerNav: "页脚导航",
      privacy: "隐私政策",
      terms: "使用条款",
      changelog: "更新日志",
      contact: "联系我们"
    }
    : {
      subtitle: "Sendol · Open Source Core + Pro Features",
      pricing: "Pricing",
      support: "User Guide",
      github: "GitHub",
      footerNav: "Footer Navigation",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      changelog: "Changelog",
      contact: "Contact"
    };

  return (
    <footer className="w-full border-t border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="container flex flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:px-6">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <p className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Sparkles className="h-4 w-4" />
            {copy.subtitle}
          </p>
        </div>
        
        <nav aria-label={copy.footerNav} className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
          <button onClick={(e) => handleScrollTo(e, "pricing")} className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
            {copy.pricing}
          </button>
          <Link to="/install" onClick={() => window.scrollTo(0, 0)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {copy.support}
          </Link>
          <Link to="/changelog" onClick={() => window.scrollTo(0, 0)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {copy.changelog}
          </Link>
          <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {copy.privacy}
          </Link>
          <Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {copy.terms}
          </Link>
          <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {copy.contact}
          </Link>
          <a
            href="https://github.com/RainTreeQ/sendol-extension"
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
