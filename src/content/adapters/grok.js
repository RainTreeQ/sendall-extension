export function createGrokAdapter(deps) {
  const {
    findInputForPlatform,
    waitFor,
    setReactValue,
    setContentEditable,
    findSendBtnForPlatform,
    normalizeText,
    getContent,
    sleep,
    pressEnterOn,
    isNodeDisabled
  } = deps;

  return {
    name: 'Grok',
    findInput: async () => {
      const isVisibleInput = (el) => {
        if (!el || el.disabled || el.readOnly) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 120 && rect.height > 20 && rect.bottom > 0;
      };

      const collectRoots = () => {
        const roots = [document];
        const queue = [document.documentElement];
        const seen = new Set();
        while (queue.length) {
          const node = queue.shift();
          if (!node || seen.has(node)) continue;
          seen.add(node);
          if (node.shadowRoot) roots.push(node.shadowRoot);
          if (node.children) {
            for (const child of node.children) queue.push(child);
          }
        }
        return roots;
      };

      const pickBestInput = () => {
        const candidates = [];
        for (const root of collectRoots()) {
          candidates.push(...root.querySelectorAll('textarea[placeholder], textarea, div[contenteditable="true"][role="textbox"], div[contenteditable="true"]'));
        }

        const unique = [];
        const seen = new Set();
        for (const c of candidates) {
          if (!c || seen.has(c)) continue;
          seen.add(c);
          unique.push(c);
        }

        const scoreInput = (el) => {
          if (!isVisibleInput(el)) return -1;
          const rect = el.getBoundingClientRect();
          const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();
          const root = el.closest('form') || el.parentElement || document;
          let score = 0;
          if (placeholder.includes('ask') || placeholder.includes('mind') || placeholder.includes('message')) score += 6;
          if (el.closest('form')) score += 4;
          if (root.querySelector?.('button[type="submit"], button[aria-label*="Submit"], button[aria-label*="Send"], button[data-testid*="send"], [role="button"][aria-label*="Send"], [data-testid*="send"]')) score += 4;
          if (rect.top > 40 && rect.top < window.innerHeight) score += 2;
          score += Math.min(4, Math.round(rect.width / 300));
          return score;
        };

        let best = null;
        let bestScore = -1;
        for (const candidate of unique) {
          const score = scoreInput(candidate);
          if (score > bestScore) {
            bestScore = score;
            best = candidate;
          }
        }
        return bestScore >= 0 ? best : null;
      };

      const bySelectors = await findInputForPlatform('grok');
      if (isVisibleInput(bySelectors)) return bySelectors;
      return waitFor(() => pickBestInput(), 7000, 60);
    },
    async inject(el, text, options) {
      if (el.tagName === 'TEXTAREA') return setReactValue(el, text);
      return setContentEditable(el, text, options);
    },
    async send(el, options) {
      const logger = options?.logger;
      const sendTrace = {
        matchedBy: 'none',
        clicked: false,
        formSubmitted: false,
        keyAttempts: [],
        finalChanged: false
      };
      const isVisible = (node) => {
        if (!node) return false;
        const style = window.getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0;
      };

      const triggerClick = (node) => {
        if (!node) return;
        for (const evt of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
          try {
            node.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, composed: true }));
          } catch (err) {}
        }
        try { node.click?.(); } catch (err) {}
      };

      const roots = () => {
        const list = [
          el?.closest('form'),
          el?.parentElement,
          el?.closest('div[class*="input"]'),
          el?.closest('main'),
          document
        ].filter(Boolean);
        const uniq = [];
        const seen = new Set();
        for (const root of list) {
          if (seen.has(root)) continue;
          seen.add(root);
          uniq.push(root);
        }
        return uniq;
      };

      const tryFindBtn = () => {
        const inputRect = el?.getBoundingClientRect ? el.getBoundingClientRect() : null;
        for (const root of roots()) {
          const buttons = root.querySelectorAll
            ? root.querySelectorAll('button, [role="button"], div[role="button"], span[role="button"], div[class*="send"], button[class*="send"]')
            : [];
          let fallbackCandidate = null;
          let proximityCandidate = null;
          let proximityScore = -Infinity;
          for (const button of buttons) {
            if (!isVisible(button) || isNodeDisabled(button)) continue;
            const hint = `${button.getAttribute('aria-label') || ''} ${button.getAttribute('title') || ''} ${button.getAttribute('data-testid') || ''} ${button.className || ''} ${(button.textContent || '').trim()}`.toLowerCase();
            if (hint.includes('upload') || hint.includes('attach') || hint.includes('mic') || hint.includes('voice') || hint.includes('search') || hint.includes('plus')) continue;
            if (hint.includes('submit') || hint.includes('send') || hint.includes('发送') || hint.includes('提交')) {
              sendTrace.matchedBy = 'hint:sendish';
              return button;
            }
            if (!fallbackCandidate && (hint.includes('composer') || hint.includes('arrow') || hint.includes('paper-plane'))) {
              fallbackCandidate = button;
            }

            if (!inputRect || !button.getBoundingClientRect) continue;
            const r = button.getBoundingClientRect();
            const centerX = r.left + r.width / 2;
            const centerY = r.top + r.height / 2;
            const dx = centerX - (inputRect.left + inputRect.width);
            const dy = centerY - (inputRect.top + inputRect.height / 2);
            const nearHorizontally = dx >= -24 && dx <= 240;
            const nearVertically = Math.abs(dy) <= 140;
            if (!nearHorizontally || !nearVertically) continue;

            let score = 0;
            score -= Math.abs(dx) * 0.45;
            score -= Math.abs(dy) * 0.25;
            if (r.width >= 20 && r.width <= 72 && r.height >= 20 && r.height <= 72) score += 12;
            if (button.querySelector?.('svg')) score += 8;
            if ((button.textContent || '').trim().length === 0) score += 6;
            if ((button.getAttribute('aria-label') || '').trim()) score += 4;
            if (score > proximityScore) {
              proximityScore = score;
              proximityCandidate = button;
            }
          }
          if (fallbackCandidate) {
            sendTrace.matchedBy = 'hint:fallback-candidate';
            return fallbackCandidate;
          }
          if (proximityCandidate) {
            sendTrace.matchedBy = 'proximity';
            return proximityCandidate;
          }
        }

        const localScope = el?.closest('form') || el?.closest('[class*="composer"]') || el?.closest('[class*="input"]') || el?.parentElement?.parentElement || null;
        if (localScope && inputRect) {
          const nodes = localScope.querySelectorAll('*');
          let best = null;
          let bestScore = -Infinity;
          for (const node of nodes) {
            if (!isVisible(node) || isNodeDisabled(node)) continue;
            if (node === el || node.contains?.(el)) continue;
            const r = node.getBoundingClientRect();
            if (r.width < 16 || r.height < 16 || r.width > 84 || r.height > 84) continue;
            const centerX = r.left + r.width / 2;
            const centerY = r.top + r.height / 2;
            const dx = centerX - (inputRect.left + inputRect.width);
            const dy = centerY - (inputRect.top + inputRect.height / 2);
            if (dx < -30 || dx > 260 || Math.abs(dy) > 150) continue;
            const hasSvg = Boolean(node.querySelector?.('svg,path,use'));
            const hint = `${node.getAttribute?.('aria-label') || ''} ${node.getAttribute?.('data-testid') || ''} ${node.className || ''}`.toLowerCase();
            if (!hasSvg && !hint.includes('send') && !hint.includes('submit') && !hint.includes('arrow')) continue;
            let score = 0;
            score -= Math.abs(dx) * 0.4;
            score -= Math.abs(dy) * 0.3;
            if (hasSvg) score += 14;
            if (hint.includes('send') || hint.includes('submit') || hint.includes('arrow')) score += 10;
            if (score > bestScore) {
              bestScore = score;
              best = node;
            }
          }
          if (best) {
            sendTrace.matchedBy = 'scope:svg-proximity';
            return best;
          }
        }
        return null;
      };

      const selectorBtn = await findSendBtnForPlatform('grok');
      const btn = selectorBtn || await waitFor(tryFindBtn, 3500, 40);
      const target = el || document.activeElement;
      const before = normalizeText(getContent(target));

      const tryKeySend = async () => {
        if (!target) return false;
        target.focus();
        const attempts = [
          { ctrlKey: false, metaKey: false, tag: 'enter' },
          { ctrlKey: true, metaKey: false, tag: 'ctrl-enter' },
          { ctrlKey: false, metaKey: true, tag: 'meta-enter' }
        ];
        for (const attempt of attempts) {
          target.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            composed: true,
            ctrlKey: attempt.ctrlKey,
            metaKey: attempt.metaKey
          }));
          target.dispatchEvent(new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            composed: true,
            ctrlKey: attempt.ctrlKey,
            metaKey: attempt.metaKey
          }));
          target.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
            composed: true,
            ctrlKey: attempt.ctrlKey,
            metaKey: attempt.metaKey
          }));
          await sleep(180);
          const after = normalizeText(getContent(target));
          sendTrace.keyAttempts.push(attempt.tag);
          if (!before || after !== before) {
            sendTrace.finalChanged = true;
            return true;
          }
          logger?.debug('grok-send-key-no-change', { mode: attempt.tag });
        }
        return false;
      };

      const tryFormSubmit = async () => {
        const form = target?.closest?.('form');
        if (!form) return false;
        try {
          if (typeof form.requestSubmit === 'function') form.requestSubmit();
          else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        } catch (err) {}
        sendTrace.formSubmitted = true;
        await sleep(220);
        const after = normalizeText(getContent(target));
        const changed = !before || after !== before;
        if (changed) sendTrace.finalChanged = true;
        return changed;
      };

      if (btn) {
        triggerClick(btn);
        sendTrace.clicked = true;
        await sleep(220);
        const afterClick = normalizeText(getContent(target));
        if (!before || afterClick !== before) {
          sendTrace.finalChanged = true;
          return true;
        }
        logger?.debug('grok-send-click-no-change');
        const formSubmitOk = await tryFormSubmit();
        if (formSubmitOk) return true;
        const keySendOk = await tryKeySend();
        if (keySendOk) return true;
        throw new Error(`Grok发送未执行 matched=${sendTrace.matchedBy} clicked=${sendTrace.clicked} form=${sendTrace.formSubmitted} keys=${sendTrace.keyAttempts.join(',') || 'none'}`);
      }

      if (!target) {
        pressEnterOn(null);
        return false;
      }
      const keySendOk = await tryKeySend();
      if (keySendOk) return true;
      pressEnterOn(target);
      await sleep(180);
      const after = normalizeText(getContent(target));
      const changed = !before || after !== before;
      if (changed) {
        sendTrace.finalChanged = true;
        return true;
      }
      throw new Error(`Grok发送未执行 matched=${sendTrace.matchedBy} clicked=${sendTrace.clicked} form=${sendTrace.formSubmitted} keys=${sendTrace.keyAttempts.join(',') || 'none'}`);
    }
  };
}
