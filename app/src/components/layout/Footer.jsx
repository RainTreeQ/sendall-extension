import { Link } from "react-router-dom";

/**
 * 页脚。仅使用设计系统颜色与组件。
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 px-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          AI Broadcast · 一切设计来自设计系统颜色与组件
        </p>
        <nav className="flex gap-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/design-system"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Design System
          </Link>
        </nav>
      </div>
    </footer>
  );
}
