import { cn } from "@/lib/utils";

/**
 * 设计系统开关。仅使用设计系统颜色，无 Radix 依赖。
 */
function Switch({ className, checked, onCheckedChange, disabled, ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-[1.375rem] w-6 shrink-0 cursor-pointer items-center rounded-full border-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-[0.625rem] w-[0.625rem] shrink-0 rounded-full bg-primary-foreground shadow-sm transition-transform",
          checked ? "translate-x-[1.125rem]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export { Switch };
