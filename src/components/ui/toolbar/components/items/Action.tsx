"use client";

import { Fragment, type ReactNode, useEffect, useRef } from "react";
import { useToolbarItemId } from "../../context/item-context";
import { useToolbarOverflow } from "../../internal/overflow/context/overflow-context";

export type ToolbarActionProps = {
  children: ReactNode;
  className?: string;
};

export function Action({ children }: ToolbarActionProps) {
  const { registerSlot, unregisterSlot } = useToolbarOverflow();
  const id = useToolbarItemId();

  const nodeRef = useRef<ReactNode>(children);
  nodeRef.current = children;

  useEffect(() => {
    registerSlot(id, "action", {
      render: () => <Fragment key={id}>{nodeRef.current}</Fragment>,
    });

    return () => unregisterSlot(id, "action");
  }, [id, registerSlot, unregisterSlot]);

  return <Fragment key={id}>{children}</Fragment>;
}
