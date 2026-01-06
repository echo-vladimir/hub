"use client";

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { useDropdown } from "./hooks/useDropdown";
import useIsMobile from "./hooks/useIsMobile";

export function Dropdown({
  dd,
  children,
  className,
  variant = "auto",
  mobileBreakpoint = 640,
}: {
  dd: ReturnType<typeof useDropdown>;
  children: ReactNode;
  className?: string;
  variant?: "auto" | "dropdown" | "fullscreen";
  mobileBreakpoint?: number;
}) {
  const isMobile = useIsMobile(mobileBreakpoint);
  const mode =
    variant === "auto" ? (isMobile ? "fullscreen" : "dropdown") : variant;

  if (!dd.isOpen) return null;
  if (mode === "fullscreen") {
    return (
      <FloatingPortal>
        <FloatingOverlay
          lockScroll={dd.lockScroll}
          onClick={() => dd.setIsOpen(false)}
          style={{ zIndex: 40 }}
        />
        <FloatingFocusManager context={dd.context} modal>
          <div
            role="dialog"
            aria-modal="true"
            className={cn(
              "fixed inset-0 z-50 flex flex-col h-dvh",
              "bg-white/95 backdrop-blur-4xl dark:bg-neutral-900/90",
              "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
              className,
            )}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-3 dark:border-white/10">
              <div className="text-sm font-semibold">Menu</div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => dd.setIsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-2 overscroll-contain">
              {children}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  }

  // desktop
  return (
    <FloatingPortal>
      <FloatingOverlay
        onClick={() => dd.setIsOpen(false)}
        style={{ zIndex: 40 }}
      />

      <FloatingFocusManager context={dd.context} modal={dd.modal}>
        <div
          ref={dd.refs.setFloating}
          style={{ ...dd.floatingStyles, zIndex: 50 }}
          {...dd.getFloatingProps()}
          className={cn(
            "max-h-[min(70vh,420px)] max-w-[min(92vw,360px)] overflow-auto",
            className,
          )}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
