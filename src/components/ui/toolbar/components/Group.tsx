"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { useToolbar } from "../context/toolbar-context";
import { useOverlay } from "../internal/dropdown";
import { useToolbarOverflow } from "../internal/overflow/context/overflow-context";
import type { Side } from "../types";
import { More } from "./items/More";

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const JUSTIFY: Record<Align, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "justify-between",
};

const SELF: Record<Align, string> = {
  start: "self-start",
  center: "self-center",
  end: "self-end",
  stretch: "self-stretch",
};

type PanelLayout = {
  axis: "rows" | "cols";
  closed: string;
  open: string;
  panelFirst: boolean;
};

export const PANEL_LAYOUT: Record<Side, PanelLayout> = {
  right: {
    axis: "cols",
    closed: "grid-cols-[auto_0fr]",
    open: "grid-cols-[auto_fit-content(var(--panel-w,360px))]",
    panelFirst: false,
  },
  left: {
    axis: "cols",
    closed: "grid-cols-[0fr_auto]",
    open: "grid-cols-[fit-content(var(--panel-w,360px))_auto]",
    panelFirst: true,
  },
  bottom: {
    axis: "rows",
    closed: "grid-rows-[auto_0fr]",
    open: "grid-rows-[auto_fit-content(var(--panel-h,320px))]",
    panelFirst: false,
  },
  top: {
    axis: "rows",
    closed: "grid-rows-[0fr_auto]",
    open: "grid-rows-[fit-content(var(--panel-h,320px))_auto]",
    panelFirst: true,
  },
};

function getChromeInset(direction: Side, bleed: number): React.CSSProperties {
  return {
    top: direction === "top" ? 0 : -bleed,
    right: direction === "right" ? 0 : -bleed,
    bottom: direction === "bottom" ? 0 : -bleed,
    left: direction === "left" ? 0 : -bleed,
  };
}

type Basis = "content" | "auto" | "full";
type Align = "start" | "center" | "end" | "stretch";

export type GroupProps = {
  children: React.ReactNode;
  className?: string;
  basis?: Basis;
  grow?: boolean;
  align?: Align;
};

export function Group({ children, className, align = "start" }: GroupProps) {
  const { mode, axis, side, wrap, scope } = useToolbar();
  const { active } = useOverlay();

  const isPanel = active?.variant === "panel";
  const expanded = active?.scope === scope && isPanel;
  const bleed = mode === "floating" && expanded ? 10 : 0;

  const direction = OPPOSITE_SIDE[side];
  const layout = PANEL_LAYOUT[direction];

  return (
    <div
      data-mode={mode}
      data-axis={axis}
      data-side={side}
      data-expanded={expanded ? "true" : "false"}
      className={cn(
        "relative grid",
        layout.axis === "rows" ? (expanded ? layout.open : layout.closed) : "",
        layout.axis === "cols" ? (expanded ? layout.open : layout.closed) : "",

        "will-change-auto",
        "transition-[grid-template-rows,grid-template-columns,opacity] duration-200 ease-out",

        // Flow
        "data-[mode=flow]:px-0 data-[mode=flow]:py-0",

        // Floating
        "data-[mode=floating]:data-[axis=row]:mx-auto",
        "data-[mode=floating]:data-[axis=col]:my-auto",
        "data-[mode=floating]:m-6 data-[mode=floating]:py-2 data-[mode=floating]:px-2.5",

        // Docked
        "data-[mode=docked]:justify-center data-[mode=docked]:items-center mx-auto",
        "data-[mode=docked]:data-[axis=row]:w-full data-[mode=docked]:data-[axis=col]:h-full",
        "data-[mode=docked]:px-2 data-[mode=docked]:py-2",

        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-0 pointer-events-none",
          "transition-[top,right,bottom,left,transform,box-shadow,backdrop-filter,opacity] duration-200 ease-out",

          // Shared for floating/docked
          mode !== "flow" && "border border-black/5 shadow-sm",
          mode !== "flow" && "bg-white/70",
          mode !== "flow" && expanded
            ? "backdrop-blur-3xl shadow-xl bg-white/90"
            : "backdrop-blur-md bg-radial from-transparent to-white",

          mode === "floating" && "rounded-4xl px-2 py-2",
          mode === "docked" && "px-2 py-2",
        )}
        style={getChromeInset(direction, bleed)}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 opacity-10 mix-blend-overlay bg-[url(/noise.webp)]",
            mode !== "flow" && "rounded-4xl",
          )}
        />
      </div>

      {layout.panelFirst && (
        <PanelSlot
          id={active?.id}
          expanded={expanded}
          direction={direction}
          panelFirst={layout.panelFirst}
        />
      )}

      <div
        data-axis={axis}
        data-mode={mode}
        className={cn(
          "relative z-10 inline-flex",
          "data-[axis=col]:flex-col",
          "data-[axis=row]:items-center",
          JUSTIFY[align],
          SELF[align],
        )}
      >
        {children}
        {wrap === "collapse" && <More />}
      </div>

      {!layout.panelFirst && (
        <PanelSlot
          id={active?.id}
          expanded={expanded}
          direction={direction}
          panelFirst={layout.panelFirst}
        />
      )}
    </div>
  );
}

type PanelSlotProps = {
  id?: string;
  expanded: boolean;
  direction: Side;
  panelFirst: boolean;
};

function PanelSlot({ id, expanded, direction, panelFirst }: PanelSlotProps) {
  const { getSlot } = useToolbarOverflow();
  const entry = id ? getSlot(id, "content") : null;

  const panel = expanded ? (entry?.render?.() ?? null) : null;
  const isCols = direction === "left" || direction === "right";

  const { scope } = useToolbar();
  const { getFloatingBindings } = useOverlay();
  const floating = id ? getFloatingBindings({ scope, id }) : null;

  const Sep = (
    <div
      aria-hidden="true"
      className={cn(
        "bg-neutral-200",
        isCols ? "w-px self-stretch mx-2" : "h-px w-full my-2",
      )}
    />
  );

  return (
    <div
      className={cn("z-10", isCols ? "flex items-stretch" : "flex flex-col")}
    >
      {expanded && !panelFirst ? Sep : null}

      <div
        ref={floating?.setFloating}
        {...(floating ? floating.getFloatingProps() : {})}
        data-direction={direction}
        className={cn(
          "min-w-0 min-h-0 overflow-hidden",
          "transition-[opacity,padding] duration-200 ease-out",
          expanded ? "opacity-100 px-2 py-2" : "opacity-0 px-0 py-0",
          expanded ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            isCols ? "w-max" : "w-full",
            !isCols && "contain-[inline-size]",
          )}
        >
          {panel}
        </div>
      </div>

      {expanded && panelFirst ? Sep : null}
    </div>
  );
}
