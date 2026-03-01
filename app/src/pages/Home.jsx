import { Hero } from "@/components/layout/Hero";

/**
 * 首页。仅使用设计系统颜色与组件。
 */
export function Home() {
  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <Hero />
    </main>
  );
}
