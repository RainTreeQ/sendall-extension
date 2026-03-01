import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 设计系统工具：合并 class 名，设计必须使用设计系统颜色与组件。
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
