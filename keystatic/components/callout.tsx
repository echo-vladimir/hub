import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { CircleQuestionMark } from "lucide-react";

const Callout = wrapper({
  label: "Callout",
  icon: <CircleQuestionMark />,
  schema: {
    variant: fields.select({
      label: "Type",
      options: [
        { label: "Note", value: "note" },
        { label: "Warning", value: "warning" },
      ],
      defaultValue: "note",
    }),
  },
  ContentView: ({ value, children }) => {
    return (
      <div className="p-2.5 bg-black/1">
        <div className="mb-1.5 text-xs font-bold opacity-60">
          {value.variant?.toUpperCase() ?? "NOTE"}
        </div>
        <div>{children}</div>
      </div>
    );
  },
});

export default Callout;
