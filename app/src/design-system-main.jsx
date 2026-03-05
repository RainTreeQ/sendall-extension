import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SiteSettingsProvider } from "@/lib/site-settings";
import { DesignSystem } from "@/pages/DesignSystem";

/**
 * 设计系统独立入口：仅供本地开发使用，不参与生产构建与发布。
 * 落地页运行在 5173 时，可通过返回按钮跳转。
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteSettingsProvider>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl">
          <div className="container flex h-14 items-center justify-between px-4 md:px-6">
            <span className="text-sm font-medium text-muted-foreground">
              Sendol Design System · 本地开发
            </span>
            <a
              href="http://localhost:5173"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              打开落地页
            </a>
          </div>
        </header>
        <DesignSystem standalone />
      </div>
    </SiteSettingsProvider>
  </StrictMode>,
);
