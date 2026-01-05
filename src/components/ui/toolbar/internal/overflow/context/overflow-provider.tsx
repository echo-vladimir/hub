"use client";

import {
  type PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEFAULTS } from "../constants";
import { createOverflowController } from "../controller";
import { getLayoutObserver } from "../lib/observe";
import {
  type Slot,
  type SlotRegistry,
  type SlotRenderer,
  ToolbarOverflowContext,
  type ToolbarOverflowContextValue,
} from "./overflow-context";

export function ToolbarOverflowProvider({
  children,
  safetyPx = DEFAULTS.safetyPx,
  hysteresisPx = DEFAULTS.hysteresisPx,
  debounceMs = DEFAULTS.debounceMs,
}: PropsWithChildren<{
  safetyPx?: number;
  hysteresisPx?: number;
  debounceMs?: number;
}>) {
  const layoutObserver = useMemo(() => getLayoutObserver(), []);
  const controllerRef = useRef<ReturnType<
    typeof createOverflowController
  > | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = createOverflowController(layoutObserver, {
      safetyPx,
      hysteresisPx,
      debounceMs,
    });
  }
  const controller = controllerRef.current;

  const [hiddenItemIds, setHiddenItemIds] = useState<string[]>([]);
  const hiddenItemSet = useMemo(() => new Set(hiddenItemIds), [hiddenItemIds]);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    controller.attach(
      setHiddenItemIds,
      () => setIsReady(true),
      () => {},
    );
    return () => controller.destroy();
  }, [controller]);

  const registryRef = useRef(new Map<string, SlotRegistry>());
  const [, forceUpdate] = useState(0);

  const registerSlot = useCallback(
    (id: string, slot: Slot, renderer: SlotRenderer) => {
      const prev = registryRef.current.get(id) ?? {};
      registryRef.current.set(id, { ...prev, [slot]: renderer });
      forceUpdate((x) => x + 1);
    },
    [],
  );

  const unregisterSlot = useCallback((id: string, slot: Slot) => {
    const prev = registryRef.current.get(id);
    if (!prev || !prev[slot]) return;

    const next = { ...prev };
    delete next[slot];

    if (!next.link && !next.trigger && !next.content) {
      registryRef.current.delete(id);
    } else {
      registryRef.current.set(id, next);
    }
    forceUpdate((x) => x + 1);
  }, []);

  const getSlot = useCallback((id: string, slot: Slot) => {
    return registryRef.current.get(id)?.[slot];
  }, []);

  const value = useMemo<ToolbarOverflowContextValue>(
    () => ({
      setHost: (el) => {
        controller.setHost(el);
        if (el) controller.requestRecalc();
      },
      setMore: (el) => controller.setMore(el),
      requestRecalc: () => controller.requestRecalc(),

      isReady,
      hiddenItemIds,
      hiddenItemSet,

      registerSlot,
      unregisterSlot,
      getSlot,
    }),
    [
      controller,
      isReady,
      hiddenItemIds,
      hiddenItemSet,
      registerSlot,
      unregisterSlot,
      getSlot,
    ],
  );

  return (
    <ToolbarOverflowContext.Provider value={value}>
      {children}
    </ToolbarOverflowContext.Provider>
  );
}
