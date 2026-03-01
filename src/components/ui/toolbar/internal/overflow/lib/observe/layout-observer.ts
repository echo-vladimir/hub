export type Unsub = () => void;
export type LayoutObserverApi = ReturnType<typeof createLayoutObserver>;

type Callback = () => void;

class NoopRO {
  observe(_el: Element) {}
  unobserve(_el: Element) {}
  disconnect() {}
}
class NoopMO {
  observe(_root: Element, _opts?: MutationObserverInit) {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

const isClient = typeof window !== "undefined";

export function createLayoutObserver(opts?: { debug?: boolean }) {
  const debug = !!opts?.debug;

  // SSR-safe
  const resizeObs =
    isClient && "ResizeObserver" in window
      ? new window.ResizeObserver(onResize)
      : new NoopRO();

  const mutationObs =
    isClient && "MutationObserver" in window
      ? new window.MutationObserver(onMutation)
      : new NoopMO();

  const resizeCbs = new Map<Callback, number>();
  const mutateCbs = new Map<Callback, number>();

  const resizeRef = new WeakMap<Element, number>();
  const mutateRef = new WeakMap<Element, number>();
  const mutationRoots = new Map<Element, MutationObserverInit>();

  // batching
  let rafId = 0;
  let dirty = false;

  function log(...a: unknown[]) {
    if (debug && isClient) console.log("[layout]", ...a);
  }

  function addCallbackRef(store: Map<Callback, number>, cb: Callback) {
    store.set(cb, (store.get(cb) ?? 0) + 1);
  }

  function removeCallbackRef(store: Map<Callback, number>, cb: Callback) {
    const next = (store.get(cb) ?? 1) - 1;
    if (next <= 0) {
      store.delete(cb);
      return;
    }
    store.set(cb, next);
  }

  function scheduleFrame() {
    if (!isClient) return;
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      if (!dirty) return;
      dirty = false;
      if (debug) log("run rAF");
      for (const cb of resizeCbs.keys()) cb();
      for (const cb of mutateCbs.keys()) cb();
    });
    if (debug) log("scheduled rAF");
  }

  function onResize(_entries: ResizeObserverEntry[]) {
    dirty = true;
    scheduleFrame();
  }
  function onMutation(_entries: MutationRecord[]) {
    dirty = true;
    scheduleFrame();
  }

  return {
    observeResize(el: Element, cb: Callback): Unsub {
      const n = (resizeRef.get(el) ?? 0) + 1;
      if (n === 1) resizeObs.observe(el);
      resizeRef.set(el, n);

      addCallbackRef(resizeCbs, cb);
      dirty = true;
      scheduleFrame();

      return () => {
        removeCallbackRef(resizeCbs, cb);
        const cur = (resizeRef.get(el) ?? 1) - 1;
        if (cur <= 0) {
          resizeRef.delete(el);
          resizeObs.unobserve?.(el);
        } else {
          resizeRef.set(el, cur);
        }
      };
    },

    observeMutations(
      root: Element,
      cb: Callback,
      opts: MutationObserverInit = {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: [
          "data-w",
          "data-h",
          "data-id",
          "data-more-reserve",
          "hidden",
          "class",
          "style",
        ],
      },
    ): Unsub {
      const n = (mutateRef.get(root) ?? 0) + 1;
      if (n === 1) {
        mutationRoots.set(root, opts);
        mutationObs.observe(root, opts);
      }
      mutateRef.set(root, n);

      addCallbackRef(mutateCbs, cb);
      dirty = true;
      scheduleFrame();

      return () => {
        removeCallbackRef(mutateCbs, cb);
        const cur = (mutateRef.get(root) ?? 1) - 1;
        if (cur <= 0) {
          mutateRef.delete(root);
          mutationRoots.delete(root);
          mutationObs.disconnect();
          for (const [el, nextOpts] of mutationRoots) {
            mutationObs.observe(el, nextOpts);
          }
        } else {
          mutateRef.set(root, cur);
        }
      };
    },

    measureMarginBox(el: Element) {
      if (!isClient) return { w: 0, h: 0 };
      const node = el as HTMLElement;
      const r = node.getBoundingClientRect();
      const cs = getComputedStyle(node);
      const w = Math.round(
        r.width +
          parseFloat(cs.marginLeft || "0") +
          parseFloat(cs.marginRight || "0"),
      );
      const h = Math.round(
        r.height +
          parseFloat(cs.marginTop || "0") +
          parseFloat(cs.marginBottom || "0"),
      );
      return { w, h };
    },

    armFontsReady() {
      function hasFonts(
        doc: Document,
      ): doc is Document & { fonts: FontFaceSet } {
        return "fonts" in doc;
      }
      if (isClient && hasFonts(document)) {
        document.fonts.ready.then(() => {
          dirty = true;
          scheduleFrame();
        });
      }
    },
  };
}
