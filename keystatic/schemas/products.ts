import { fields } from "@keystatic/core";

const productsSchema = {
  title: fields.slug({ name: { label: "Title" } }),
  content: fields.markdoc({ label: "Content" }),
};

export default productsSchema;
