import { fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { CircleQuestionMark } from "lucide-react";
import React from "react";

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
      <div
        style={{
          padding: 10,
          background: "rgba(0,0,0,0.01)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: "bold",
            opacity: 0.6,
            marginBottom: 6,
          }}
        >
          {value.variant?.toUpperCase() ?? "NOTE"}
        </div>
        <div>{children}</div>
      </div>
    );
  },
});

export default Callout;
