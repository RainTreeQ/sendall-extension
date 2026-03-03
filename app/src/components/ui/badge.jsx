/**
 * [INPUT]: variant, className
 * [OUTPUT]: 统一风格徽标组件（微拟物渐变效果）
 * [POS]: UI基础层 - 数据展示原语
 */
import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

/* ========================================
   Badge 样式配置 - 渐变 + 立体效果
   ======================================== */

const BADGE_STYLES = {
  default: {
    background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, black) 50%, color-mix(in srgb, var(--primary) 70%, black) 100%)',
    boxShadow: '0 2px 6px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
  },
  secondary: {
    background: 'linear-gradient(135deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary) 90%, black) 50%, color-mix(in srgb, var(--secondary) 80%, black) 100%)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.05)',
  },
  destructive: {
    background: 'linear-gradient(135deg, var(--destructive) 0%, color-mix(in srgb, var(--destructive) 85%, black) 50%, color-mix(in srgb, var(--destructive) 70%, black) 100%)',
    boxShadow: '0 2px 6px color-mix(in srgb, var(--destructive) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
  },
  outline: {
    background: 'transparent',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
  },
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent text-primary-foreground",
        secondary: "border-transparent text-secondary-foreground",
        destructive: "border-transparent text-destructive-foreground",
        outline: "text-foreground border border-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant = "default", style, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "div"
  
  const styleConfig = BADGE_STYLES[variant] || BADGE_STYLES.default
  const needsCustomStyle = !['outline'].includes(variant)
  
  const combinedStyle = needsCustomStyle ? {
    background: styleConfig.background,
    boxShadow: styleConfig.boxShadow,
    ...style,
  } : style
  
  return (
    <Comp 
      className={cn(badgeVariants({ variant }), className)} 
      style={combinedStyle} 
      {...props} 
    />
  )
}

export { Badge }
