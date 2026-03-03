"use client";

import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dropdown, useDropdown } from "../../internal/dropdown";
import { useToolbarOverflow } from "../../internal/overflow/context/overflow-context";

type MoreProps = {
  isShowCount?: boolean;
};

export function More({ isShowCount = false }: MoreProps) {
  const { hiddenItemIds, getSlot, setMore } = useToolbarOverflow();

  const dd = useDropdown({
    id: "more",
    scope: "toolbar",
    placement: "bottom-end",
    modal: true,
    strategy: "fixed",
    trackScroll: false,
  });

  const count = hiddenItemIds?.length;
  if (count <= 0) return null;

  const ids = hiddenItemIds.slice().reverse();

  return (
    <>
      <button
        ref={(el) => {
          setMore(el);
          dd.refs.setReference(el);
        }}
        type="button"
        data-toolbar-more="1"
        className="relative inline-flex items-center bg-gray-100 hover:bg-black/10 rounded-full p-2 text-sm"
        {...dd.getReferenceProps()}
      >
        <Ellipsis className="inline-block" size={20} strokeWidth={1.6} />
        {isShowCount && count > 0 && (
          <span className="absolute -top-2 -left-2 bg-gray-200 inline-flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-semibold">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <Dropdown
        dd={dd}
        className={cn(
          "min-w-72 rounded-xl border border-black/5 bg-white/95 p-1 shadow-lg backdrop-blur-2xl",
          "dark:border-white/10 dark:bg-neutral-900/90",
        )}
      >
        <ul className="flex flex-col overflow-auto rounded-lg">
          {ids.map((id) => {
            const action = getSlot(id, "action");
            if (action)
              return (
                <li
                  key={id}
                  className="rounded-lg px-2 py-1.5 text-sm hover:bg-gray-200"
                >
                  {action.render()}
                </li>
              );

            const trigger = getSlot(id, "trigger");
            const content = getSlot(id, "content");
            if (!trigger && !content) return null;

            return (
              <div
                key={id}
                className="my-4 rounded-xl border border-black/5 p-1"
              >
                {trigger && (
                  <div className="px-2 py-1 text-xs font-semibold opacity-70">
                    {trigger.render()}
                  </div>
                )}
                {content && <div className="px-1 pb-1">{content.render()}</div>}
              </div>
            );
          })}
        </ul>
      </Dropdown>
    </>
  );
}
