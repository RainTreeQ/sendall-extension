export function createGeminiAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    setGeminiInput,
    sleep,
    normalizeText,
    getContent,
    pressEnterOn,
    findSendBtnForPlatform
  } = deps;

  return {
    name: 'Gemini',
    findInput: async () => await findInputForPlatform('gemini') || waitFor(() => findInputHeuristically()),
    inject: (el, text, options) => setGeminiInput(el, text, options),
    async send(el, options) {
      const logger = options?.logger;
      const expected = normalizeText(options?.text || '');

      await sleep(80);
      const before = normalizeText(getContent(el));
      logger?.debug?.('gemini-send-start', { hasContent: before.length > 0, contentLen: before.length, expectedLen: expected.length });

      // 验证内容是否匹配预期（如果提供了预期文本）
      if (expected && before !== expected) {
        logger?.debug?.('gemini-send-content-mismatch', { before, expected });
      }

      const keySend = async () => {
        const target = el || document.activeElement;
        if (!target) return false;

        const beforeLen = normalizeText(getContent(target)).length;

        target.focus();
        pressEnterOn(target);
        await sleep(220);
        let afterLen = normalizeText(getContent(target)).length;
        // 发送成功：内容应该变短或被清空
        if (beforeLen > 0 && afterLen < beforeLen) return true;

        target.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
          composed: true,
          ctrlKey: true
        }));
        await sleep(220);
        afterLen = normalizeText(getContent(target)).length;
        if (beforeLen > 0 && afterLen < beforeLen) return true;

        target.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
          composed: true,
          metaKey: true
        }));
        await sleep(220);
        afterLen = normalizeText(getContent(target)).length;
        return beforeLen > 0 && afterLen < beforeLen;
      };

      // 1. 优先使用选择器和启发式查找
      let btn = await findSendBtnForPlatform('gemini');
      
      // 2. 尝试更广泛的语义属性查找
      if (!btn) {
        btn = await waitFor(() => {
          const selectors = [
            'button[aria-label="Send message"]',
            'button[aria-label="Send"]',
            'button[aria-label*="Send" i]',
            'button[aria-label*="发送"]',
            'button[aria-label*="提交"]',
            'button[aria-label="Submit"]',
            'button[data-testid*="send" i]',
            'button[data-test-id*="send" i]',
            'button[title*="Send" i]',
            'button[title*="发送"]',
            'button[mattooltip*="Send" i]',
            'button[mattooltip*="发送"]',
            'button.send-button',
            'button.submit-button',
            'button[type="submit"]',
            'button[jsname="Qx7uuf"]',
            'button[jsname*="send" i]',
            '[role="button"][aria-label*="Send" i]',
            '[role="button"][aria-label*="发送"]'
          ];
          for (const sel of selectors) {
            try {
              const found = document.querySelector(sel);
              if (found && !found.disabled && found.getAttribute('aria-disabled') !== 'true') {
                return found;
              }
            } catch (_) {}
          }
          return null;
        }, 2000, 50);
      }

      // 3. 在输入框附近查找发送按钮
      if (!btn) {
        btn = await waitFor(() => {
          const container = el?.closest('rich-textarea')?.parentElement?.parentElement
            || el?.closest('.input-area-container')
            || el?.closest('div[class*="input" i]')
            || el?.closest('[role="complementary"]')?.parentElement
            || el?.parentElement?.parentElement;
          if (container) {
            for (const b of container.querySelectorAll('button:not([disabled]), [role="button"]')) {
              if (b.disabled || b.getAttribute('aria-disabled') === 'true') continue;
              const hint = `${b.getAttribute('aria-label') || ''} ${b.getAttribute('mattooltip') || ''} ${b.getAttribute('title') || ''} ${b.className || ''}`.toLowerCase();
              if (hint.includes('send') || hint.includes('submit') || hint.includes('发送') || hint.includes('提交')) return b;
              // 检查是否包含发送图标（svg 或特定类名）
              if (b.querySelector('svg') && (hint.includes('send') || b.className?.toLowerCase().includes('send'))) return b;
            }
          }
          return null;
        }, 3000, 50);
      }

      logger?.debug?.('gemini-send-btn', { found: Boolean(btn), hasDirect: Boolean(await findSendBtnForPlatform('gemini')) });

      if (btn) {
        btn.click();
        await sleep(300);
        const afterClick = normalizeText(getContent(el));
        // 发送成功：内容应该变短或被清空
        if (before.length > 0 && afterClick.length < before.length) {
          logger?.debug?.('gemini-send-click-success', { beforeLen: before.length, afterLen: afterClick.length });
          return true;
        }
        // 如果原本就没有内容，检查是否发生了变化（不太可能，但保留兼容性）
        if (before.length === 0 && afterClick.length === 0) {
          // 可能是发送成功了，但无法验证，假设成功
          logger?.debug?.('gemini-send-click-assumed');
          return true;
        }
        logger?.debug?.('gemini-send-click-no-change', { beforeLen: before.length, afterLen: afterClick.length });
      } else {
        logger?.debug?.('gemini-send-btn-not-found');
      }

      const keySendOk = await keySend();
      logger?.debug?.('gemini-send-keyboard', { success: keySendOk });
      if (keySendOk) return true;

      logger?.debug?.('gemini-send-failed');
      return false;
    }
  };
}
