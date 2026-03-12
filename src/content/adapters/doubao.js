export function createDoubaoAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    setReactValue,
    setContentEditable,
    findSendBtnForPlatform,
    findSendBtnHeuristically,
    pressEnterOn,
    isDoubaoVerificationPage
  } = deps;

  return {
    name: 'Doubao',
    findInput: async () => {
      if (isDoubaoVerificationPage()) {
        const err = new Error('豆包当前处于人机验证页面，请先完成验证后再重试');
        err.stage = 'findInput';
        throw err;
      }
      return await findInputForPlatform('doubao') || waitFor(() => findInputHeuristically());
    },
    async inject(el, text, options) {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return setReactValue(el, text);
      return setContentEditable(el, text, options);
    },
    async send(el) {
      if (isDoubaoVerificationPage()) {
        const err = new Error('豆包当前处于人机验证页面，请先完成验证后再重试');
        err.stage = 'send';
        throw err;
      }
      const btn = await findSendBtnForPlatform('doubao') || await waitFor(() => findSendBtnHeuristically(el), 3000, 30);
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
