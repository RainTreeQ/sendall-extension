// Sendol - MutationObserver helpers

export function waitForElementByMutation(matchFn, options = {}) {
  const timeout = Number.isFinite(options.timeout) ? options.timeout : 6000;
  const root = options.root || document.body || document.documentElement;

  return new Promise((resolve) => {
    try {
      const immediate = matchFn();
      if (immediate) {
        resolve(immediate);
        return;
      }
    } catch (_) {}

    let done = false;
    let observer = null;
    let timer = null;

    const finish = (value) => {
      if (done) return;
      done = true;
      if (timer) clearTimeout(timer);
      if (observer) observer.disconnect();
      resolve(value || null);
    };

    timer = setTimeout(() => finish(null), timeout);

    try {
      observer = new MutationObserver(() => {
        try {
          const next = matchFn();
          if (next) finish(next);
        } catch (_) {}
      });
      observer.observe(root, { childList: true, subtree: true });
    } catch (_) {
      finish(null);
    }
  });
}
