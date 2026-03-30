#!/usr/bin/env node
/**
 * 生成符合实际 Popup 界面的 Chrome Web Store 截图 (1280x800)
 * 直接渲染实际 popup.html 界面
 */
import { chromium } from "playwright";
import { createServer } from "http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "app", "dist-extension");
const assetsDir = join(root, "assets");

// 输出路径
const OUTPUT_FILES = {
  light: [
    join(assetsDir, "store-screenshot-1280x800.png"),
    join(assetsDir, "store-screenshot-1280x800-light.png"),
  ],
  dark: [
    join(assetsDir, "store-screenshot-1280x800-dark.png"),
  ],
};

const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function serveStatic(req, res) {
  let pathname = new URL(req.url || "/", "http://localhost").pathname;
  if (pathname === "/") pathname = "/popup.html";
  const target = join(distDir, pathname.slice(1));
  if (!target.startsWith(distDir) || !existsSync(target)) {
    res.writeHead(404);
    res.end();
    return;
  }
  const ext = extname(target).toLowerCase();
  res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
  res.end(readFileSync(target));
}

async function captureScreenshot(browser, baseUrl, colorScheme) {
  // 1280x800 是 Chrome Web Store 推荐尺寸
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme,
  });
  const page = await context.newPage();

  try {
    // 直接打开 popup.html
    await page.goto(`${baseUrl}/popup.html`, { waitUntil: "networkidle" });
    
    // 注入 mock chrome API
    await page.addInitScript(() => {
      const tabs = [
        { id: 101, platformName: "ChatGPT", title: "ChatGPT", url: "https://chatgpt.com/" },
        { id: 102, platformName: "Claude", title: "Claude", url: "https://claude.ai/" },
        { id: 103, platformName: "Gemini", title: "Gemini", url: "https://gemini.google.com/" },
        { id: 104, platformName: "Kimi", title: "Kimi", url: "https://kimi.com/" },
      ];

      window.chrome = {
        runtime: {
          id: "preview-extension-id",
          sendMessage: (msg) => {
            if (msg?.type === "GET_AI_TABS") return Promise.resolve({ tabs });
            if (msg?.type === "BROADCAST_MESSAGE") {
              return Promise.resolve({
                results: tabs.map((tab) => ({ tabId: tab.id, success: true })),
                summary: { requestId: "preview", totalMs: 260, p95TabMs: 95, successCount: tabs.length, failCount: 0 },
              });
            }
            return Promise.resolve({});
          },
          onMessage: { addListener: () => {}, removeListener: () => {} },
        },
        storage: {
          local: {
            get: async () => ({ autoSend: true, newChat: false, popupDraft: "", aib_failed_sends: [], aib_statuses: [], aib_statuses_timestamp: 0 }),
            set: async () => {},
            remove: async () => {},
          },
        },
        tabs: {
          create: async () => {},
          update: async () => {},
        },
      };
    });

    // 等待 React 组件渲染
    await page.waitForSelector("text=ChatGPT", { timeout: 10000 });
    
    // 填充输入框
    const textarea = page.locator("textarea");
    await textarea.fill("Explain quantum computing in simple terms");
    
    // 移除动画
    await page.addStyleTag({
      content: "*,*::before,*::after{animation:none !important;transition:none !important;}textarea{caret-color:transparent !important;}"
    });
    
    await page.waitForTimeout(200);

    // 截取整个页面
    return await page.screenshot({ type: "png" });
  } finally {
    await context.close();
  }
}

function writeFiles(targets, buffer) {
  for (const target of targets) {
    const parent = dirname(target);
    if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
    writeFileSync(target, buffer);
  }
}

async function main() {
  if (!existsSync(join(distDir, "popup.html"))) {
    console.error("[real:screenshot] Missing app/dist-extension/popup.html. Run npm run build:extension first.");
    process.exit(1);
  }

  const server = createServer(serveStatic);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({ headless: true });

  try {
    console.log("[real:screenshot] Generating 1280x800 screenshots with real popup UI...");
    
    const lightPng = await captureScreenshot(browser, baseUrl, "light");
    const darkPng = await captureScreenshot(browser, baseUrl, "dark");

    writeFiles(OUTPUT_FILES.light, lightPng);
    writeFiles(OUTPUT_FILES.dark, darkPng);

    const totalFiles = OUTPUT_FILES.light.length + OUTPUT_FILES.dark.length;
    console.log(`[real:screenshot] ✓ Generated ${totalFiles} files`);
    console.log("[real:screenshot] Files:");
    [...OUTPUT_FILES.light, ...OUTPUT_FILES.dark].forEach(f => {
      console.log(`  - ${f.replace(root + '/', '')}`);
    });
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error("[real:screenshot] failed:", error);
  process.exit(1);
});
