import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 设计系统独立开发配置：仅用于本地预览，不参与主站 build。
 * 运行: npm run dev:design-system
 * 落地页与设计系统需分别启动以互相链接。
 */
export default defineConfig({
  root: __dirname,
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: "dist-design-system",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        "design-system": path.resolve(__dirname, "design-system.html"),
      },
    },
  },
});
