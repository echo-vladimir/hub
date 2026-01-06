"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type OverlayVariant = "popover" | "panel";
export type OverlayId = { scope: string; id: string };
export type OverlayKey = OverlayId & { variant: OverlayVariant };
export type ActiveOverlay = OverlayKey | null;

export type FloatingBindings = {
  setFloating: (node: HTMLDivElement | null) => void;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLDivElement>,
  ) => React.HTMLProps<HTMLDivElement>;
  setReference: (node: HTMLDivElement | null) => void;
  getReferenceProps: (
    userProps?: React.HTMLProps<HTMLDivElement>,
  ) => React.HTMLProps<HTMLDivElement>;
};

type OverlayContextValue = {
  active: ActiveOverlay;
  setActive: Dispatch<SetStateAction<ActiveOverlay>>;

  setUserVariant: (key: OverlayId, variant: OverlayVariant) => void;
  clearUserVariant: (key: OverlayId) => void;
  getUserVariant: (key: OverlayId) => OverlayVariant | null;

  registerFloatingBindings: (
    key: OverlayId,
    bindings: FloatingBindings,
  ) => void;
  unregisterFloatingBindings: (key: OverlayId) => void;
  getFloatingBindings: (key: OverlayId) => FloatingBindings | null;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

const keyOf = ({ scope, id }: OverlayId) => `${scope}::${id}`;

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveOverlay>(null);

  const userVariantsRef = useRef(new Map<string, OverlayVariant>());

  const setUserVariant = useCallback(
    (key: OverlayId, variant: OverlayVariant) => {
      userVariantsRef.current.set(keyOf(key), variant);
    },
    [],
  );

  const clearUserVariant = useCallback((key: OverlayId) => {
    userVariantsRef.current.delete(keyOf(key));
  }, []);

  const getUserVariant = useCallback((key: OverlayId) => {
    return userVariantsRef.current.get(keyOf(key)) ?? null;
  }, []);

  // ---

  const floatingRef = useRef(new Map<string, FloatingBindings>());

  const registerFloatingBindings = useCallback(
    (key: OverlayId, bindings: FloatingBindings) => {
      floatingRef.current.set(keyOf(key), bindings);
    },
    [],
  );

  const unregisterFloatingBindings = useCallback((key: OverlayId) => {
    floatingRef.current.delete(keyOf(key));
  }, []);

  const getFloatingBindings = useCallback((key: OverlayId) => {
    return floatingRef.current.get(keyOf(key)) ?? null;
  }, []);

  const value = useMemo<OverlayContextValue>(
    () => ({
      active,
      setActive,

      setUserVariant,
      clearUserVariant,
      getUserVariant,

      registerFloatingBindings,
      unregisterFloatingBindings,
      getFloatingBindings,
    }),
    [
      active,
      setUserVariant,
      clearUserVariant,
      getUserVariant,
      registerFloatingBindings,
      unregisterFloatingBindings,
      getFloatingBindings,
    ],
  );

  return (
    <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>
  );
}

export function useOverlay() {
  const v = useContext(OverlayContext);
  if (!v) throw new Error("useOverlay must be used inside OverlayProvider");
  return v;
}
