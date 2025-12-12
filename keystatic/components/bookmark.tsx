import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { SquareArrowOutUpRight } from "lucide-react";

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
      <div
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: 8,
          padding: 8,
          background: "#FFFFFF",
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        {/* 1/3 */}
        {image && (
          <div
            style={{
              flex: "0 0 33.333%",
              maxWidth: "33.333%",
            }}
          >
            <img
              src={image}
              alt={displayTitle ?? ""}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 4,
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* 2/3 */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayTitle}
          </div>

          {description && (
            <div
              style={{
                fontSize: 12,
                color: "#4B5563",
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    );
  },
});

export default Bookmark;
