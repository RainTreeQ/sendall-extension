#!/bin/bash
#
# Sendol Extension - Build and Package Script
# 一键打包脚本：构建 popup + 打包扩展
#

set -e  # 出错立即退出

echo "🚀 Sendol Extension Build Script"
echo "=================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Step 1: 安装依赖
echo ""
echo "📦 Step 1: Installing dependencies..."
npm ci --silent
cd app && npm ci --silent && cd ..

# Step 2: 构建 popup
echo ""
echo "🔨 Step 2: Building popup..."
cd app
npm run build:extension
cd ..

# Step 3: 检查构建输出
if [ ! -d "app/dist-extension" ]; then
    echo -e "${RED}❌ Build output not found: app/dist-extension/${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Popup built successfully${NC}"

# Step 4: 打包扩展
echo ""
echo "📦 Step 3: Packaging extension..."
node scripts/package-extension.mjs

# Step 5: 检查打包结果
if [ ! -d "release/extension" ]; then
    echo -e "${RED}❌ Package directory not found: release/extension/${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""

# 显示结果
if [ -f "release/extension-size-report.json" ]; then
    echo "📊 Size Report:"
    node -e "
        const fs = require('fs');
        const report = JSON.parse(fs.readFileSync('release/extension-size-report.json', 'utf8'));
        console.log('   Version: ' + report.version);
        console.log('   Total: ' + report.totalKB + ' KB');
        console.log('   Budget: ' + (report.maxBytes/1024) + ' KB');
        console.log('   Status: ' + (report.withinBudget ? '${GREEN}✓ Within budget${NC}' : '${RED}✗ Over budget${NC}'));
    "
fi

echo ""
echo "📁 Output files:"
echo "   - release/extension/ (unpacked)"
if [ -f "release/sendol-extension-v*.zip" ]; then
    echo "   - release/sendol-extension-v*.zip (packed)"
fi
echo ""
echo -e "${GREEN}🎉 Ready for Chrome Web Store submission!${NC}"
echo ""
echo "Next steps:"
echo "   1. Test locally: chrome://extensions/ → Developer mode → Load unpacked → select release/extension/"
echo "   2. Submit to Chrome Web Store: https://chrome.google.com/webstore/devconsole"
echo ""
