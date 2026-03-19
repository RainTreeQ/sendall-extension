import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Code Quality', () => {
  test('Should not contain hardcoded hex/rgb colors in pages', async () => {
    const pagesDir = path.resolve(__dirname, '../../app/src/pages');
    const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') && f !== 'DesignSystem.jsx');
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
      
      // Look for #RGB, #RRGGBB, rgb(), rgba()
      const hasHex = /#[0-9a-fA-F]{3,8}\b/.test(content);
      const hasRgb = /rgb[a]?\(/.test(content);
      
      expect(hasHex, `File ${file} contains hardcoded hex colors`).toBe(false);
      expect(hasRgb, `File ${file} contains hardcoded rgb colors`).toBe(false);
    }
  });

  test('Should not contain backdrop-blur or 0 0 Npx shadows', async () => {
    const pagesDir = path.resolve(__dirname, '../../app/src/pages');
    const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') && f !== 'DesignSystem.jsx');
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
      
      const hasBackdropBlur = /backdrop-blur/.test(content);
      // Look for shadows like '0 0 10px', '0 0 5px', etc.
      const hasDiffusionShadow = /shadow-\[0_0_/.test(content);
      
      expect(hasBackdropBlur, `File ${file} contains backdrop-blur`).toBe(false);
      expect(hasDiffusionShadow, `File ${file} contains diffusion shadows (0 0 Npx)`).toBe(false);
    }
  });
});