import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Globe, Monitor, Moon, Sun } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

function LogoIcon({ className }) {
  const cx = 12;
  const cy = 12;
  const r = 10;
  const xLeft = cx - r / 3;
  const xRight = cx + r / 3;
  const dy = Math.sqrt(r * r - (r / 3) ** 2);
  const yTop = cy - dy;
  const yBottom = cy + dy;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
      <line x1={xLeft} y1={yTop} x2={xLeft} y2={yBottom} stroke="var(--logo-divider, #000)" />
      <line x1={xRight} y1={yTop} x2={xRight} y2={yBottom} stroke="var(--logo-divider, #000)" />
    </svg>
  );
}

/**
 * 页面顶栏。仅使用设计系统颜色与组件。
 */
export function Header() {
  const location = useLocation();
  const isDesignSystem = location.pathname.startsWith("/design-system");
  const { locale, setLocale, supportedLocales, themeMode, setThemeMode } = useSiteSettings();

  const copy = locale === "zh-CN"
    ? {
      landing: "落地页",
      backLanding: "返回落地页",
      systemInternal: "设计系统（内部）",
      pro: "专业版",
      github: "GitHub",
      pricing: "定价",
      support: "支持",
      internalTag: "内部页面",
      mainNav: "主导航",
      language: "语言",
      theme: "主题",
      systemMode: "系统",
      lightMode: "浅色",
      darkMode: "深色",
    }
    : {
      landing: "Landing",
      backLanding: "Back to Landing",
      systemInternal: "Design System (Internal)",
      pro: "Pro",
      github: "GitHub",
      pricing: "Pricing",
      support: "Support",
      internalTag: "Internal",
      mainNav: "Main Navigation",
      language: "Language",
      theme: "Theme",
      systemMode: "System",
      lightMode: "Light",
      darkMode: "Dark",
    };

  const cycleThemeMode = () => {
    const order = ["system", "light", "dark"];
    const idx = order.indexOf(themeMode);
    setThemeMode(order[(idx + 1) % order.length]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-2 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background shadow-[0_8px_16px_-12px_rgba(0,0,0,0.75)] [--logo-divider:#000] dark:[--logo-divider:theme(colors.zinc.100)]">
            <LogoIcon className="h-4 w-4" />
          </span>
          <span className="text-base tracking-tight">SendAll</span>
        </Link>

        <nav aria-label={copy.mainNav} className="flex items-center gap-1.5">
          <button
            type="button"
            title={copy.theme}
            aria-label={copy.theme}
            onClick={cycleThemeMode}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
          >
            {themeMode === "dark" ? <Moon className="h-3.5 w-3.5" /> : themeMode === "light" ? <Sun className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
          </button>

          <div className="hidden items-center gap-1 rounded-lg border border-border bg-card px-1 py-1 lg:inline-flex">
            <button
              type="button"
              title={copy.systemMode}
              aria-label={copy.systemMode}
              onClick={() => setThemeMode("system")}
              className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition ${themeMode === "system" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title={copy.lightMode}
              aria-label={copy.lightMode}
              onClick={() => setThemeMode("light")}
              className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition ${themeMode === "light" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title={copy.darkMode}
              aria-label={copy.darkMode}
              onClick={() => setThemeMode("dark")}
              className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition ${themeMode === "dark" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          <label className="relative block">
            <Globe className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <select
              aria-label={copy.language}
              value={locale}
              onChange={(event) => setLocale(event.target.value)}
              className="h-8 w-[104px] rounded-lg border border-border bg-card pl-7 pr-2 text-xs font-medium text-foreground outline-none transition focus:border-ring"
            >
              {supportedLocales.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {isDesignSystem ? (
            <>
              <span className="hidden h-8 items-center rounded-lg border border-border bg-muted px-2.5 text-[11px] font-medium text-muted-foreground md:inline-flex">
                {copy.systemInternal}
              </span>
              <Button asChild variant="secondary" size="sm">
                <Link to="/">{copy.backLanding}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link to="/" aria-current="page">{copy.landing}</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <a href="/#pricing">{copy.pricing}</a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <a href="/#support">{copy.support}</a>
              </Button>
            </>
          )}

          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
            <Link to="/design-system" aria-current={isDesignSystem ? "page" : undefined}>{copy.internalTag}</Link>
          </Button>
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <a href="https://github.com/RainTreeQ/sendall-extension" target="_blank" rel="noreferrer">
              {copy.github}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
            <a href="/#pricing">{copy.pro}</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
