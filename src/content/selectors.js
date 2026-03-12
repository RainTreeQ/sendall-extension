export const defaultSelectors = {
  chatgpt: {
    findInput: [
      '#prompt-textarea',
      'div[contenteditable="true"][data-lexical-editor]',
      'div[contenteditable="true"][role="textbox"]'
    ],
    findSendBtn: [
      '[data-testid="send-button"]',
      'button[aria-label="Send prompt"]',
      'button[aria-label="Send message"]',
      'button[aria-label*="Send"]'
    ]
  },
  claude: {
    findInput: [
      'div.ProseMirror[contenteditable="true"]',
      '[data-testid="chat-input"] div[contenteditable]',
      'fieldset div[contenteditable="true"]',
      'div[contenteditable="true"]'
    ],
    findSendBtn: [
      'button[aria-label="Send Message"]',
      'button[aria-label*="Send"]'
    ]
  },
  gemini: {
    findInput: [
      '.ql-editor[contenteditable="true"]',
      'rich-textarea .ql-editor',
      'div[contenteditable="true"][role="textbox"]',
      'p[data-placeholder]'
    ],
    findSendBtn: [
      'button[aria-label="Send message"]',
      'button[aria-label="Send"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="提交"]',
      'button[aria-label="Submit"]',
      'button[aria-label*="Submit"]',
      'button.send-button',
      'button[data-test-id="send-button"]',
      'button[data-testid*="send"]',
      'button[mattooltip="Send message"]',
      'button[mattooltip="Send"]',
      'button[mattooltip*="Submit"]',
      'button[jsname="Qx7uuf"]'
    ]
  },
  grok: {
    findInput: [
      'textarea[aria-label*="ask" i]',
      'textarea[aria-label*="grok" i]',
      'textarea[placeholder]',
      'textarea',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]'
    ],
    findSendBtn: [
      'button[type="submit"]:not([disabled])',
      'button[aria-label="Submit"]:not([disabled])',
      'button[aria-label*="Submit"]:not([disabled])',
      'button[aria-label*="Send"]:not([disabled])',
      'button[data-testid*="send"]:not([disabled])',
      '[role="button"][aria-label*="Send"]:not([aria-disabled="true"])',
      '[role="button"][aria-label*="Submit"]:not([aria-disabled="true"])',
      '[data-testid*="send"]',
      '[data-testid*="submit"]'
    ]
  },
  deepseek: {
    findInput: [
      'div#chat-input[contenteditable="true"]',
      'div[id*="chat-input"][contenteditable="true"]',
      'textarea#chat-input',
      'textarea[id*="chat-input"]',
      'div[contenteditable="true"][data-placeholder]',
      'textarea[placeholder*="Ask"]',
      'div[contenteditable="true"][role="textbox"]',
      'textarea'
    ],
    findSendBtn: [
      'button[type="submit"]',
      '[aria-label*="send" i]',
      '[aria-label*="Send"]',
      'button[data-testid*="send"]'
    ]
  },
  doubao: {
    findInput: [
      'textarea[placeholder]',
      'div[contenteditable="true"]',
      'textarea'
    ],
    findSendBtn: [
      'button[type="submit"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="Send"]',
      'button[data-testid*="send"]'
    ]
  },
  qianwen: {
    findInput: [
      'div[data-slate-editor="true"][contenteditable="true"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]',
      'textarea[placeholder]',
      'textarea'
    ],
    findSendBtn: []
  },
  yuanbao: {
    findInput: [
      '.ql-editor[contenteditable="true"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]',
      'textarea'
    ],
    findSendBtn: []
  },
  kimi: {
    findInput: [
      'div.chat-input-editor[contenteditable="true"]',
      'div[class*="chat-input-editor"][contenteditable="true"]',
      'textarea[placeholder]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]',
      'textarea'
    ],
    findSendBtn: [
      'div.send-button-container:not(.disabled)',
      'div[class*="send-button-container"]:not(.disabled)',
      'button[type="submit"]',
      'button[aria-label*="发送"]',
      'button[aria-label*="Send"]'
    ]
  }
};

let cachedSelectors = null;

export async function getDynamicSelectors() {
  if (cachedSelectors) return cachedSelectors;
  try {
    const data = await chrome.storage.local.get('aib_dynamic_selectors');
    cachedSelectors = data.aib_dynamic_selectors || defaultSelectors;
  } catch (err) {
    cachedSelectors = defaultSelectors;
  }
  return cachedSelectors;
}

export function findBySelectors(selectors) {
  for (const selector of selectors) {
    const found = document.querySelector(selector);
    if (found) return found;
  }
  return null;
}
