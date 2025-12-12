import { fields } from "@keystatic/core";
import { categoryField } from "../fields/category";
import { editorField } from "../fields/editor";

const postsSchema = {
  content: editorField,

  title: fields.slug({
    name: { label: "Title" },
    slug: { label: "Slug" },
  }),
  date: fields.date({ label: "Published At" }),
  cover: fields.image({
    label: "Cover",
    directory: "public/images/posts",
    publicPath: "/images/posts/",
  }),

  meta: fields.object(
    {
      category: categoryField,
      tags: fields.text({
        label: "Tags",
        multiline: true,
      }),
    },
    {
      label: " ",
      layout: [6, 6],
    },
  ),

  links: fields.object(
    {
      items: fields.array(
        fields.object(
          {
            title: fields.text({ label: "Title" }),
            url: fields.url({ label: "URL" }),
          },
          { layout: [4, 8] },
        ),
        {
          label: "Canonical external resources",
          itemLabel: (props) => props.fields.title.value,
        },
      ),
    },
    {
      label: "Links",
    },
  ),

  featured: fields.checkbox({
    label: "Featured",
    description: "Highlight this post on in lists",
    defaultValue: false,
  }),
  progress: fields.checkbox({
    label: "In Progress",
    description: "Show progress badge",
    defaultValue: false,
  }),
  draft: fields.checkbox({
    label: "Draft",
    description: "Hide from production",
    defaultValue: false,
  }),
};

export default postsSchema;
