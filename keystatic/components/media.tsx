import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const Media = block({
  label: "Media",
  icon: <ImageIcon />,
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
      }
    ),
  },
  ContentView: ({ value }) => {
    const media = value.media;

    switch (media.discriminant) {
      case "image": {
        const imageValue = media.value;

        if (!imageValue?.asset) {
          return <div className="p-2.5 text-xs opacity-40">NO IMAGE</div>;
        }

        const buffer = imageValue.asset.data;
        const blob = new Blob([new Uint8Array(buffer)]);
        const url = URL.createObjectURL(blob);

        return (
          <Image
            src={url}
            alt={imageValue.alt ?? ""}
            width={1200}
            height={800}
            className="block w-full h-auto"
            sizes="100vw"
            unoptimized
          />
        );
      }

      case "video": {
        const videoValue = media.value;

        if (!videoValue?.url) {
          return <div className="p-2.5 text-xs opacity-40">MISSING VIDEO</div>;
        }

        return (
          <video controls className="block w-full">
            <track default kind="captions" label="English" />
            <source src={videoValue.url} type="video/mp4" />
          </video>
        );
      }

      default:
        return <div className="p-2.5 text-xs opacity-40">NO MEDIA</div>;
    }
  },
});

export default Media;
