export function createQianwenAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    qianwenInject,
    qianwenSend
  } = deps;

  return {
    name: 'Qianwen',
    findInput: async () => {
      const directTextarea = document.querySelector('textarea.message-input-textarea, textarea[placeholder], textarea');
      if (directTextarea) {
        return directTextarea;
      }
      const bySelectors = await findInputForPlatform('qianwen');
      if (bySelectors) return bySelectors;
      return waitFor(() => findInputHeuristically());
    },
    inject: qianwenInject,
    send: qianwenSend
  };
}
