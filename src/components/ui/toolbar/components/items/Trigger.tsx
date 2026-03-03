"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  useToolbarItemId,
  useToolbarItemTrigger,
} from "../../context/item-context";
import { useToolbarOverflow } from "../../internal/overflow/context/overflow-context";

export function Trigger({
  children,
  className,
  activeClassName,
}: {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}) {
  const { registerSlot, unregisterSlot } = useToolbarOverflow();
  const id = useToolbarItemId();
  const { isOpen, setReference, getReferenceProps } = useToolbarItemTrigger();
  const active = isOpen;

  const nodeRef = useRef<ReactNode>(children);
  nodeRef.current = children;

  useEffect(() => {
    registerSlot(id, "trigger", { render: () => nodeRef.current });
    return () => unregisterSlot(id, "trigger");
  }, [id, registerSlot, unregisterSlot]);

  return (
    <button
      key={id}
      ref={setReference}
      {...getReferenceProps()}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "relative cursor-default",
        "group inline-flex items-center rounded-full px-3 py-2",
        "hover:bg-black/9 dark:hover:bg-white/10",
        "focus:outline-none focus-visible:ring-2 ring-black/10",
        active && activeClassName,
        className,
      )}
    >
      {children}
    </button>
  );
}
