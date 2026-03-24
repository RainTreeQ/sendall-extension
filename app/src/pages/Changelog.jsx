import { useSiteSettings } from "@/lib/site-settings";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Rocket, Sparkles, Wrench } from "lucide-react";

const COPY = {
  en: {
    title: "Changelog",
    subtitle: "New updates and improvements to Sendol.",
  },
  "zh-CN": {
    title: "更新日志",
    subtitle: "Sendol 的最新更新与改进。",
  },
  "zh-TW": {
    title: "更新日誌",
    subtitle: "Sendol 的最新更新與改進。",
  },
  ja: {
    title: "更新履歴",
    subtitle: "Sendolの最新のアップデートと改善。",
  },
  ko: {
    title: "업데이트 내역",
    subtitle: "Sendol의 최신 업데이트 및 개선 사항.",
  },
  es: {
    title: "Registro de cambios",
    subtitle: "Nuevas actualizaciones y mejoras para Sendol.",
  },
  de: {
    title: "Änderungsprotokoll",
    subtitle: "Neue Updates und Verbesserungen für Sendol.",
  },
  fr: {
    title: "Journal des modifications",
    subtitle: "Nouvelles mises à jour et améliorations pour Sendol.",
  }
};

const LOGS = [
  {
    version: "v0.1.0",
    date: "2026-03-24",
    title: {
      en: "Initial Beta Release",
      "zh-CN": "首个 Beta 版本发布",
      "zh-TW": "首個 Beta 版本發布",
      ja: "最初のベータ版リリース",
      ko: "첫 베타 버전 출시",
      es: "Lanzamiento Beta Inicial",
      de: "Erste Beta-Version",
      fr: "Première version bêta"
    },
    description: {
      en: "Welcome to Sendol! This is our first public beta release, bringing you a unified AI broadcasting experience. We've built this extension from the ground up to help you consult multiple AI models simultaneously with maximum efficiency.",
      "zh-CN": "欢迎使用 Sendol！这是我们的首个公开测试版，为您带来统一的 AI 广播体验。我们从零开始构建了这个扩展，旨在帮助您最高效地同时向多个 AI 模型提问。",
      "zh-TW": "歡迎使用 Sendol！這是我們的首個公開測試版，為您帶來統一的 AI 廣播體驗。我們從零開始構建了這個擴展，旨在幫助您最高效地同時向多個 AI 模型提問。"
    },
    sections: [
      {
        type: "feature",
        icon: Rocket,
        title: { en: "Core Features", "zh-CN": "核心功能", "zh-TW": "核心功能" },
        items: {
          en: [
            "Support for 7+ major AI platforms including ChatGPT, Claude, Gemini, DeepSeek, Doubao, Yuanbao, and Kimi.",
            "One-click broadcast with optional auto-send functionality.",
            "Reliable draft protection to prevent data loss when the popup is closed.",
            "Smart detection of currently open AI tabs."
          ],
          "zh-CN": [
            "支持 ChatGPT、Claude、Gemini、DeepSeek、豆包、元宝、Kimi 等 7+ 主流 AI 平台。",
            "一键多发广播，支持自动发送与开启新对话模式。",
            "可靠的草稿保护机制，弹窗意外关闭也不会丢失输入内容。",
            "智能识别当前浏览器已打开的 AI 标签页。"
          ],
          "zh-TW": [
            "支援 ChatGPT、Claude、Gemini、DeepSeek、豆包、元寶、Kimi 等 7+ 主流 AI 平台。",
            "一鍵多發廣播，支援自動發送與開啟新對話模式。",
            "可靠的草稿保護機制，彈窗意外關閉也不會丟失輸入內容。",
            "智能識別當前瀏覽器已打開的 AI 標籤頁。"
          ]
        }
      },
      {
        type: "improvement",
        icon: Sparkles,
        title: { en: "UI & Experience", "zh-CN": "界面与体验", "zh-TW": "界面與體驗" },
        items: {
          en: [
            "Modern, beautiful UI with smooth micro-interactions.",
            "Full multi-language support (8 languages) with automatic browser locale detection.",
            "Automatic System / Light / Dark theme support."
          ],
          "zh-CN": [
            "现代化的精美 UI 设计，包含顺滑的微交互动画。",
            "完整的国际化支持（8种语言），自动匹配浏览器语言偏好。",
            "支持自动跟随系统的浅色/深色模式切换。"
          ],
          "zh-TW": [
            "現代化的精美 UI 設計，包含順滑的微交互動畫。",
            "完整的國際化支援（8種語言），自動匹配瀏覽器語言偏好。",
            "支援自動跟隨系統的淺色/深色模式切換。"
          ]
        }
      }
    ]
  }
];

function getLocalized(obj, locale) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj;
  return obj[locale] || obj["en"] || Object.values(obj)[0];
}

export function Changelog() {
  const { locale } = useSiteSettings();
  const copy = COPY[locale] || COPY.en;

  useEffect(() => {
    document.title = `${copy.title} | Sendol`;
  }, [copy.title]);

  return (
    <main id="main-content" className="container mx-auto px-4 py-16 md:py-24 max-w-3xl min-h-[calc(100vh-8rem)]">
      <div className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">{copy.title}</h1>
        <p className="text-lg md:text-xl text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div className="space-y-16 md:space-y-24">
        {LOGS.map((log) => (
          <article key={log.version} className="relative grid md:grid-cols-[1fr_3fr] gap-8 md:gap-12">
            {/* Left column: Meta info */}
            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2">
              <div className="md:sticky md:top-24 flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1 bg-primary/10 text-primary hover:bg-primary/15 border-none rounded-full font-mono">
                  {log.version}
                </Badge>
                <time className="text-sm text-muted-foreground font-medium">
                  {log.date}
                </time>
              </div>
            </div>

            {/* Right column: Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-3 text-foreground">
                  {getLocalized(log.title, locale)}
                </h2>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {getLocalized(log.description, locale)}
                </p>
              </div>

              <div className="space-y-8">
                {log.sections.map((section, idx) => {
                  const items = getLocalized(section.items, locale);
                  if (!items || items.length === 0) return null;
                  
                  return (
                    <div key={idx} className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <section.icon className="w-4 h-4 text-primary" />
                        {getLocalized(section.title, locale)}
                      </div>
                      <ul className="space-y-3">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[15px] text-muted-foreground leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/20 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}