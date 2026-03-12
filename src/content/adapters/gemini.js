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
      await sleep(80);
      const before = normalizeText(getContent(el));

      const keySend = async () => {
        const target = el || document.activeElement;
        if (!target) return false;

        target.focus();
        pressEnterOn(target);
        await sleep(220);
        let after = normalizeText(getContent(target));
        if (!before || after !== before) return true;

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
        after = normalizeText(getContent(target));
        if (!before || after !== before) return true;

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
        after = normalizeText(getContent(target));
        return !before || after !== before;
      };

      const directBtn = await findSendBtnForPlatform('gemini');
      const btn = directBtn || await waitFor(() => {
        const container = el?.closest('rich-textarea')?.parentElement?.parentElement
          || el?.closest('.input-area-container')
          || el?.closest('[role="complementary"]')?.parentElement;
        if (container) {
          for (const b of container.querySelectorAll('button:not([disabled])')) {
            const hint = `${b.getAttribute('aria-label') || ''} ${b.getAttribute('mattooltip') || ''} ${b.getAttribute('title') || ''}`.toLowerCase();
            if (hint.includes('send') || hint.includes('submit') || hint.includes('发送') || hint.includes('提交')) return b;
          }
        }
        return null;
      }, 6500, 50);

      if (btn) {
        btn.click();
        if (!before) return true;
        await sleep(220);
        const afterClick = normalizeText(getContent(el));
        if (afterClick !== before) return true;
        logger?.debug('gemini-send-click-no-change');
      } else {
        logger?.debug('gemini-send-button-not-found', { hasInput: Boolean(el) });
      }

      const keySendOk = await keySend();
      if (keySendOk) return true;

      logger?.debug('gemini-send-failed-after-key-fallback');
      return false;
    }
  };
}
