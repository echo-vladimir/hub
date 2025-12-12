import React from "react";
import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { FileCodeIcon } from "lucide-react";

const Embed = block({
  label: "Embed",
  icon: <FileCodeIcon />,
  schema: {
    code: fields.text({
      label: "Iframe",
      multiline: true,
    }),
    mode: fields.select({
      label: "Mode",
      options: [
        { label: "Content", value: "content" },
        { label: "Full", value: "full" },
      ],
      defaultValue: "content",
    }),
  },
  ContentView: ({ value }) => {
    const code = (value.code ?? "").trim();
    if (!code) return null;

    const w = Number(code.match(/width="(\d+)"/i)?.[1] ?? 16);
    const h = Number(code.match(/height="(\d+)"/i)?.[1] ?? 9);
    const ratio = w > 0 && h > 0 ? `${w} / ${h}` : "16 / 9";

    return (
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        <div
          style={{ position: "relative", width: "100%", aspectRatio: ratio }}
        >
          <style>{`
            .ks-raw-embed iframe {
              position: absolute !important;
              inset: 0 !important;
              width: 100% !important;
              height: 100% !important;
              max-width: 100% !important;
              display: block !important;
            }
          `}</style>
          <div
            className="ks-raw-embed"
            dangerouslySetInnerHTML={{ __html: code }}
          />
        </div>
      </div>
    );
  },
});

export default Embed;
