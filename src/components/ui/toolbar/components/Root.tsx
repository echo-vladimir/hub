"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useToolbarOverflow } from "../internal/overflow/context/overflow-context";
import type { Axis, Wrap } from "../types";

export function RootContainer({
  children,
  axis,
  wrap,
}: {
  children: ReactNode;
  axis: Axis;
  wrap: Wrap;
}) {
  const { setHost, isReady } = useToolbarOverflow();

  const isRow = axis === "row";
  const wrapClass = wrap === "wrap" ? "flex-wrap" : "flex-nowrap";

  return (
    <div
      ref={setHost}
      data-toolbar-host="1"
      data-ready={isReady ? "1" : "0"}
      data-axis={axis}
      className={cn(
        isRow
          ? "flex w-full min-w-0 items-center gap-2"
          : "flex h-full min-h-0 flex-col items-center gap-2",
        wrapClass,
        "transition-opacity",
        isReady ? "opacity-100" : "opacity-0",
        "data-[mode=flow]:justify-start",
        "data-[mode=docked]:justify-start",
        "data-[mode=floating]:justify-center",
      )}
    >
      {children}
    </div>
  );
}
