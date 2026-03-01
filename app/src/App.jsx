import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { LandingPage } from "@/pages/LandingPage";
import { DesignSystem } from "@/pages/DesignSystem";

/**
 * 根布局：Header + 路由内容。
 */
function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/design-system" element={<DesignSystem />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;