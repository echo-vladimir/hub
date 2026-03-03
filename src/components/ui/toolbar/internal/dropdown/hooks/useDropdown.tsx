"use client";

import {
  autoUpdate,
  flip,
  offset,
  type Placement,
  type ReferenceType,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useCallback } from "react";
import {
  type ActiveOverlay,
  type OverlayId,
  type OverlayVariant,
  useOverlay,
} from "../context/overlay-context";

type UseDropdownOptions = OverlayId & {
  placement?: Placement;
  modal?: boolean;
  lockScroll?: boolean;
  strategy?: "absolute" | "fixed";
  trackScroll?: boolean;
};

const isActive = (
  active: ActiveOverlay,
  key: OverlayId,
  variant?: OverlayVariant,
) =>
  !!active &&
  active.scope === key.scope &&
  active.id === key.id &&
  (variant ? active.variant === variant : true);

export function useDropdown({
  id,
  scope,
  placement = "bottom-start",
  modal = true,
  lockScroll,
  strategy = "absolute",
  trackScroll = true,
}: UseDropdownOptions) {
  const { active, setActive, getUserVariant } = useOverlay();

  const isOpen = isActive(active, { scope, id });
  const isPopover = isActive(active, { scope, id }, "popover");

  const setIsOpen = useCallback(
    (next: boolean) => {
      if (!next) {
        setActive(null);
        return;
      }
      const user = getUserVariant({ scope, id });
      setActive({
        ...{ scope, id },
        variant: user === "panel" ? "panel" : "popover",
      });
    },
    [setActive, getUserVariant, scope, id],
  );

  const whileElementsMounted = useCallback(
    (reference: ReferenceType, floating: HTMLElement, update: () => void) =>
      autoUpdate(reference, floating, update, {
        ancestorScroll: trackScroll,
        ancestorResize: true,
        elementResize: true,
        layoutShift: true,
      }),
    [trackScroll],
  );

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted,
    placement,
    strategy,
  });

  const hover = useHover(context, {
    move: false,
    restMs: 50,
    handleClose: safePolygon({ buffer: 8 }),
  });

  const click = useClick(context, {
    event: "mousedown",
    toggle: false,
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
    outsidePress: true,
    escapeKey: true,
  });

  const role = useRole(context, { role: "menu" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
    role,
  ]);

  return {
    isOpen,
    isPopover,
    setIsOpen,

    refs,
    floatingStyles,
    context,

    modal,
    lockScroll: lockScroll ?? modal,

    getReferenceProps,
    getFloatingProps,
  };
}
