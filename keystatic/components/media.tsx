import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { Image } from "lucide-react";
import React from "react";

const Media = block({
  label: "Media",
  icon: <Image />,
  schema: {
    media: fields.conditional(
      fields.select({
        label: "Media",
        options: [
          { label: "No media", value: "none" },
          { label: "Image", value: "image" },
          { label: "Video", value: "video" },
        ],
        defaultValue: "none",
      }),
      {
        none: fields.empty(),
        image: fields.object({
          asset: fields.image({
            label: "Image",
            directory: "public/images/*",
            publicPath: "/images/*",
            validation: { isRequired: true },
          }),
          alt: fields.text({ label: "Alt text" }),
          caption: fields.text({ label: "Caption" }),
          mode: fields.select({
            label: "Mode",
            description: "Ignored in Gallery",
            options: [
              { label: "Content", value: "content" },
              { label: "Full", value: "full" },
            ],
            defaultValue: "content",
          }),
        }),
        video: fields.object({
          url: fields.text({
            label: "Video URL",
            validation: { length: { min: 1 } },
          }),
          image: fields.object({
            asset: fields.image({
              label: "Image",
              description: "Thumbnail image override for the video.",
              directory: "public/images/*",
              publicPath: "/images/*",
            }),
            alt: fields.text({ label: "Alt text" }),
            caption: fields.text({ label: "Caption" }),
          }),
        }),
      },
    ),
  },
  ContentView: ({ value }) => {
    const media = value.media;
    switch (media.discriminant) {
      case "image": {
        const imageValue = media.value;
        if (!imageValue || !imageValue.asset) {
          return (
            <div style={{ fontSize: 12, padding: 10, opacity: 0.4 }}>
              NO IMAGE
            </div>
          );
        }
        const buffer = imageValue.asset.data;
        const blob = new Blob([new Uint8Array(buffer)]);
        const url = URL.createObjectURL(blob);
        return (
          <img
            src={url}
            alt={imageValue.alt ?? ""}
            style={{ width: "100%", display: "block", borderRadius: 8 }}
          />
        );
      }

      case "video": {
        const videoValue = media.value;
        if (!videoValue || !videoValue.url) {
          return (
            <div style={{ fontSize: 12, padding: 10, opacity: 0.4 }}>
              MISSING VIDEO
            </div>
          );
        }
        return (
          <video
            controls
            style={{ width: "100%", display: "block", borderRadius: 8 }}
          >
            <source src={videoValue.url} type="video/mp4" />
          </video>
        );
      }

      default:
        return (
          <div style={{ fontSize: 12, padding: 10, opacity: 0.4 }}>
            NO MEDIA
          </div>
        );
    }
  },
});

export default Media;
