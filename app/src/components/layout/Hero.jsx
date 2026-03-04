import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Coins, Crown, Globe, HandHeart, Languages, MoonStar, ShieldCheck, Sparkles, SunMoon, Wallet } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

const COPY = {
  "zh-CN": {
    heroBadge: "Chrome / Edge 扩展",
    title1: "一次输入",
    title2: "对比不同 AI 的回答",
    subtitle:
      "SendAll 把多个 AI 标签页集中到一个弹窗里。输入一次，统一注入，可选自动发送和新对话。",
    ctaPricing: "查看收费方案",
    ctaSupport: "支持项目",
    ctaInstall: "安装与使用",
    statPlatforms: "支持平台",
    statMode: "发送模式",
    statDraft: "草稿保护",
    statModeValue: "手动 / 自动",
    statDraftValue: "关闭后优先恢复",
    popupScreenshotAlt: "SendAll 插件弹窗截图",
    featureTitle: "核心能力",
    featureDesc: "功能保持简单：输入、选择、发送。",
    featureOneTitle: "一次输入，多端同步",
    featureOneBody: "在多个 AI 页面之间减少重复粘贴，主流程更短。",
    featureTwoTitle: "发送前可见状态",
    featureTwoBody: "弹窗会列出可用标签页，异常状态会明确提示。",
    featureThreeTitle: "未发送内容尽量保留",
    featureThreeBody: "窗口关闭或意外中断后，草稿会优先恢复。",
    pricingTitle: "免费可用，Pro 可选",
    pricingDesc: "社区版覆盖核心流程，Pro 提供更深的效率能力。",
    communityTitle: "社区版",
    communityDesc: "免费 / 开源",
    communityBody1: "基础广播、自动发送、草稿保留。",
    communityBody2: "适合个人与轻量高频使用。",
    communityBtn: "查看开源仓库",
    proTitle: "专业版",
    proDesc: "建议: 19/月 或 149/年",
    proBody1: "模板库、历史面板、云同步、批量规则。",
    proBody2: "优先适配平台改版，降低中断风险。",
    proBtn: "加入 Pro 等候",
    sponsorTitle: "赞助",
    sponsorDesc: "捐赠 / 支持作者",
    sponsorBody1: "不改现有功能，也可以直接支持项目维护。",
    sponsorBody2: "适合希望长期使用并支持迭代的用户。",
    sponsorBtn: "前往赞助入口",
    languageTitle: "多语言与主题",
    languageDesc: "落地页与插件体验保持一致：中英双语 + system/light/dark。",
    languagePractice1: "首次加载默认跟随浏览器语言。",
    languagePractice2: "顶部可手动切换语言，并持久化设置。",
    languagePractice3: "未覆盖语言回退英文，避免空白内容。",
    languagePractice4: "主题支持 system/light/dark，深浅色截图同步切换。",
    roadmapTitle: "计划中的语言",
    roadmapDesc: "优先保证中英质量，再扩展更多语种。",
    supportTitle: "适用场景",
    supportDesc: "面向同时打开多个 AI 对话窗口的用户。",
    supportBody1: "写作、研发、运营等多平台并行提问。",
    supportBody2: "把同一需求快速发送给多个模型对比结果。",
    supportCtaTitle: "开始使用",
    supportCtaDesc: "保持最小路径：安装扩展，打开多个 AI 窗口后立即可用。",
    supportCtaBody1: "先使用社区版验证你的工作流，再按需升级 Pro。",
    supportCtaBody2: "你也可以通过赞助方式直接支持后续迭代。",
  },
  en: {
    heroBadge: "Chrome / Edge Extension",
    title1: "Type Once",
    title2: "Compare Answers Across AI",
    subtitle:
      "SendAll brings multiple AI tabs into one popup. Write once, inject everywhere, then optionally auto-send and open new chats.",
    ctaPricing: "View Pricing",
    ctaSupport: "Support Project",
    ctaInstall: "Install Guide",
    statPlatforms: "Platforms",
    statMode: "Send Modes",
    statDraft: "Draft Safety",
    statModeValue: "Manual / Auto",
    statDraftValue: "Restore on reopen",
    popupScreenshotAlt: "SendAll extension popup screenshot",
    featureTitle: "Core Capabilities",
    featureDesc: "Keep the workflow simple: write, select, send.",
    featureOneTitle: "One Input, Multi-Tab Sync",
    featureOneBody: "Reduce repeated copy-paste across AI platforms.",
    featureTwoTitle: "Visible Status Before Send",
    featureTwoBody: "The popup lists available tabs and shows clear failure feedback.",
    featureThreeTitle: "Best-Effort Draft Recovery",
    featureThreeBody: "Unsent content is restored after close or interruption.",
    pricingTitle: "Free Core, Optional Pro",
    pricingDesc: "Community covers the primary flow; Pro unlocks deeper productivity.",
    communityTitle: "Community",
    communityDesc: "Free / Open Source",
    communityBody1: "Core broadcast, auto-send, and draft persistence.",
    communityBody2: "Great for solo and lightweight high-frequency workflows.",
    communityBtn: "View Repository",
    proTitle: "Pro",
    proDesc: "Suggested: 19/mo or 149/yr",
    proBody1: "Template library, history panel, cloud sync, batch rules.",
    proBody2: "Priority adaptation for platform UI changes.",
    proBtn: "Join Pro Waitlist",
    sponsorTitle: "Sponsor",
    sponsorDesc: "Donation / Support",
    sponsorBody1: "Support maintenance directly without changing current features.",
    sponsorBody2: "Ideal for long-term users who back continuous iteration.",
    sponsorBtn: "Open Sponsor Page",
    languageTitle: "Language & Theme",
    languageDesc: "Landing and extension stay aligned: CN/EN + system/light/dark.",
    languagePractice1: "First load follows browser language.",
    languagePractice2: "Header provides explicit language switch with persistence.",
    languagePractice3: "Fallback to English for untranslated locales.",
    languagePractice4: "Theme supports system/light/dark with synced screenshot mode.",
    roadmapTitle: "Planned Locales",
    roadmapDesc: "Keep CN/EN quality high, then expand to more locales.",
    supportTitle: "Who It Fits",
    supportDesc: "Built for users running multiple AI chats in parallel.",
    supportBody1: "Useful for writing, engineering, and operations workflows.",
    supportBody2: "Send one request to multiple models and compare faster.",
    supportCtaTitle: "Get Started",
    supportCtaDesc: "Keep the path short: install the extension and use it across multiple AI tabs.",
    supportCtaBody1: "Validate your workflow with Community first, then upgrade to Pro when needed.",
    supportCtaBody2: "You can also support ongoing development via sponsorship.",
  },
};

