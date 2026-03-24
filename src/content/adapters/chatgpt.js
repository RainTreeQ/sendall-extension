export function createChatgptAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    setReactValue,
    setContentEditable,
    findSendBtnForPlatform,
    findSendBtnHeuristically,
    pressEnterOn,
    sleep,
    normalizeText,
    getContent
  } = deps;

  return {
    name: 'ChatGPT',
    findInput: async () => {
      return await findInputForPlatform('chatgpt') || waitFor(() => findInputHeuristically());
    },
    async inject(el, text, options) {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        setReactValue(el, text);
        return { strategy: 'chatgpt-react-value', fallbackUsed: false };
      }

      const isLexical = el.hasAttribute('data-lexical-editor') || el.closest('[data-lexical-editor]');
      if (isLexical) {
        el.focus();
        await sleep(30);
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
        await sleep(16);

        const dt = new DataTransfer();
        dt.setData('text/plain', text);
        el.dispatchEvent(new ClipboardEvent('paste', {
          clipboardData: dt,
          bubbles: true,
          cancelable: true,
          composed: true
        }));
        await sleep(100);
        const actual = normalizeText(getContent(el));
        const expected = normalizeText(text);
        // 改进验证：检查完整内容或至少90%匹配
        if (actual && (actual === expected || 
            actual.includes(expected) || 
            expected.includes(actual) ||
            (actual.length >= expected.length * 0.9 && actual.length <= expected.length * 1.1))) {
          return { strategy: 'chatgpt-lexical-paste', fallbackUsed: false };
        }

        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
        await sleep(8);
        document.execCommand('insertText', false, text);
        await sleep(100);
        const actual2 = normalizeText(getContent(el));
        // 改进验证：检查完整内容或至少90%匹配
        if (actual2 && (actual2 === expected || 
            actual2.includes(expected) || 
            expected.includes(actual2) ||
            (actual2.length >= expected.length * 0.9 && actual2.length <= expected.length * 1.1))) {
          return { strategy: 'chatgpt-lexical-insertText', fallbackUsed: true };
        }

        return { strategy: 'chatgpt-lexical-best-effort', fallbackUsed: true };
      }

      return setContentEditable(el, text, options);
    },
    async send(el, options) {
      const logger = options?.logger;
      const expected = normalizeText(options?.text || '');

      const before = normalizeText(getContent(el));
      logger?.debug?.('chatgpt-send-start', { hasContent: before.length > 0, contentLen: before.length, expectedLen: expected.length });

      const selectorCandidate = await findSendBtnForPlatform('chatgpt');
      const isReady = (b) => b && !b.disabled && b.getAttribute('aria-disabled') !== 'true';
      const btn = await waitFor(
        () => {
          const b = selectorCandidate || findSendBtnHeuristically(el);
          return isReady(b) ? b : null;
        },
        5000, 80
      );

      if (btn) {
        btn.click();
        await sleep(300);
        const after = normalizeText(getContent(el));
        // 发送成功：内容应该变短或被清空
        if (before.length > 0 && after.length < before.length) {
          logger?.debug?.('chatgpt-send-click-success', { beforeLen: before.length, afterLen: after.length });
          return true;
        }
        // 如果原本就没有内容，无法验证，假设成功
        if (before.length === 0 && after.length === 0) {
          logger?.debug?.('chatgpt-send-click-assumed');
          return true;
        }
        logger?.debug?.('chatgpt-send-click-no-change', { beforeLen: before.length, afterLen: after.length });
      } else {
        logger?.debug?.('chatgpt-send-btn-not-found');
      }

      // Fallback: 尝试键盘发送
      const target = el || document.activeElement;
      if (target) {
        target.focus();
        const beforeKey = normalizeText(getContent(target)).length;
        pressEnterOn(target);
        await sleep(300);
        const afterKey = normalizeText(getContent(target)).length;
        if (beforeKey > 0 && afterKey < beforeKey) {
          logger?.debug?.('chatgpt-send-keyboard-success', { beforeLen: beforeKey, afterLen: afterKey });
          return true;
        }
      } else {
        pressEnterOn(null);
        await sleep(300);
      }

      logger?.debug?.('chatgpt-send-failed');
      return false;
    }
  };
}
