#!/usr/bin/env node
/**
 * 生成 Chrome Web Store 截图 (1280x800)
 * 基于 capture-popup-screenshot.mjs 修改，渲染展示页面
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

const OUTPUT_LIGHT = [
  join(assetsDir, "store-screenshot-1280x800.png"),
  join(assetsDir, "store-screenshot-1280x800-light.png"),
];
const OUTPUT_DARK = [
  join(assetsDir, "store-screenshot-1280x800-dark.png"),
];

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

async function setupMockChrome(page) {
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
          get: async () => ({ 
            autoSend: true, 
            newChat: false, 
            popupDraft: "",
            aib_failed_sends: [],
            aib_statuses: [],
            aib_statuses_timestamp: 0
          }),
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
}

async function captureStoreScreenshot(browser, baseUrl, colorScheme) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme,
  });
  const page = await context.newPage();

  try {
    // 创建展示页面，包含实际 popup 的 iframe
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1280px;
            height: 800px;
            background: ${colorScheme === 'dark' 
              ? 'linear-gradient(135deg, #0a0a0f 0%, #18181b 50%, #27272a 100%)' 
              : 'linear-gradient(135deg, #fafafa 0%, #f4f4f5 50%, #e4e4e7 100%)'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            position: relative;
            overflow: hidden;
          }
          .bg-grid {
            position: absolute;
            inset: 0;
            background-image: 
              linear-gradient(${colorScheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 1px, transparent 1px),
              linear-gradient(90deg, ${colorScheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'} 1px, transparent 1px);
            background-size: 40px 40px;
          }
          .content {
            display: flex;
            gap: 80px;
            align-items: center;
            z-index: 10;
          }
          .info {
            max-width: 480px;
          }
          .logo {
            width: 72px;
            height: 72px;
            background: ${colorScheme === 'dark' ? '#fff' : '#000'};
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 28px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.2);
          }
          .logo-icon {
            width: 36px;
            height: 36px;
            position: relative;
          }
          .logo-icon::before, .logo-icon::after {
            content: '';
            position: absolute;
            width: 5px;
            height: 22px;
            background: ${colorScheme === 'dark' ? '#000' : '#fff'};
            border-radius: 2.5px;
            top: 7px;
          }
          .logo-icon::before { left: 9px; }
          .logo-icon::after { right: 9px; }
          h1 {
            font-size: 56px;
            font-weight: 800;
            color: ${colorScheme === 'dark' ? '#fff' : '#18181b'};
            margin-bottom: 16px;
            letter-spacing: -0.02em;
          }
          h1 span { color: #4a90d2; }
          .tagline {
            font-size: 24px;
            color: ${colorScheme === 'dark' ? '#a1a1aa' : '#52525b'};
            margin-bottom: 32px;
            line-height: 1.5;
          }
          .features {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .feature {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 16px;
            color: ${colorScheme === 'dark' ? '#d4d4d8' : '#3f3f46'};
          }
          .feature-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          }
          .popup-wrapper {
            width: 400px;
            height: 600px;
            background: ${colorScheme === 'dark' ? '#09090b' : '#fff'};
            border-radius: 24px;
            box-shadow: 
              0 32px 64px -16px rgba(0,0,0,0.4),
              0 0 0 1px ${colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="bg-grid"></div>
        <div class="content">
          <div class="info">
            <div class="logo">
              <div class="logo-icon"></div>
            </div>
            <h1>Sendol <span>AI Broadcast</span></h1>
            <p class="tagline">Ask once, compare answers from multiple AI platforms</p>
            <div class="features">
              <div class="feature">
                <span class="feature-icon">⚡</span>
                <span>One-click broadcast to ChatGPT, Claude, Gemini & more</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🔄</span>
                <span>Auto-send and smart retry</span>
              </div>
              <div class="feature">
                <span class="feature-icon">⌨️</span>
                <span>Ctrl+Enter to send instantly</span>
              </div>
            </div>
          </div>
          <div class="popup-wrapper" id="popup-container"></div>
        </div>
        <script>
          // Load popup via fetch and inject
          fetch('${baseUrl}/popup.html')
            .then(r => r.text())
            .then(html => {
              document.getElementById('popup-container').innerHTML = html;
              // Execute scripts
              const scripts = document.getElementById('popup-container').querySelectorAll('script');
              scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => {
                  newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = oldScript.textContent;
                oldScript.parentNode.replaceChild(newScript, oldScript);
              });
            });
        </script>
      </body>
      </html>
    `);

    // 注入 mock chrome API
    await setupMockChrome(page);
    
    // 等待 popup 加载
    await page.waitForTimeout(2500);
    
    // 尝试填充输入框
    try {
      const textarea = page.locator('textarea');
      await textarea.waitFor({ timeout: 5000 });
      await textarea.fill("Explain quantum computing in simple terms");
    } catch {
      // 如果失败，继续截图
    }

    // 移除动画
    await page.addStyleTag({
      content: "*,*::before,*::after{animation:none !important;transition:none !important;}textarea{caret-color:transparent !important;}"
    });
    
    await page.waitForTimeout(200);

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
    console.error("[store:screenshot] Missing app/dist-extension/popup.html. Run npm run build:extension first.");
    process.exit(1);
  }

  const server = createServer(serveStatic);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({ headless: true });

  try {
    console.log("[store:screenshot] Generating 1280x800 screenshots...");
    
    const lightPng = await captureStoreScreenshot(browser, baseUrl, "light");
    const darkPng = await captureStoreScreenshot(browser, baseUrl, "dark");

    writeFiles(OUTPUT_LIGHT, lightPng);
    writeFiles(OUTPUT_DARK, darkPng);

    const totalFiles = OUTPUT_LIGHT.length + OUTPUT_DARK.length;
    console.log(`[store:screenshot] ✓ Generated ${totalFiles} files`);
    console.log("[store:screenshot] Files:");
    [...OUTPUT_LIGHT, ...OUTPUT_DARK].forEach(f => {
      console.log(`  - ${f.replace(root + '/', '')}`);
    });
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error("[store:screenshot] failed:", error);
  process.exit(1);
});