/**
 * 首页：面向转化的落地页，视觉与 popup 一致。
 */
export function Hero() {
  const { locale, plannedLocales, resolvedTheme } = useSiteSettings();
  const copy = COPY[locale] || COPY.en;
  const screenshotSrc = resolvedTheme === "dark" ? "/screenshot-dark.png" : "/screenshot-light.png";

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-0 h-[520px]">
        <div className="absolute -left-36 top-4 h-72 w-72 rounded-full bg-foreground/8 blur-3xl" />
        <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-foreground/6 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="space-y-7">
            <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase tracking-[0.16em]">
              {copy.heroBadge}
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                {copy.title1}
                <span className="block text-muted-foreground">{copy.title2}</span>
              </h1>
              <p className="max-w-xl text-[15px] leading-7 text-muted-foreground md:text-base">
                {copy.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href="#pricing">{copy.ctaPricing}</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#support">
                  {copy.ctaSupport}
                  <HandHeart className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="https://github.com/RainTreeQ/sendall-extension#-installation--安装" target="_blank" rel="noreferrer">
                  {copy.ctaInstall}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card variant="inset" className="rounded-2xl">
                <CardHeader className="space-y-1 p-4">
                  <CardDescription className="text-[11px] uppercase tracking-[0.12em]">{copy.statPlatforms}</CardDescription>
                  <CardTitle className="text-xl">9+</CardTitle>
                </CardHeader>
              </Card>
              <Card variant="inset" className="rounded-2xl">
                <CardHeader className="space-y-1 p-4">
                  <CardDescription className="text-[11px] uppercase tracking-[0.12em]">{copy.statMode}</CardDescription>
                  <CardTitle className="text-xl">{copy.statModeValue}</CardTitle>
                </CardHeader>
              </Card>
              <Card variant="inset" className="rounded-2xl">
                <CardHeader className="space-y-1 p-4">
                  <CardDescription className="text-[11px] uppercase tracking-[0.12em]">{copy.statDraft}</CardDescription>
                  <CardTitle className="text-xl">{copy.statDraftValue}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="max-w-[380px] overflow-hidden rounded-[24px] shadow-[0_30px_60px_-35px_rgba(0,0,0,0.65)]">
              <img
                src={screenshotSrc}
                alt={copy.popupScreenshotAlt}
                className="block h-auto w-full"
                loading="eager"
              />
            </div>
          </div>
        </div>

        <section id="features" aria-labelledby="features-heading" className="mt-16 space-y-5">
          <div className="flex flex-col gap-2">
            <h2 id="features-heading" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.featureTitle}</h2>
            <p className="text-sm text-muted-foreground md:text-base">{copy.featureDesc}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Wallet className="h-4 w-4" /> {copy.featureOneTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{copy.featureOneBody}</p>
              </CardContent>
            </Card>
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" /> {copy.featureTwoTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{copy.featureTwoBody}</p>
              </CardContent>
            </Card>
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4" /> {copy.featureThreeTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{copy.featureThreeBody}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="pricing" aria-labelledby="pricing-heading" className="mt-16 space-y-5">
          <div className="flex flex-col gap-2">
            <h2 id="pricing-heading" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.pricingTitle}</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              {copy.pricingDesc}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="default" className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Coins className="h-4 w-4" /> {copy.communityTitle}</CardTitle>
                <CardDescription>{copy.communityDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{copy.communityBody1}</p>
                <p>{copy.communityBody2}</p>
                <Button asChild variant="outline" className="mt-3 w-full">
                  <a href="https://github.com/RainTreeQ/sendall-extension" target="_blank" rel="noreferrer">{copy.communityBtn}</a>
                </Button>
              </CardContent>
            </Card>

            <Card variant="raised" className="rounded-2xl border-foreground/15">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Crown className="h-4 w-4" /> {copy.proTitle}</CardTitle>
                <CardDescription>{copy.proDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{copy.proBody1}</p>
                <p>{copy.proBody2}</p>
                <Button asChild className="mt-3 w-full">
                  <a href="https://github.com/RainTreeQ/sendall-extension/issues" target="_blank" rel="noreferrer">{copy.proBtn}</a>
                </Button>
              </CardContent>
            </Card>

            <Card variant="default" className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><HandHeart className="h-4 w-4" /> {copy.sponsorTitle}</CardTitle>
                <CardDescription>{copy.sponsorDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{copy.sponsorBody1}</p>
                <p>{copy.sponsorBody2}</p>
                <Button asChild variant="secondary" className="mt-3 w-full">
                  <a href="https://github.com/sponsors" target="_blank" rel="noreferrer">{copy.sponsorBtn}</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="support" aria-labelledby="support-heading" className="mt-16 space-y-5">
          <h2 id="support-heading" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.ctaSupport}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card variant="inset" className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{copy.supportTitle}</CardTitle>
                <CardDescription>{copy.supportDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{copy.supportBody1}</p>
                <p>{copy.supportBody2}</p>
              </CardContent>
            </Card>
            <Card variant="inset" className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{copy.supportCtaTitle}</CardTitle>
                <CardDescription>{copy.supportCtaDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{copy.supportCtaBody1}</p>
                <p>{copy.supportCtaBody2}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm">
                    <a href="https://github.com/RainTreeQ/sendall-extension#-installation--安装" target="_blank" rel="noreferrer">
                      {copy.ctaInstall}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="#pricing">{copy.ctaPricing}</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="language" aria-labelledby="language-heading" className="mt-16 space-y-5">
          <h2 id="language-heading" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{copy.languageTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card variant="inset" className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Languages className="h-4 w-4" /> {copy.languageTitle}</CardTitle>
                <CardDescription>{copy.languageDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{copy.languagePractice1}</p>
                <p>{copy.languagePractice2}</p>
                <p>{copy.languagePractice3}</p>
                <p className="flex items-center gap-2">
                  <SunMoon className="h-4 w-4" />
                  {copy.languagePractice4}
                </p>
              </CardContent>
            </Card>

            <Card variant="inset" className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Globe className="h-4 w-4" /> {copy.roadmapTitle}</CardTitle>
                <CardDescription>{copy.roadmapDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {plannedLocales.map((item) => (
                    <Badge key={item.code} variant="outline" className="px-3 py-1 text-[11px]">
                      {item.label}
                    </Badge>
                  ))}
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MoonStar className="h-4 w-4" />
                  system/light/dark
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </section>
  );
}
