(function initAibShared(scope) {
  if (!scope || scope.__AIB_SHARED__) return;

  const MESSAGE_TYPES = Object.freeze({
    GET_AI_TABS: 'GET_AI_TABS',
    BROADCAST_MESSAGE: 'BROADCAST_MESSAGE',
    LOCATE_UPLOAD_ENTRIES: 'LOCATE_UPLOAD_ENTRIES',
    BROADCAST_PROGRESS: 'BROADCAST_PROGRESS',
    PING: 'PING',
    INJECT_MESSAGE: 'INJECT_MESSAGE',
    SEND_NOW: 'SEND_NOW',
    HIGHLIGHT_UPLOAD_ENTRY: 'HIGHLIGHT_UPLOAD_ENTRY',
  });

  const PLATFORM_DEFINITIONS = Object.freeze([
    Object.freeze({
      id: 'chatgpt',
      name: 'ChatGPT',
      domains: Object.freeze(['chatgpt.com', 'chat.openai.com']),
      newChatUrl: 'https://chatgpt.com/',
    }),
    Object.freeze({
      id: 'claude',
      name: 'Claude',
      domains: Object.freeze(['claude.ai']),
      newChatUrl: 'https://claude.ai/new',
    }),
    Object.freeze({
      id: 'gemini',
      name: 'Gemini',
      domains: Object.freeze(['gemini.google.com']),
      newChatUrl: 'https://gemini.google.com/app',
    }),
    Object.freeze({
      id: 'grok',
      name: 'Grok',
      domains: Object.freeze(['grok.com']),
      newChatUrl: 'https://grok.com/',
    }),
    Object.freeze({
      id: 'deepseek',
      name: 'DeepSeek',
      domains: Object.freeze(['deepseek.com']),
      newChatUrl: 'https://chat.deepseek.com/',
    }),
    Object.freeze({
      id: 'mistral',
      name: 'Mistral',
      domains: Object.freeze(['chat.mistral.ai']),
      newChatUrl: null,
    }),
    Object.freeze({
      id: 'doubao',
      name: 'Doubao',
      domains: Object.freeze(['doubao.com']),
      newChatUrl: 'https://www.doubao.com/chat',
    }),
    Object.freeze({
      id: 'qianwen',
      name: 'Qianwen',
      domains: Object.freeze(['tongyi.aliyun.com', 'qianwen.com']),
      newChatUrl: 'https://www.qianwen.com/',
    }),
    Object.freeze({
      id: 'yuanbao',
      name: 'Yuanbao',
      domains: Object.freeze(['yuanbao.tencent.com']),
      newChatUrl: 'https://yuanbao.tencent.com/chat',
    }),
    Object.freeze({
      id: 'kimi',
      name: 'Kimi',
      domains: Object.freeze(['moonshot.cn', 'kimi.ai', 'kimi.com']),
      newChatUrl: 'https://www.kimi.com/',
    }),
  ]);

  const PLATFORM_BY_ID = Object.create(null);
  const PLATFORM_BY_NAME = Object.create(null);
  for (const platform of PLATFORM_DEFINITIONS) {
    PLATFORM_BY_ID[platform.id] = platform;
    PLATFORM_BY_NAME[platform.name] = platform;
  }

  function normalizeHostname(raw) {
    const input = String(raw || '').trim().toLowerCase();
    if (!input) return '';
    return input.replace(/^www\./, '');
  }

  function hostnameMatches(normalizedHostname, domain) {
    if (!normalizedHostname || !domain) return false;
    return normalizedHostname === domain || normalizedHostname.endsWith(`.${domain}`);
  }

  function getPlatformByHostname(hostname) {
    const normalized = normalizeHostname(hostname);
    if (!normalized) return null;
    for (const platform of PLATFORM_DEFINITIONS) {
      for (const domain of platform.domains) {
        if (hostnameMatches(normalized, domain)) {
          return platform;
        }
      }
    }
    return null;
  }

  function getPlatformByUrl(url) {
    try {
      const parsed = new URL(url);
      return getPlatformByHostname(parsed.hostname);
    } catch {
      return null;
    }
  }

  function getPlatformByName(name) {
    return PLATFORM_BY_NAME[String(name || '')] || null;
  }

  function getPlatformById(id) {
    return PLATFORM_BY_ID[String(id || '')] || null;
  }

  const sharedApi = Object.freeze({
    MESSAGE_TYPES,
    PLATFORM_DEFINITIONS,
    getPlatformByHostname,
    getPlatformByUrl,
    getPlatformByName,
    getPlatformById,
  });

  scope.__AIB_SHARED__ = sharedApi;
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : (typeof self !== 'undefined' ? self : window)
);
