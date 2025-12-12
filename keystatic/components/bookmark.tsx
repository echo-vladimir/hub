import Image from "next/image";
import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

const Bookmark = block({
  label: "Bookmark",
  icon: <SquareArrowOutUpRight />,
  schema: {
    url: fields.url({ label: "URL" }),
    title: fields.text({ label: "Title" }),
    description: fields.text({ label: "Description", multiline: true }),
    image: fields.url({ label: "Image URL" }),
  },

  ContentView({ value }) {
    const { url, title, description, image } = value as {
      url?: string | null;
      title?: string | null;
      description?: string | null;
      image?: string | null;
    };

    const displayTitle = title || url || "Link title";

    return (
      <div className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-white p-2">
        {/* 1/3 */}
        {image && (
          <div className="w-1/3 shrink-0">
            <Image
              src={image}
              alt={displayTitle ?? ""}
              width={320}
              height={180}
              unoptimized
              className="block h-auto w-full rounded object-cover"
            />
          </div>
        )}

        {/* 2/3 */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 truncate text-sm font-semibold">
            {displayTitle}
          </div>

          {description && (
            <div className="text-xs text-zinc-600 line-clamp-3">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  },
});

export default Bookmark;
