#!/usr/bin/env node
/**
 * 生成 Chrome Web Store 推广图片
 * 横幅: 1400x560
 * 缩略图: 440x280
 */
import { createCanvas } from 'canvas'
import path from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const assetsDir = path.join(root, 'assets')

async function main() {
  let canvas, registerFont
  try {
    const canvasModule = await import('canvas')
    canvas = canvasModule.createCanvas
    registerFont = canvasModule.registerFont
  } catch {
    console.error('请先安装 canvas: npm install -D canvas')
    process.exit(1)
  }

  // 生成横幅 (1400x560)
  console.log('生成横幅图片 (1400x560)...')
  const bannerCanvas = canvas(1400, 560)
  const bannerCtx = bannerCanvas.getContext('2d')

  // 背景渐变
  const bannerGradient = bannerCtx.createLinearGradient(0, 0, 1400, 560)
  bannerGradient.addColorStop(0, '#1a1a2e')
  bannerGradient.addColorStop(0.5, '#16213e')
  bannerGradient.addColorStop(1, '#0f3460')
  bannerCtx.fillStyle = bannerGradient
  bannerCtx.fillRect(0, 0, 1400, 560)

  // 装饰性圆点
  bannerCtx.globalAlpha = 0.15
  bannerCtx.fillStyle = '#4a90d2'
  bannerCtx.beginPath()
  bannerCtx.arc(280, 448, 120, 0, Math.PI * 2)
  bannerCtx.fill()

  bannerCtx.fillStyle = '#5a7c4a'
  bannerCtx.beginPath()
  bannerCtx.arc(1120, 112, 100, 0, Math.PI * 2)
  bannerCtx.fill()

  bannerCtx.fillStyle = '#e74c3c'
  bannerCtx.beginPath()
  bannerCtx.arc(700, 280, 80, 0, Math.PI * 2)
  bannerCtx.fill()
  bannerCtx.globalAlpha = 1

  // Logo 背景
  bannerCtx.fillStyle = '#ffffff'
  bannerCtx.shadowColor = 'rgba(0,0,0,0.4)'
  bannerCtx.shadowBlur = 40
  bannerCtx.shadowOffsetY = 12
  bannerCtx.beginPath()
  bannerCtx.roundRect(650, 80, 100, 100, 24)
  bannerCtx.fill()
  bannerCtx.shadowColor = 'transparent'

  // Logo 图标 (两个竖条)
  bannerCtx.fillStyle = '#333333'
  bannerCtx.beginPath()
  bannerCtx.roundRect(665, 90, 8, 30, 4)
  bannerCtx.fill()
  bannerCtx.beginPath()
  bannerCtx.roundRect(727, 90, 8, 30, 4)
  bannerCtx.fill()

  // 标题
  bannerCtx.fillStyle = '#ffffff'
  bannerCtx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  bannerCtx.textAlign = 'center'
  bannerCtx.fillText('Sendol ', 700, 280)

  // 副标题 (蓝色)
  bannerCtx.fillStyle = '#4a90d2'
  bannerCtx.fillText('AI Broadcast', 700, 280)

  // 标语
  bannerCtx.fillStyle = '#aaaaaa'
  bannerCtx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  bannerCtx.fillText('Type Once, Broadcast to All AI Platforms', 700, 330)

  // 平台图标
  const platforms = [
    { x: 580, color: 'rgba(16, 163, 127, 0.3)', border: 'rgba(16, 163, 127, 0.5)', text: 'C' },
    { x: 656, color: 'rgba(212, 100, 50, 0.3)', border: 'rgba(212, 100, 50, 0.5)', text: 'G' },
    { x: 732, color: 'rgba(66, 133, 244, 0.3)', border: 'rgba(66, 133, 244, 0.5)', text: 'D' },
    { x: 808, color: 'rgba(74, 144, 210, 0.3)', border: 'rgba(74, 144, 210, 0.5)', text: 'K' },
    { x: 884, color: 'rgba(155, 89, 182, 0.3)', border: 'rgba(155, 89, 182, 0.5)', text: '+' },
  ]

  platforms.forEach(p => {
    bannerCtx.fillStyle = p.color
    bannerCtx.strokeStyle = p.border
    bannerCtx.lineWidth = 2
    bannerCtx.beginPath()
    bannerCtx.roundRect(p.x, 400, 56, 56, 16)
    bannerCtx.fill()
    bannerCtx.stroke()

    bannerCtx.fillStyle = '#ffffff'
    bannerCtx.font = 'bold 22px -apple-system, sans-serif'
    bannerCtx.textAlign = 'center'
    bannerCtx.textBaseline = 'middle'
    bannerCtx.fillText(p.text, p.x + 28, 428)
  })

  // 保存横幅
  const bannerBuffer = bannerCanvas.toBuffer('image/png')
  writeFileSync(path.join(assetsDir, 'store-banner-1400x560.png'), bannerBuffer)
  console.log('  ✓ assets/store-banner-1400x560.png')

  // 生成缩略图 (440x280)
  console.log('生成缩略图 (440x280)...')
  const thumbCanvas = canvas(440, 280)
  const thumbCtx = thumbCanvas.getContext('2d')

  // 背景渐变
  const thumbGradient = thumbCtx.createLinearGradient(0, 0, 440, 280)
  thumbGradient.addColorStop(0, '#1a1a2e')
  thumbGradient.addColorStop(1, '#16213e')
  thumbCtx.fillStyle = thumbGradient
  thumbCtx.fillRect(0, 0, 440, 280)

  // 装饰圆点
  thumbCtx.globalAlpha = 0.2
  thumbCtx.fillStyle = '#4a90d2'
  thumbCtx.beginPath()
  thumbCtx.arc(132, 196, 60, 0, Math.PI * 2)
  thumbCtx.fill()

  thumbCtx.fillStyle = '#5a7c4a'
  thumbCtx.beginPath()
  thumbCtx.arc(308, 84, 50, 0, Math.PI * 2)
  thumbCtx.fill()
  thumbCtx.globalAlpha = 1

  // Logo 背景
  thumbCtx.fillStyle = '#ffffff'
  thumbCtx.shadowColor = 'rgba(0,0,0,0.3)'
  thumbCtx.shadowBlur = 24
  thumbCtx.shadowOffsetY = 8
  thumbCtx.beginPath()
  thumbCtx.roundRect(184, 50, 72, 72, 18)
  thumbCtx.fill()
  thumbCtx.shadowColor = 'transparent'

  // Logo 图标
  thumbCtx.fillStyle = '#333333'
  thumbCtx.beginPath()
  thumbCtx.roundRect(195, 58, 6, 22, 3)
  thumbCtx.fill()
  thumbCtx.beginPath()
  thumbCtx.roundRect(239, 58, 6, 22, 3)
  thumbCtx.fill()

  // 标题
  thumbCtx.fillStyle = '#ffffff'
  thumbCtx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  thumbCtx.textAlign = 'center'
  thumbCtx.fillText('Sendol', 220, 160)

  // 副标题
  thumbCtx.fillStyle = '#888888'
  thumbCtx.font = '14px -apple-system, sans-serif'
  thumbCtx.fillText('AI Broadcast', 220, 185)

  // 保存缩略图
  const thumbBuffer = thumbCanvas.toBuffer('image/png')
  writeFileSync(path.join(assetsDir, 'store-thumbnail-440x280.png'), thumbBuffer)
  console.log('  ✓ assets/store-thumbnail-440x280.png')

  console.log('\n✅ 商店图片生成完成!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
