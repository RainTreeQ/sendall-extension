#!/usr/bin/env node
/**
 * 生成 Chrome Web Store 横屏截图 (1280x800)
 * CWS 要求截图尺寸：1280x800 或 640x400
 */
import { chromium } from "playwright";
import { createServer } from "http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "app", "dist-extension");

// 输出路径
const outputTargets = {
  light: [
    join(root, "assets", "store-screenshot-1280x800.png"),
    join(root, "assets", "store-screenshot-1280x800-light.png"),
  ],
  dark: [
    join(root, "assets", "store-screenshot-1280x800-dark.png"),
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

async function setupPage(page) {
  await page.addInitScript(() => {
    const tabs = [
      { id: 101, platformName: "ChatGPT", title: "Requirement Breakdown", url: "https://chatgpt.com/" },
      { id: 102, platformName: "Claude", title: "Implementation Plan", url: "https://claude.ai/" },
      { id: 103, platformName: "Gemini", title: "Test Checklist", url: "https://gemini.google.com/" },
      { id: 104, platformName: "Doubao", title: "Content Polish", url: "https://www.doubao.com/" },
      { id: 105, platformName: "Kimi", title: "Deep Research", url: "https://kimi.com/" },
    ];

    window.chrome = {
      runtime: {
        id: "preview-extension-id",
        sendMessage: (msg) => {
          if (msg?.type === "GET_AI_TABS") return Promise.resolve({ tabs });
          if (msg?.type === "BROADCAST_MESSAGE") {
            return Promise.resolve({
              results: tabs.map((tab) => ({ tabId: tab.id, success: true })),
              summary: {
                requestId: "preview",
                totalMs: 260,
                p95TabMs: 95,
                successCount: tabs.length,
                failCount: 0,
              },
            });
          }
          return Promise.resolve({});
        },
        onMessage: {
          addListener: () => {},
          removeListener: () => {},
        },
      },
      storage: {
        local: {
          get: async () => ({ autoSend: true, newChat: false, popupDraft: "" }),
          set: async () => {},
          remove: async () => {},
        },
      },
    };
  });
}

async function captureStoreScreenshot(browser, baseUrl, colorScheme) {
  // 1280x800 是 Chrome Web Store 推荐尺寸
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme,
  });
  const page = await context.newPage();

  try {
    // 直接使用 canvas 生成推广图（不需要加载 iframe，避免跨域问题）
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
              ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'};
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
              linear-gradient(${colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px),
              linear-gradient(90deg, ${colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px);
            background-size: 40px 40px;
          }
          .content {
            display: flex;
            gap: 80px;
            align-items: center;
            z-index: 10;
          }
          .info {
            max-width: 520px;
          }
          .logo {
            width: 88px;
            height: 88px;
            background: #fff;
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 36px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          }
          .logo-icon {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #333 0%, #666 100%);
            border-radius: 11px;
            position: relative;
          }
          .logo-icon::before, .logo-icon::after {
            content: '';
            position: absolute;
            width: 7px;
            height: 26px;
            background: #fff;
            border-radius: 3.5px;
            top: 9px;
          }
          .logo-icon::before { left: 11px; }
          .logo-icon::after { right: 11px; }
          h1 {
            font-size: 64px;
            font-weight: 800;
            color: ${colorScheme === 'dark' ? '#fff' : '#1a1a2e'};
            margin-bottom: 20px;
            letter-spacing: -0.02em;
          }
          h1 span { color: #4a90d2; }
          .tagline {
            font-size: 28px;
            color: ${colorScheme === 'dark' ? '#aaa' : '#555'};
            margin-bottom: 40px;
            line-height: 1.5;
            font-weight: 400;
          }
          .features {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
          }
          .feature {
            padding: 10px 20px;
            background: ${colorScheme === 'dark' ? 'rgba(74,144,210,0.15)' : 'rgba(74,144,210,0.1)'};
            border: 1px solid ${colorScheme === 'dark' ? 'rgba(74,144,210,0.25)' : 'rgba(74,144,210,0.2)'};
            border-radius: 24px;
            font-size: 16px;
            color: ${colorScheme === 'dark' ? '#fff' : '#333'};
            font-weight: 500;
          }
          .preview {
            width: 420px;
            height: 600px;
            background: ${colorScheme === 'dark' ? '#1a1a2e' : '#fff'};
            border-radius: 28px;
            box-shadow: 
              0 32px 64px -16px rgba(0,0,0,0.3),
              0 0 0 1px ${colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
            padding: 28px;
            display: flex;
            flex-direction: column;
          }
          .preview-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid ${colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          }
          .preview-logo {
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #333, #666);
            border-radius: 7px;
            position: relative;
          }
          .preview-logo::before, .preview-logo::after {
            content: '';
            position: absolute;
            width: 4px;
            height: 14px;
            background: #fff;
            border-radius: 2px;
            top: 7px;
          }
          .preview-logo::before { left: 7px; }
          .preview-logo::after { right: 7px; }
          .preview-title {
            font-size: 16px;
            font-weight: 600;
            color: ${colorScheme === 'dark' ? '#fff' : '#1a1a2e'};
          }
          .tabs {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 16px;
          }
          .tab {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 14px;
            background: ${colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
            border-radius: 12px;
            border: 1px solid ${colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          }
          .tab-icon {
            width: 28px;
            height: 28px;
            border-radius: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
          }
          .tab-icon.gpt { background: #10a37f; }
          .tab-icon.claude { background: #d46332; }
          .tab-icon.gemini { background: #4285f4; }
          .tab-icon.kimi { background: #4a90d2; }
          .tab-icon.doubao { background: #9b59b6; }
          .tab-info {
            flex: 1;
          }
          .tab-name {
            font-size: 13px;
            font-weight: 600;
            color: ${colorScheme === 'dark' ? '#fff' : '#1a1a2e'};
          }
          .tab-status {
            font-size: 11px;
            color: ${colorScheme === 'dark' ? '#888' : '#666'};
          }
          .tab-toggle {
            width: 36px;
            height: 20px;
            background: #4a90d2;
            border-radius: 10px;
            position: relative;
          }
          .tab-toggle::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            top: 2px;
            right: 2px;
          }
          .input-area {
            flex: 1;
            background: ${colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid ${colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          }
          .input-text {
            font-size: 14px;
            color: ${colorScheme === 'dark' ? '#ccc' : '#444'};
            line-height: 1.6;
          }
          .send-btn {
            padding: 14px;
            background: linear-gradient(135deg, #333, #555);
            color: #fff;
            border-radius: 12px;
            text-align: center;
            font-size: 15px;
            font-weight: 600;
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
            <p class="tagline">Compare answers from multiple AI platforms instantly</p>
            <div class="features">
              <span class="feature">⚡ One Question, All Answers</span>
              <span class="feature">🔄 Auto-Send</span>
              <span class="feature">⌨️ Ctrl+Enter</span>
            </div>
          </div>
          <div class="preview">
            <div class="preview-header">
              <div class="preview-logo"></div>
              <span class="preview-title">Sendol</span>
            </div>
            <div class="tabs">
              <div class="tab">
                <div class="tab-icon gpt">C</div>
                <div class="tab-info">
                  <div class="tab-name">ChatGPT</div>
                  <div class="tab-status">Ready</div>
                </div>
                <div class="tab-toggle"></div>
              </div>
              <div class="tab">
                <div class="tab-icon claude">C</div>
                <div class="tab-info">
                  <div class="tab-name">Claude</div>
                  <div class="tab-status">Ready</div>
                </div>
                <div class="tab-toggle"></div>
              </div>
              <div class="tab">
                <div class="tab-icon gemini">G</div>
                <div class="tab-info">
                  <div class="tab-name">Gemini</div>
                  <div class="tab-status">Ready</div>
                </div>
                <div class="tab-toggle"></div>
              </div>
              <div class="tab">
                <div class="tab-icon kimi">K</div>
                <div class="tab-info">
                  <div class="tab-name">Kimi</div>
                  <div class="tab-status">Ready</div>
                </div>
                <div class="tab-toggle"></div>
              </div>
            </div>
            <div class="input-area">
              <div class="input-text">Explain quantum computing in simple terms...</div>
            </div>
            <div class="send-btn">Send to All (Ctrl+Enter)</div>
          </div>
        </div>
      </body>
      </html>
    `);

    await page.waitForTimeout(500);
    
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

    writeFiles(outputTargets.light, lightPng);
    writeFiles(outputTargets.dark, darkPng);

    const totalFiles = outputTargets.light.length + outputTargets.dark.length;
    console.log(`[store:screenshot] ✓ Generated ${totalFiles} files (light + dark)`);
    console.log("[store:screenshot] Files:");
    [...outputTargets.light, ...outputTargets.dark].forEach(f => {
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
