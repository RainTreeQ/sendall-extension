import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { DesignSystem } from "@/pages/DesignSystem";

/**
 * 根布局：共享 Header/Footer，内容路由拆分为公开落地页与内部设计系统页。
 */
function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-2 z-[60] rounded-md bg-card px-3 py-2 text-sm text-foreground shadow-md focus:not-sr-only focus:outline-none"
        >
          Skip to main content / 跳转到主内容
        </a>
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design-system" element={<DesignSystem />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
