"use client";

import {
  type ReactNode,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import {
  ToolbarItemDropdownProvider,
  ToolbarItemIdentityProvider,
  ToolbarItemTriggerProvider,
} from "../context/item-context";
import { useToolbar } from "../context/toolbar-context";
import {
  type FloatingBindings,
  useDropdown,
  useOverlay,
} from "../internal/dropdown";
import { useToolbarOverflow } from "../internal/overflow/context/overflow-context";

type ItemProps = {
  id?: string;
  collapsible?: boolean;
  className?: string;
  children: ReactNode;
  fallbackLabel?: string;
  fallbackHref?: string;
};

export function Item({
  id: idProp,
  collapsible = true,
  className,
  children,
  fallbackLabel,
  fallbackHref,
}: ItemProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  const nodeRef = useRef<HTMLDivElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  const { hiddenItemSet, requestRecalc, isReady } = useToolbarOverflow();

  const measureOnce = useCallback(() => {
    const n = nodeRef.current;
    if (!n) return;

    const r = n.getBoundingClientRect();
    const cs = getComputedStyle(n);

    const w = Math.round(
      r.width +
        parseFloat(cs.marginLeft || "0") +
        parseFloat(cs.marginRight || "0"),
    );
    const h = Math.round(
      r.height +
        parseFloat(cs.marginTop || "0") +
        parseFloat(cs.marginBottom || "0"),
    );

    if (w > 0) n.dataset.w = String(w);
    if (h > 0) n.dataset.h = String(h);

    n.dataset.collapsible = collapsible ? "1" : "0";
    if (fallbackLabel) n.dataset.fallbackLabel = fallbackLabel;
    if (fallbackHref) n.dataset.fallbackHref = fallbackHref;

    requestRecalc();
  }, [collapsible, fallbackLabel, fallbackHref, requestRecalc]);

  const setNode = useCallback(
    (el: HTMLDivElement | null) => {
      roRef.current?.disconnect();
      roRef.current = null;

      nodeRef.current = el;
      if (!el) return;

      requestAnimationFrame(measureOnce);

      roRef.current = new ResizeObserver(() =>
        requestAnimationFrame(measureOnce),
      );
      roRef.current.observe(el);
    },
    [measureOnce],
  );

  const { registerFloatingBindings, unregisterFloatingBindings } = useOverlay();
  const { mode, scope } = useToolbar();
  const dd = useDropdown({
    id,
    scope,
    placement: "bottom-end",
    modal: true,
    strategy: mode === "flow" ? "absolute" : "fixed",
    trackScroll: mode === "flow",
  });

  const bindingsRef = useRef<FloatingBindings>({
    setFloating: () => {},
    getFloatingProps: (userProps) => userProps ?? {},
    setReference: () => {},
    getReferenceProps: (userProps) => userProps ?? {},
  });

  bindingsRef.current = {
    setFloating: dd.refs.setFloating,
    getFloatingProps: dd.getFloatingProps,
    setReference: dd.refs.setReference,
    getReferenceProps: dd.getReferenceProps,
  };

  const floatingBindings = useMemo<FloatingBindings>(
    () => ({
      setFloating: (node) => bindingsRef.current.setFloating(node),
      getFloatingProps: (userProps) =>
        bindingsRef.current.getFloatingProps(userProps),
      setReference: (node) => bindingsRef.current.setReference(node),
      getReferenceProps: (userProps) =>
        bindingsRef.current.getReferenceProps(userProps),
    }),
    [],
  );

  useLayoutEffect(() => {
    registerFloatingBindings({ scope, id }, floatingBindings);

    return () => unregisterFloatingBindings({ scope, id });
  }, [
    scope,
    id,
    registerFloatingBindings,
    unregisterFloatingBindings,
    floatingBindings,
  ]);

  const hiddenByAlgo = hiddenItemSet.has(id);
  const identityValue = useMemo(() => ({ id }), [id]);
  const triggerValue = useMemo(
    () => ({
      isOpen: dd.isOpen,
      setReference: dd.refs.setReference,
      getReferenceProps: dd.getReferenceProps,
    }),
    [dd.isOpen, dd.refs.setReference, dd.getReferenceProps],
  );
  const dropdownValue = useMemo(
    () => ({
      isOpen: dd.isOpen,
      isPopover: dd.isPopover,
      setIsOpen: dd.setIsOpen,
      refs: dd.refs,
      floatingStyles: dd.floatingStyles,
      context: dd.context,
      modal: dd.modal,
      lockScroll: dd.lockScroll,
      getReferenceProps: dd.getReferenceProps,
      getFloatingProps: dd.getFloatingProps,
    }),
    [
      dd.isOpen,
      dd.isPopover,
      dd.setIsOpen,
      dd.refs,
      dd.floatingStyles,
      dd.context,
      dd.modal,
      dd.lockScroll,
      dd.getReferenceProps,
      dd.getFloatingProps,
    ],
  );

  return (
    <ToolbarItemIdentityProvider value={identityValue}>
      <ToolbarItemTriggerProvider value={triggerValue}>
        <ToolbarItemDropdownProvider value={dropdownValue}>
          <div
            ref={setNode}
            data-id={id}
            data-toolbar-item="1"
            className={cn(
              "inline-flex whitespace-nowrap",
              !isReady &&
                "absolute -left-2500 -top-2500 invisible pointer-events-none",
              isReady && hiddenByAlgo && "hidden",
              className,
            )}
            aria-hidden={!isReady || hiddenByAlgo || undefined}
          >
            {children}
          </div>
        </ToolbarItemDropdownProvider>
      </ToolbarItemTriggerProvider>
    </ToolbarItemIdentityProvider>
  );
}
