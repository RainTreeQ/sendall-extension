export function createClaudeAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    setContentEditable,
    findSendBtnForPlatform,
    findSendBtnHeuristically,
    pressEnterOn,
    sleep,
    normalizeText,
    getContent
  } = deps;

  return {
    name: 'Claude',
    findInput: async () => {
      return await findInputForPlatform('claude') || waitFor(() => findInputHeuristically());
    },
    inject: (el, text, options) => setContentEditable(el, text, options),
    async send(el, options) {
      const logger = options?.logger;
      const before = normalizeText(getContent(el));
      
      // 查找发送按钮
      const btn = await findSendBtnForPlatform('claude') || await waitFor(() => findSendBtnHeuristically(el) || (() => {
        const candidates = [
          ...[...document.querySelectorAll('fieldset button, form button')]
        ].filter(Boolean);
        for (const candidate of candidates) {
          if (candidate.disabled) continue;
          const label = (candidate.getAttribute('aria-label') || '').toLowerCase();
          if (label.includes('attach') || label.includes('file') || label.includes('upload')) continue;
          if (candidate.querySelector('svg')) return candidate;
        }
        return null;
      })(), 4000, 40);
      
      // 尝试按钮点击
      if (btn) {
        logger?.debug?.('claude-send-clicking-btn');
        btn.click();
        await sleep(400);
        
        // 验证内容是否被清除
        const after = normalizeText(getContent(el));
        if (!before || after !== before) {
          logger?.debug?.('claude-send-success-via-click');
          return true;
        }
        logger?.debug?.('claude-send-click-no-change');
      }
      
      // Fallback: 使用 Enter 键
      const input = el || document.activeElement;
      if (input) {
        logger?.debug?.('claude-send-fallback-to-enter');
        input.focus();
        pressEnterOn(input);
        await sleep(400);
        
        const after = normalizeText(getContent(el));
        if (!before || after !== before) {
          logger?.debug?.('claude-send-success-via-enter');
          return true;
        }
      }
      
      logger?.debug?.('claude-send-failed');
      return false;
    }
  };
}
