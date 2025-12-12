import { repeating } from "@keystatic/core/content-components";
import { Images } from "lucide-react";

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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4">
      {children}
    </div>
  ),
});

export default Gallery;
