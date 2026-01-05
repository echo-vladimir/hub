export type Axis = "row" | "col";
export type Strategy = "collapse" | "wrap" | "scroll";

export type ItemId = string;
export type Item = {
  id: ItemId;
  collapsible: boolean;
  sizeMain: number;
  minSizeMain?: number;
  fallback?: { label?: string; href?: string };
  priority?: number;
};

export type More = {
  enabled: boolean;
  reservePx: number;
  visible: boolean;
  count: number;
};

export type Host = {
  axis: Axis;
  strategy: Strategy;
  safetyPx: number;
  hysteresisPx: number;
  availMain: number;
};

export type InputState = {
  host: Host;
  itemsOrder: ItemId[];
  items: Record<ItemId, Item>;
  hiddenStack: ItemId[];
  more: More;
};

export type OutputState = {
  hiddenStack: ItemId[];
  hiddenSet: Set<ItemId>;
  more: More;
  usedMain: number;
  scroll?: { needed: boolean; maxScroll: number };
};
