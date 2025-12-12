import { fields } from "@keystatic/core";

export const CATEGORY_OPTIONS = [
  { label: "Product", value: "product" },
  { label: "UI/UX", value: "ui-ux" },
  { label: "Brand", value: "brand" },
  { label: "Motion", value: "motion" },
  { label: "Performance", value: "performance" },
  { label: "Content & CMS", value: "content-cms" },
  { label: "Engineering", value: "engineering" },
  { label: "Experiment", value: "experiment" },
];

export const categoryField = fields.select({
  label: "Category",
  options: CATEGORY_OPTIONS,
  defaultValue: "product",
});
