import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

/**
 * 设计系统展示页。仅使用设计系统颜色与组件。
 */
export function DesignSystem() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Design System</h1>
        <p className="mt-2 text-muted-foreground">
          微拟物光影质感 (Micro-Neumorphism)：渐变背景 + 立体阴影 + 微交互
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">按钮 Button</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">徽标 Badge</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">输入框 Input</h2>
        <div className="max-w-md space-y-4 p-4 rounded-3xl bg-background border">
          <Input placeholder="默认内凹输入框..." />
          <Input type="email" placeholder="输入邮箱地址..." />
          <Input type="password" placeholder="输入密码..." />
          <Input disabled placeholder="禁用状态输入框..." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">卡片 Card</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card variant="default">
            <CardHeader>
              <CardTitle>默认卡片</CardTitle>
              <CardDescription>Default 变体</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                常规的微立体效果，适合作为基础容器。
              </p>
            </CardContent>
          </Card>

          <Card variant="raised">
            <CardHeader>
              <CardTitle>凸起卡片</CardTitle>
              <CardDescription>Raised 变体</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                更强的外投影与高光，悬浮时有更明显的层级变化。
              </p>
            </CardContent>
          </Card>

          <Card variant="inset">
            <CardHeader>
              <CardTitle>内凹卡片</CardTitle>
              <CardDescription>Inset 变体</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                向内凹陷的阴影结构，适合承载次级内容或设置项。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">语义色</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background p-4 text-center text-sm text-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            background
          </div>
          <div className="rounded-2xl border border-border bg-primary p-4 text-center text-sm text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            primary
          </div>
          <div className="rounded-2xl border border-border bg-secondary p-4 text-center text-sm text-secondary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            secondary
          </div>
          <div className="rounded-2xl border border-border bg-muted p-4 text-center text-sm text-muted-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            muted
          </div>
        </div>
      </section>
    </div>
  );
}
