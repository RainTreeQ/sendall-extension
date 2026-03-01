/**
 * [INPUT]: type, className
 * [OUTPUT]: 统一风格输入框组件（微拟物内凹效果）
 * [POS]: UI基础层 - 核心表单原语
 */
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border-none bg-muted px-4 py-2 text-sm text-foreground",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(0,0,0,0.1),inset_0_-1px_0_rgba(255,255,255,0.1)]",
        "transition-all duration-200",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(0,0,0,0.1),inset_0_-1px_0_rgba(255,255,255,0.1)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
