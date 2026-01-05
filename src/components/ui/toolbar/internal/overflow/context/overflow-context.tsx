"use client";

import { createContext, type ReactNode, useContext } from "react";

export type Slot = "link" | "trigger" | "content";

export type SlotRenderer = {
  render: () => ReactNode;
};

export type SlotRegistry = Partial<Record<Slot, SlotRenderer>>;

export type ToolbarOverflowContextValue = {
  isReady: boolean;
  hiddenItemIds: string[];
  hiddenItemSet: Set<string>;

  setHost: (el: HTMLElement | null) => void;
  setMore: (el: HTMLElement | null) => void;
  requestRecalc: () => void;

  registerSlot: (id: string, slot: Slot, renderer: SlotRenderer) => void;
  unregisterSlot: (id: string, slot: Slot) => void;
  getSlot: (id: string, slot: Slot) => SlotRenderer | undefined;
};

export const ToolbarOverflowContext =
  createContext<ToolbarOverflowContextValue | null>(null);

export function useToolbarOverflow() {
  const v = useContext(ToolbarOverflowContext);
  if (!v)
    throw new Error(
      "useToolbarOverflow must be used inside ToolbarOverflowProvider",
    );
  return v;
}
