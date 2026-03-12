export function createDeepseekAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    setReactValue,
    setContentEditable,
    findSendBtnForPlatform,
    findSendBtnHeuristically,
    pressEnterOn
  } = deps;

  return {
    name: 'DeepSeek',
    findInput: async () => await findInputForPlatform('deepseek') || waitFor(() => findInputHeuristically()),
    inject: async (el, text, options) => {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return setReactValue(el, text);
      return setContentEditable(el, text, options);
    },
    async send(el) {
      const selectorBtn = await findSendBtnForPlatform('deepseek');
      const btn = selectorBtn || await waitFor(() => findSendBtnHeuristically(el), 3000, 40);
      if (btn) {
        btn.click();
        return;
      }
      if (el) {
        el.focus();
        pressEnterOn(el);
      }
    }
  };
}
