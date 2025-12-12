import Image from "next/image";
import { fields } from "@keystatic/core";
import { inline } from "@keystatic/core/content-components";
import { Tickets } from "lucide-react";

export const Badge = inline({
  label: "Badge",
  icon: <Tickets />,
  schema: {
    imageUrl: fields.text({
      label: "Badge image URL",
      description: "PNG/SVG from Netlify, shields.io, etc.",
      validation: { length: { min: 1 } },
    }),
    linkUrl: fields.text({
      label: "Link URL",
      description: "Optional: dashboard/deploys/npm page",
    }),
    alt: fields.text({
      label: "Alt text",
      description: "Short description, e.g. “Netlify deploy status”.",
      defaultValue: "Badge",
    }),
  },
  ContentView: ({ value }) => {
    if (!value.imageUrl) return <span>{value.alt}</span>;
    return (
      <Image
        src={value.imageUrl}
        alt={value.alt || "Badge"}
        className="inline-block h-[4.5] w-auto align-middle"
        width={100}
        height={20}
        unoptimized
      />
    );
  },
});

export default Badge;
