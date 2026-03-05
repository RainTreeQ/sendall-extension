import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { ArrowUp, Check, RefreshCw } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

/** 设计系统 standalone 模式下，返回落地页使用外部链接而非路由 */
const STANDALONE_LANDING_URL = "http://localhost:5173";

const COPY = {
  "zh-CN": {
    internalBadge: "内部页面",
    internalNote: "此页面用于组件与视觉规范校准，不作为线上营销落地页。",
    internalBoundary: "落地页用于对外展示与转化，设计系统用于组件规范与视觉对齐。",
    backLanding: "返回落地页",
    title: "设计系统",
    intro: "当前规范直接映射 Sendol popup：中性黑白灰、圆角列表、底部悬浮输入区、低噪声动效。",
    colorTokens: "颜色 Token",
    popupShell: "弹窗骨架",
    metrics: "弹窗指标",
    metricsDesc: "交互规范与状态反馈",
    size: "尺寸",
    radius: "圆角层级",
    motion: "动效",
    status: "状态色",
    primitives: "基础组件",
    buttonBlock: "按钮",
    buttonBlockDesc: "主按钮黑底，次按钮轻背景",
    badgeBlock: "标签与输入",
    badgeBlockDesc: "平台标识与表单视觉",
    inputPlaceholder: "Popup 输入框样式",
    message: "把这个需求分解为 3 个里程碑，并给出风险项。",
    autoSend: "自动发送",
    newChat: "新对话",
  },
  en: {
    internalBadge: "Internal",
    internalNote: "This page is for component and visual alignment, not public marketing.",
    internalBoundary: "Landing is for public conversion; design system is for component and visual alignment.",
    backLanding: "Back to Landing",
    title: "Design System",
    intro: "This spec maps directly to Sendol popup: neutral grayscale, rounded list items, bottom floating input area, low-noise motion.",
    colorTokens: "Color Tokens",
    popupShell: "Popup Shell",
    metrics: "Popup Metrics",
    metricsDesc: "Interaction rules and status feedback",
    size: "Size",
    radius: "Corner Radius",
    motion: "Motion",
    status: "Status Colors",
    primitives: "Primitive Components",
    buttonBlock: "Buttons",
    buttonBlockDesc: "Primary button on dark surface, secondary on subtle surface",
    badgeBlock: "Badges & Input",
    badgeBlockDesc: "Platform identity and form visuals",
    inputPlaceholder: "Popup input visual",
    message: "Break this requirement into 3 milestones and include risk items.",
    autoSend: "Auto Send",
    newChat: "New Chat",
  },
};

/**
 * 设计系统展示页：对齐当前 popup 真实 UI。
 * @param {{ standalone?: boolean }} props - standalone 为 true 时用于独立站点，返回落地页用外部链接
 */
export function DesignSystem({ standalone }) {
  const { locale } = useSiteSettings();
  const copy = COPY[locale] || COPY.en;

  const tabs = [
    { platform: "ChatGPT", title: locale === "zh-CN" ? "项目方案评审" : "Project plan review" },
    { platform: "Claude", title: locale === "zh-CN" ? "代码重构建议" : "Refactor suggestion" },
    { platform: "Gemini", title: locale === "zh-CN" ? "测试用例补全" : "Test case completion" },
    { platform: "Doubao", title: locale === "zh-CN" ? "中文文案优化" : "Chinese copy optimization" },
    { platform: "Kimi", title: locale === "zh-CN" ? "多轮追问澄清" : "Multi-turn clarifications" },
  ];

  const tokens = [
    { name: "background", className: "bg-background text-foreground border-border" },
    { name: "card", className: "bg-card text-card-foreground border-border" },
    { name: "primary", className: "bg-primary text-primary-foreground border-primary/20" },
    { name: "secondary", className: "bg-secondary text-secondary-foreground border-border" },
    { name: "muted", className: "bg-muted text-muted-foreground border-border" },
    { name: "destructive", className: "bg-destructive text-destructive-foreground border-destructive/20" },
  ];

  return (
    <main id="main-content" className="container mx-auto max-w-6xl space-y-10 px-4 py-10 md:px-6 md:py-12">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/55 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline">{copy.internalBadge}</Badge>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{copy.internalNote}</p>
              <p className="text-sm text-muted-foreground">{copy.internalBoundary}</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            {standalone ? (
              <a href={STANDALONE_LANDING_URL}>{copy.backLanding}</a>
            ) : (
              <Link to="/">{copy.backLanding}</Link>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{copy.title}</h1>
          <p className="text-muted-foreground">{copy.intro}</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{copy.colorTokens}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {tokens.map((token) => (
            <div key={token.name} className={`rounded-2xl border p-4 text-center text-xs font-semibold tracking-wide ${token.className}`}>
              {token.name}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="raised" className="overflow-hidden">
          <div className="relative bg-background p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-primary-foreground shadow-[0_8px_16px_-12px_rgba(0,0,0,0.65)]">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm font-semibold tracking-tight text-foreground">{copy.popupShell}</p>
              </div>
              <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {tabs.map((tab, index) => {
                const selected = index < 4;
                return (
                  <div key={tab.platform} className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 transition ${selected ? "bg-card ring-1 ring-border shadow-[0_10px_22px_-20px_rgba(0,0,0,0.62)]" : "hover:bg-muted"}`}>
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full ${selected ? "bg-foreground text-primary-foreground" : "border border-border bg-card"}`}>
                      {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                    </div>
                    <span className={`platform-badge platform-${tab.platform} rounded-full px-2 py-0.5 text-[10px] font-semibold`}>
                      {tab.platform}
                    </span>
                    <span className="truncate text-xs font-medium text-muted-foreground">{tab.title}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-border/90 bg-muted/75 p-3">
              <textarea
                className="h-20 w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground outline-none"
                defaultValue={copy.message}
                readOnly
              />
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Switch checked />
                    {copy.autoSend}
                  </div>
                  <div className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Switch />
                    {copy.newChat}
                  </div>
                </div>
                <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-primary-foreground shadow-[0_10px_18px_-14px_rgba(0,0,0,0.82)]">
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <CardHeader>
            <CardTitle>{copy.metrics}</CardTitle>
            <CardDescription>{copy.metricsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border bg-muted/55 p-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{copy.size}</p>
              <p className="mt-1 font-mono text-xs text-foreground">380 × 520 (min)</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/55 p-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{copy.radius}</p>
              <p className="mt-1 font-mono text-xs text-foreground">container 16 / list 12 / button 9999</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/55 p-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{copy.motion}</p>
              <p className="mt-1 font-mono text-xs text-foreground">100-300ms, tiny scale + fade only</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/55 p-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{copy.status}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                success
                <span className="ml-2 h-2 w-2 rounded-full bg-rose-500" />
                error
                <span className="ml-2 h-2 w-2 rounded-full bg-zinc-400" />
                pending
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{copy.primitives}</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base">{copy.buttonBlock}</CardTitle>
              <CardDescription>{copy.buttonBlockDesc}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2.5">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base">{copy.badgeBlock}</CardTitle>
              <CardDescription>{copy.badgeBlockDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <span className="platform-badge platform-ChatGPT rounded-full px-2 py-0.5 text-[10px] font-semibold">ChatGPT</span>
                <span className="platform-badge platform-Doubao rounded-full px-2 py-0.5 text-[10px] font-semibold">Doubao</span>
                <span className="platform-badge platform-Kimi rounded-full px-2 py-0.5 text-[10px] font-semibold">Kimi</span>
              </div>
              <Input placeholder={copy.inputPlaceholder} />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
