"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { ToolbarRootProvider } from "../context/toolbar-context";
import { OverlayProvider } from "../internal/dropdown";
import { ToolbarOverflowProvider } from "../internal/overflow/context/overflow-provider";
import type { Axis, Side, ToolbarRootProps } from "../types";
import { RootContainer } from "./Root";

const POS_DOCKED: Record<Side, string> = {
  top: "fixed inset-x-0 top-0",
  bottom: "fixed inset-x-0 bottom-0",
  left: "fixed inset-y-0 left-0",
  right: "fixed inset-y-0 right-0",
};

const POS_FLOAT: Record<Side, string> = {
  top: "fixed top-0 left-1/2 -translate-x-1/2",
  bottom: "fixed bottom-0 left-1/2 -translate-x-1/2",
  left: "fixed left-0 top-1/2 -translate-y-1/2",
  right: "fixed right-0 top-1/2 -translate-y-1/2",
};

export function Toolbar({
  children,
  className,
  mode = "flow",
  side,
  wrap = "collapse",
  axis,
}: ToolbarRootProps) {
  const sideResolved: Side = side ?? "top";
  const axisResolved: Axis =
    axis ??
    (sideResolved === "left" || sideResolved === "right" ? "col" : "row");
  const horizontal = sideResolved === "top" || sideResolved === "bottom";

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <ToolbarRootProvider
      value={{ mode, side: sideResolved, wrap, axis: axisResolved }}
    >
      <ToolbarOverflowProvider>
        <OverlayProvider>
          <RootContainer axis={axisResolved} wrap={wrap}>
            {children}
          </RootContainer>
        </OverlayProvider>
      </ToolbarOverflowProvider>
    </ToolbarRootProvider>
  );

  if (mode === "flow") {
    return (
      <div className={className}>
        <Providers>{children}</Providers>
      </div>
    );
  }

  if (mode === "docked") {
    return (
      <div
        data-toolbar-docked
        data-side={sideResolved}
        className={cn(
          "pointer-events-none z-50",
          POS_DOCKED[sideResolved],
          className,
        )}
      >
        <div
          className={cn(
            "pointer-events-auto",
            horizontal ? "block w-full" : "block h-full",
          )}
        >
          <Providers>{children}</Providers>
        </div>
      </div>
    );
  }

  if (mode === "floating") {
    return (
      <div
        data-toolbar-floating
        data-side={sideResolved}
        className={cn(
          "pointer-events-none z-50",
          POS_FLOAT[sideResolved],
          className,
        )}
      >
        <div
          className={cn(
            "pointer-events-auto",
            horizontal
              ? "block w-screen max-w-[100vw] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
              : "block h-dvh max-h-dvh pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          )}
        >
          <Providers>{children}</Providers>
        </div>
      </div>
    );
  }

  return null;
}
