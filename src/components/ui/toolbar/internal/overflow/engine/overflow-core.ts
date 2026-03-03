import type { InputState, OutputState } from "./overflow-types";

export function recalc(input: InputState): OutputState {
  const { host, itemsOrder, items, more } = input;
  const reserve = more.enabled ? more.reservePx : 0;
  const avail = Math.max(0, host.availMain - reserve - host.safetyPx);

  const order = itemsOrder.map((id) => items[id]).filter(Boolean);
  const hiddenSet = new Set(input.hiddenStack);
  const visible = order.filter((it) => !hiddenSet.has(it.id));
  let used = visible.reduce((s, it) => s + it.sizeMain, 0);

  // return LIFO
  const nextHidden = [...input.hiddenStack];
  while (nextHidden.length > 0) {
    const id = nextHidden[nextHidden.length - 1];
    const it = items[id];
    if (!it || !it.collapsible) {
      nextHidden.pop();
      hiddenSet.delete(id);
      continue;
    }
    const free = avail - used;
    if (free >= it.sizeMain + host.hysteresisPx) {
      nextHidden.pop();
      hiddenSet.delete(id);
      used += it.sizeMain;
      visible.push(it);
    } else break;
  }

  if (host.strategy === "collapse") {
    for (let i = visible.length - 1; i >= 0 && used > avail; i--) {
      const it = visible[i];
      if (!it.collapsible) continue;
      nextHidden.push(it.id);
      hiddenSet.add(it.id);
      used -= it.sizeMain;
      visible.splice(i, 1);
    }
  } else if (host.strategy === "scroll") {
    const total = order.reduce((s, it) => s + it.sizeMain, 0);
    return {
      hiddenStack: input.hiddenStack,
      hiddenSet: new Set(input.hiddenStack),
      more: { ...more, visible: false, count: 0 },
      usedMain: Math.min(total, avail),
      scroll: { needed: total > avail, maxScroll: Math.max(0, total - avail) },
    };
  } else if (host.strategy === "wrap") {
    // ---
  }

  const count = nextHidden.length;
  const showMore = more.enabled && count > 0;

  return {
    hiddenStack: nextHidden,
    hiddenSet,
    more: { ...more, visible: showMore, count },
    usedMain: used,
  };
}
