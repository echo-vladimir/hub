"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { useDropdown } from "../internal/dropdown";

export type ToolbarDropdownApi = ReturnType<typeof useDropdown>;

export type ToolbarItemIdentityContextValue = {
  id: string;
};

export type ToolbarItemTriggerContextValue = {
  isOpen: boolean;
  setReference: ToolbarDropdownApi["refs"]["setReference"];
  getReferenceProps: ToolbarDropdownApi["getReferenceProps"];
};

export const ToolbarItemIdentityContext =
  createContext<ToolbarItemIdentityContextValue | null>(null);

export const ToolbarItemTriggerContext =
  createContext<ToolbarItemTriggerContextValue | null>(null);

export const ToolbarItemDropdownContext =
  createContext<ToolbarDropdownApi | null>(null);

export function ToolbarItemIdentityProvider({
  value,
  children,
}: {
  value: ToolbarItemIdentityContextValue;
  children: ReactNode;
}) {
  return (
    <ToolbarItemIdentityContext.Provider value={value}>
      {children}
    </ToolbarItemIdentityContext.Provider>
  );
}

export function ToolbarItemTriggerProvider({
  value,
  children,
}: {
  value: ToolbarItemTriggerContextValue;
  children: ReactNode;
}) {
  return (
    <ToolbarItemTriggerContext.Provider value={value}>
      {children}
    </ToolbarItemTriggerContext.Provider>
  );
}

export function ToolbarItemDropdownProvider({
  value,
  children,
}: {
  value: ToolbarDropdownApi;
  children: ReactNode;
}) {
  return (
    <ToolbarItemDropdownContext.Provider value={value}>
      {children}
    </ToolbarItemDropdownContext.Provider>
  );
}

export function useToolbarItemId() {
  const ctx = useContext(ToolbarItemIdentityContext);
  if (!ctx) {
    throw new Error(
      "ToolbarItemIdentityContext is missing. Use this hook inside <Toolbar.Item>.",
    );
  }
  return ctx.id;
}

export function useToolbarItemTrigger() {
  const ctx = useContext(ToolbarItemTriggerContext);
  if (!ctx) {
    throw new Error(
      "ToolbarItemTriggerContext is missing. Use this hook inside <Toolbar.Item>.",
    );
  }
  return ctx;
}

export function useToolbarItemDropdown() {
  const ctx = useContext(ToolbarItemDropdownContext);
  if (!ctx) {
    throw new Error(
      "ToolbarItemDropdownContext is missing. Use this hook inside <Toolbar.Item>.",
    );
  }
  return ctx;
}
