export function createClaudeAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    setContentEditable,
    findSendBtnForPlatform,
    findSendBtnHeuristically,
    pressEnterOn
  } = deps;

  return {
    name: 'Claude',
    findInput: async () => {
      return await findInputForPlatform('claude') || waitFor(() => findInputHeuristically());
    },
    inject: (el, text, options) => setContentEditable(el, text, options),
    async send(el) {
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
      if (btn) {
        btn.click();
        return;
      }
      const input = el || document.activeElement;
      if (input) {
        input.focus();
        pressEnterOn(input);
      }
    }
  };
}
