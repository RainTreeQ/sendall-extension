export function createKimiAdapter(deps) {
  const {
    findInputForPlatform,
    findInputHeuristically,
    waitFor,
    kimiInject,
    kimiSend
  } = deps;

  return {
    name: 'Kimi',
    findInput: async () => await findInputForPlatform('kimi') || waitFor(() => findInputHeuristically()),
    inject: kimiInject,
    send: kimiSend
  };
}
