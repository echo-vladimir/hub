import { collection, config, fields, singleton } from "@keystatic/core";
import { createElement } from "react";
import casesSchema from "./keystatic/schemas/cases";
import homeSchema from "./keystatic/schemas/home";
import labSchema from "./keystatic/schemas/lab";
import postsSchema from "./keystatic/schemas/posts";
import productsSchema from "./keystatic/schemas/products";

export const markdocConfig = fields.markdoc.createMarkdocConfig({});

export default config({
  storage: {
    kind: "github",
    repo: "echo-vladimir/hub",
    branchPrefix: "content/",
  },
  ui: {
    brand: {
      name: "Hub",
      mark: ({ colorScheme }: { colorScheme: string }) => {
        const path =
          colorScheme === "dark"
            ? "https://hublx.vercel.app/favicon.ico"
            : "https://hublx.vercel.app/favicon.ico";
        return createElement("img", { src: path, height: 24, width: 24 });
      },
    },
    navigation: {
      Site: ["home"],
      Content: [
        // "products",
        "cases",
        "posts",
        "lab",
      ],
      Settings: ["marketing"],
    },
  },
  collections: {
    cases: collection({
      label: "Cases",
      columns: ["title"],
      slugField: "title",
      path: "content/cases/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: casesSchema,
    }),
    products: collection({
      label: "Products",
      columns: ["title"],
      slugField: "title",
      path: "content/products/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: productsSchema,
    }),
    posts: collection({
      label: "Posts",
      columns: ["title", "date"],
      slugField: "title",
      path: "content/posts/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: postsSchema,
    }),
    lab: collection({
      label: "Lab",
      columns: ["title"],
      slugField: "title",
      path: "content/lab/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: labSchema,
    }),
  },
  singletons: {
    home: singleton({
      label: "Home",
      path: "content/home",
      schema: homeSchema,
    }),
    marketing: singleton({
      label: "Marketing",
      schema: {},
    }),
  },
});
