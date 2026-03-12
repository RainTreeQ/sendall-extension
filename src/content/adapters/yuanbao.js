export function createYuanbaoAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    yuanbaoInject,
    yuanbaoSend
  } = deps;

  return {
    name: 'Yuanbao',
    findInput: async () => await findInputForPlatform('yuanbao') || waitFor(() => findInputHeuristically()),
    inject: yuanbaoInject,
    send: yuanbaoSend
  };
}
