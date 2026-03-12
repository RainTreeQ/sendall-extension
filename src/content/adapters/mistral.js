export function createMistralAdapter(deps) {
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
    name: 'Mistral',
    findInput: async () => await findInputForPlatform('mistral') || waitFor(() => findInputHeuristically()),
    inject: async (el, text, options) => {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return setReactValue(el, text);
      return setContentEditable(el, text, options);
    },
    async send(el) {
      const btn = await findSendBtnForPlatform('mistral') || await waitFor(() => findSendBtnHeuristically(el), 4000, 40);
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
