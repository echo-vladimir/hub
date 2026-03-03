import type { ReactNode } from "react";

export const SIDES = ["top", "bottom", "left", "right"] as const;
export type Side = (typeof SIDES)[number];
export const AXES = ["row", "col"] as const;
export type Axis = (typeof AXES)[number];
export const WRAPS = ["wrap", "scroll", "collapse"] as const;
export type Wrap = (typeof WRAPS)[number];
export const MODES = ["flow", "docked", "floating"] as const;
export type Mode = (typeof MODES)[number];

export type ToolbarRootProps = {
  /**
   * Content of the toolbar. Expected to contain <Toolbar.Group> and its items.
   */
  children: ReactNode;

  /**
   * Additional classes for the outermost wrapper.
   */
  className?: string;

  /**
   * Layout mode:
   * - flow - participates in normal document flow (no fixed positioning).
   * - docked - fixed to a viewport edge and stretched on the main axis.
   * - floating - fixed and centered (top/bottom horizontally, left/right vertically).
   */
  mode?: Mode;

  /**
   * Toolbar attachment side (for docked/floating only).
   * - top - sticks to top edge
   * - bottom - sticks to bottom edge
   * - left - sticks to left edge
   * - right - sticks to right edge
   */
  side?: Side;

  /**
   * Overflow strategy:
   * - wrap - allows wrapping via CSS (flex-wrap), no "More" collapsing.
   * - collapse - uses overflow engine and renders hidden items into <Toolbar.More>.
   */
  wrap?: Wrap;

  /**
   * Main axis of layout.
   * Default:
   * - top/bottom - row
   * - left/right - col
   */
  axis?: Axis;
};
