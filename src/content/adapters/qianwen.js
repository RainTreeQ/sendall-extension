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
    findInput: async () => await findInputForPlatform('qianwen') || waitFor(() => findInputHeuristically()),
    inject: qianwenInject,
    send: qianwenSend
  };
}
