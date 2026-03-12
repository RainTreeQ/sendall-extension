export function createChatgptAdapter(deps) {
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
    name: 'ChatGPT',
    findInput: async () => {
      return await findInputForPlatform('chatgpt') || waitFor(() => findInputHeuristically());
    },
    async inject(el, text, options) {
      if (el.tagName === 'TEXTAREA') return setReactValue(el, text);
      return setContentEditable(el, text, options);
    },
    async send(el) {
      const btn = await findSendBtnForPlatform('chatgpt') || await waitFor(() => findSendBtnHeuristically(el), 4000, 40);
      if (btn) {
        btn.click();
        return;
      }
      const target = el || document.activeElement;
      if (target) {
        target.focus();
        pressEnterOn(target);
      } else {
        pressEnterOn(null);
      }
    }
  };
}
