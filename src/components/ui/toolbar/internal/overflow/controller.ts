import { DEFAULTS, RETURN_COOLDOWN_MS } from "./constants";
import { recalc } from "./engine/overflow-core";
import type { Axis } from "./engine/overflow-types";
import type { LayoutObserverApi } from "./lib/observe";
import {
  allMeasured,
  availMainPx,
  buildInputState,
  collect,
  computePreMinCross,
  reserveFromMore,
} from "./measure";
import { createScheduler } from "./scheduler";

export type ControllerConfig = {
  safetyPx?: number;
  hysteresisPx?: number;
  debounceMs?: number;
};

export function createOverflowController(
  observer: LayoutObserverApi,
  cfg: ControllerConfig = {},
) {
  const safetyPx = cfg.safetyPx ?? DEFAULTS.safetyPx;
  const hysteresisPx = cfg.hysteresisPx ?? DEFAULTS.hysteresisPx;
  const debounceMs = cfg.debounceMs ?? DEFAULTS.debounceMs;

  let host: HTMLElement | null = null;
  let more: HTMLElement | null = null;
  let hiddenIds: string[] = [];
  let ready = false;
  let preMinCross = DEFAULTS.preMinFallback;

  let inProgress = false;
  let lastChangeAt = 0;
  let hostUnsub: null | (() => void) = null;
  let moreUnsub: null | (() => void) = null;

  const scheduler = createScheduler(debounceMs);

  let onHiddenChange: (ids: string[]) => void = () => {};
  let onReadyOnce: () => void = () => {};
  let onPreMinCross: (n: number) => void = () => {};

  function setHost(el: HTMLElement | null) {
    if (hostUnsub) {
      hostUnsub();
      hostUnsub = null;
    }

    host = el;
    if (!host) return;

    const unResize = observer.observeResize(host, requestRecalc);
    const unMut = observer.observeMutations(host, requestRecalc);
    hostUnsub = () => {
      unResize();
      unMut();
    };
  }

  function setMore(el: HTMLElement | null) {
    more?.removeAttribute;
    if (moreUnsub) {
      moreUnsub();
      moreUnsub = null;
    }
    more = el;
    if (el) moreUnsub = observer.observeResize(el, requestRecalc);
    requestRecalc();
  }

  function markReadyOnce() {
    if (ready) return;
    ready = true;
    onReadyOnce();
  }

  function requestRecalc() {
    scheduler.schedule(recalcOnce);
  }

  function recalcOnce() {
    if (inProgress) return;
    inProgress = true;

    try {
      if (!host) return;

      const axis = (host.dataset.axis as Axis) ?? "row";
      const { units, more: moreEl } = collect(host);

      if (!allMeasured(units, axis)) return; // waiting data-w/h
      const reserve = reserveFromMore(moreEl, axis, observer);
      const avail = availMainPx(host, axis);

      const cross = computePreMinCross(axis, units, moreEl, observer);
      preMinCross = Math.max(DEFAULTS.preMinFallback, Math.round(cross));
      onPreMinCross(preMinCross);

      const input = buildInputState(
        axis,
        safetyPx,
        hysteresisPx,
        avail,
        hiddenIds,
        units,
        reserve,
      );
      const out = recalc(input);
      const now = performance?.now?.() ?? Date.now();
      const isReturn = out.hiddenStack.length < hiddenIds.length;
      const cooldownOk = now - lastChangeAt > RETURN_COOLDOWN_MS;

      if (isReturn && !cooldownOk) {
        scheduler.schedule(recalcOnce);
        return;
      }

      if (!arraysEqual(out.hiddenStack, hiddenIds)) {
        hiddenIds = out.hiddenStack;
        lastChangeAt = now;
        onHiddenChange(hiddenIds);
      } else {
        markReadyOnce();
      }
    } finally {
      inProgress = false;
    }
  }

  return {
    attach(
      onHidden: (ids: string[]) => void,
      onReady: () => void,
      onCross: (px: number) => void,
    ) {
      onHiddenChange = onHidden;
      onReadyOnce = onReady;
      onPreMinCross = onCross;
    },
    setHost,
    setMore,
    requestRecalc,
    getState() {
      return {
        hiddenIds,
        ready,
        preMinCross,
        safetyPx,
        hysteresisPx,
        debounceMs,
      };
    },
    destroy() {
      scheduler.cancel();
      if (hostUnsub) {
        hostUnsub();
        hostUnsub = null;
      }
      if (moreUnsub) {
        moreUnsub();
        moreUnsub = null;
      }
    },
  };
}

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
