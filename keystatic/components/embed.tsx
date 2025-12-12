import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { FileCodeIcon } from "lucide-react";

function parseSingleIframe(code: string) {
  if (typeof window === "undefined") return null;

  const doc = new DOMParser().parseFromString(code, "text/html");
  const iframe = doc.querySelector("iframe");
  if (!iframe) return null;

  const allEls = Array.from(doc.body.querySelectorAll("*"));
  if (allEls.length !== 1 || allEls[0].tagName.toLowerCase() !== "iframe")
    return null;

  const src = iframe.getAttribute("src") ?? "";
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  const allowedHosts = new Set([
    "www.youtube.com",
    "youtube.com",
    "player.vimeo.com",
    "www.figma.com",
    "codesandbox.io",
  ]);
  if (!allowedHosts.has(url.hostname)) return null;

  const w = Number(iframe.getAttribute("width") ?? 16);
  const h = Number(iframe.getAttribute("height") ?? 9);

  return {
    src: url.toString(),
    width: Number.isFinite(w) && w > 0 ? w : 16,
    height: Number.isFinite(h) && h > 0 ? h : 9,
    title: iframe.getAttribute("title") ?? "Embed",
    allow: iframe.getAttribute("allow") ?? undefined,
    allowFullScreen:
      iframe.hasAttribute("allowfullscreen") ||
      iframe.getAttribute("allowfullscreen") !== null,
  };
}

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
    const data = parseSingleIframe(value.code);
    if (!data)
      return (
        <div style={{ fontSize: 12, padding: 10, opacity: 0.4 }}>
          Invalid iframe
        </div>
      );

    const ratio = `${data.width} / ${data.height}`;

    return (
      <div className="mx-auto w-full max-w-full">
        <div className="relative w-full" style={{ aspectRatio: ratio }}>
          <iframe
            src={data.src}
            title={data.title}
            allow={data.allow}
            allowFullScreen={data.allowFullScreen}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    );
  },
});

export default Embed;
