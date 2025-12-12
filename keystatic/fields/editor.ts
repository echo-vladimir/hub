import { fields } from "@keystatic/core";

import Badge from "../components/badge";
import Bookmark from "../components/bookmark";
import Callout from "../components/callout";
import Embed from "../components/embed";
import Gallery from "../components/gallery";
import Highlight from "../components/highlight";
import Media from "../components/media";

export const editorField = fields.markdoc({
  label: "Content",
  options: {
    image: false,
  },
  components: {
    Gallery,
    Media,
    Embed,
    Callout,
    Highlight,
    Badge,
    Bookmark,
  },
});
