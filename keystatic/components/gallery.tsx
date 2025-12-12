import { repeating } from "@keystatic/core/content-components";
import { Images } from "lucide-react";
import React from "react";

const Gallery = repeating({
  label: "Gallery",
  icon: <Images />,
  children: ["Media"],
  schema: {
    // variant: fields.select({
    //   label: "Layout",
    //   options: [
    //     { label: "4 in a row", value: "cols-4" },
    //     { label: "3 in a row", value: "cols-3" },
    //     { label: "Bento", value: "bento" },
    //     { label: "Masonry", value: "masonry" },
    //   ],
    //   defaultValue: "cols-3",
    // }),
  },
  ContentView: ({ children }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0,1fr))",
        gap: 8,
      }}
    >
      {children}
    </div>
  ),
});

export default Gallery;
