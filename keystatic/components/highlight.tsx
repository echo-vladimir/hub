import { fields } from "@keystatic/core";
import { mark } from "@keystatic/core/content-components";
import { Highlighter } from "lucide-react";

const Highlight = mark({
  label: "Highlight",
  icon: <Highlighter />,
  schema: {
    kind: fields.select({
      label: "Type",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
        { label: "Visual", value: "visual" },
        { label: "Audio", value: "audio" },
        { label: "Note", value: "note" },
        { label: "Embed", value: "embed" },
      ],
      defaultValue: "note",
    }),
    embed: fields.text({
      label: "Embed",
      multiline: true,
      description: "Paste iframe, <img>, <audio>… or other embed HTML.",
    }),
  },
  tag: "mark",
  style: ({ value }) => {
    const base = {
      borderRadius: "3px",
      padding: "0 2px",
    } as const;

    const colorMap: Record<string, string> = {
      image: "rgba(244, 114, 182, 0.4)", // розовый
      video: "rgba(96, 165, 250, 0.4)", // голубой
      visual: "rgba(250, 204, 21, 0.6)", // ярко-жёлтый
      audio: "rgba(52, 211, 153, 0.4)", // зелёный
      note: "rgba(148, 163, 184, 0.4)", // серо-синий
      embed: "rgba(148, 163, 184, 0.4)", // дефолт
    };

    const bg =
      value && typeof value.kind === "string"
        ? (colorMap[value.kind] ?? colorMap.embed)
        : colorMap.embed;

    return {
      ...base,
      backgroundColor: bg,
    };
  },
});

export default Highlight;
