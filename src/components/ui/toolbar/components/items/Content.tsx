"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  useToolbarItemDropdown,
  useToolbarItemId,
} from "../../context/item-context";
import { useToolbar } from "../../context/toolbar-context";
import {
  Dropdown,
  type OverlayVariant,
  useOverlay,
} from "../../internal/dropdown";
import { useToolbarOverflow } from "../../internal/overflow/context/overflow-context";

export function Content({
  children,
  variant = "panel",
}: {
  children: ReactNode;
  variant?: OverlayVariant;
}) {
  const { scope } = useToolbar();
  const { registerSlot, unregisterSlot } = useToolbarOverflow();
  const { setUserVariant, clearUserVariant } = useOverlay();
  const id = useToolbarItemId();

  const nodeRef = useRef<ReactNode>(children);
  nodeRef.current = children;

  useLayoutEffect(() => {
    registerSlot(id, "content", { render: () => nodeRef.current });
    setUserVariant({ scope, id }, variant);
    return () => {
      unregisterSlot(id, "content");
      clearUserVariant({ scope, id });
    };
  }, [
    scope,
    id,
    variant,
    registerSlot,
    unregisterSlot,
    setUserVariant,
    clearUserVariant,
  ]);

  // "panel" is rendered by <Group> (PanelSlot) to enable resize/layout/overflow
  if (variant === "panel") return null;

  return <PopoverSlot>{children}</PopoverSlot>;
}

export function PopoverSlot({ children }: { children: React.ReactNode }) {
  const dd = useToolbarItemDropdown();

  return (
    <Dropdown
      dd={dd}
      className={cn(
        "min-w-60 rounded-xl border border-black/5 bg-white/95 p-1 shadow-lg backdrop-blur-2xl",
      )}
    >
      {children}
    </Dropdown>
  );
}
