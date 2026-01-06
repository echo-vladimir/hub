"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useId } from "react";
import type { Axis, Mode, Side, Wrap } from "../types";

export type ToolbarRootContextValue = {
  axis: Axis;
  mode: Mode;
  wrap: Wrap;
  side: Side;
  scope: string;
};

export const ToolbarRootContext = createContext<ToolbarRootContextValue | null>(
  null,
);

export function ToolbarRootProvider({
  value,
  children,
  scope: scopeProp,
}: {
  value: Omit<ToolbarRootContextValue, "scope">;
  scope?: string;
  children: ReactNode;
}) {
  const autoScope = useId();
  const scope = scopeProp ?? autoScope;

  return (
    <ToolbarRootContext.Provider value={{ ...value, scope }}>
      {children}
    </ToolbarRootContext.Provider>
  );
}

export function useToolbar() {
  const ctx = useContext(ToolbarRootContext);
  if (!ctx)
    throw new Error(
      "ToolbarRootContext is missing. Use this hook inside <Toolbar>.",
    );
  return ctx;
}
