import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 首页主视觉区。仅使用设计系统颜色与组件。
 */
export function Hero() {
  return (
    <section className="relative w-full py-20 md:py-28">
      <div className="container mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            一次输入，同步所有 AI
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            在 ChatGPT、Claude、Gemini 等分屏会话中，用设计系统驱动的界面一键广播消息。
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/design-system">查看设计系统</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">开始使用</Link>
          </Button>
        </div>
        <div className="grid w-full max-w-2xl gap-4 pt-8 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">设计系统</CardTitle>
              <CardDescription>颜色与组件均来自 Amethyst Haze 主题</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                本页所有样式均使用设计系统变量，无硬编码色值。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">React Router</CardTitle>
              <CardDescription>Design System 展示页由路由驱动</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                通过 Header 中的「Design System」入口进入组件展示。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
