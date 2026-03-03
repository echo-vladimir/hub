import { EPS, SEL_MORE, SEL_UNIT } from "./constants";
import type { Axis, InputState } from "./engine/overflow-types";
import type { LayoutObserverApi } from "./lib/observe";

export type Collected = {
  units: HTMLElement[];
  more: HTMLElement | null;
};

export function collect(host: HTMLElement): Collected {
  const all = Array.from(host.querySelectorAll<HTMLElement>(SEL_UNIT));
  const more = host.querySelector<HTMLElement>(SEL_MORE);
  const units = more ? all.filter((el) => el !== more) : all;
  return { units, more: more ?? null };
}

export function allMeasured(units: HTMLElement[], axis: Axis): boolean {
  return units.every((el) => {
    const raw = axis === "row" ? el.dataset.w : el.dataset.h;
    const n = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(n) && n > 0;
  });
}

export function reserveFromMore(
  more: HTMLElement | null,
  axis: Axis,
  observer: LayoutObserverApi,
): number {
  if (!more) return 0;
  if (more.dataset.moreReserve) return parseFloat(more.dataset.moreReserve);
  const box = observer.measureMarginBox(more);
  return axis === "row" ? box.w : box.h;
}

export function availMainPx(host: HTMLElement, axis: Axis) {
  const base = axis === "row" ? host.clientWidth : host.clientHeight;
  return base - EPS;
}

export function buildInputState(
  axis: Axis,
  safetyPx: number,
  hysteresisPx: number,
  availMain: number,
  hiddenIds: string[],
  units: HTMLElement[],
  reserve: number,
): InputState {
  const itemsOrder = units.map((el) => el.dataset.id!).filter(Boolean);
  const items: InputState["items"] = {};
  for (const el of units) {
    const id = el.dataset.id!;
    if (!id) continue;
    const raw = axis === "row" ? el.dataset.w! : el.dataset.h!;
    const size = Math.round(parseFloat(raw));
    items[id] = {
      id,
      collapsible: el.dataset.collapsible !== "0",
      sizeMain: size,
      fallback: {
        label: el.dataset.fallbackLabel,
        href: el.dataset.fallbackHref,
      },
    };
  }
  return {
    host: { axis, strategy: "collapse", safetyPx, hysteresisPx, availMain },
    itemsOrder,
    items,
    hiddenStack: hiddenIds,
    more: { enabled: true, reservePx: reserve, visible: false, count: 0 },
  };
}

export function computePreMinCross(
  axis: Axis,
  units: HTMLElement[],
  more: HTMLElement | null,
  observer: LayoutObserverApi,
): number {
  const crossItems = Math.max(
    0,
    ...units.map((el) => {
      const raw = axis === "row" ? el.dataset.h : el.dataset.w;
      const n = raw ? parseFloat(raw) : 0;
      return Math.max(0, n);
    }),
  );
  const moreBox = more ? observer.measureMarginBox(more) : { w: 0, h: 0 };
  const crossMore = axis === "row" ? moreBox.h : moreBox.w;
  return Math.max(crossItems, crossMore);
}
