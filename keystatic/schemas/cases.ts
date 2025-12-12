import { fields } from "@keystatic/core";
import { editorField } from "../fields/editor";
import { timelineField } from "../fields/timeline";

const casesSchema = {
  content: editorField,

  title: fields.slug({
    name: { label: "Title" },
    slug: { label: "Slug" },
  }),
  cover: fields.image({
    label: "Cover",
    directory: "public/images/cases",
    publicPath: "/images/cases/",
  }),

  meta: fields.object(
    {
      year: fields.text({
        label: "Year",
        defaultValue: new Date().getFullYear().toString(),
      }),
      country: fields.text({
        label: "Country",
        defaultValue: "🇵🇱 Poland",
      }),
    },
    {
      label: " ",
      layout: [6, 6],
    },
  ),

  business: fields.object(
    {
      domain: fields.text({
        label: "Domain",
      }),
      case: fields.select({
        label: "Use Case",
        options: [
          { label: "Prototype", value: "prototype" },
          { label: "Landing Page", value: "landing" },
          { label: "Website", value: "site" },
          { label: "Web App", value: "web-app" },
          { label: "Dashboard", value: "dashboard" },
          { label: "E-commerce", value: "e-commerce" },
          { label: "Design System", value: "design-system" },
        ],
        defaultValue: "web-app",
      }),
      class: fields.select({
        label: "Class",
        options: [
          { label: "Concept", value: "concept" },
          { label: "Personal", value: "personal" },
          { label: "Commercial", value: "commercial" },
          { label: "Open Source", value: "oss" },
        ],
        defaultValue: "commercial",
      }),
    },
    {
      label: "Business",
    },
  ),

  technical: fields.object(
    {
      team: fields.select({
        label: "Team",
        options: [
          { label: "Solo", value: "solo" },
          { label: "Small team (2–5)", value: "small" },
          { label: "Cross-functional", value: "cross" },
        ],
        defaultValue: "solo",
      }),
      scope: fields.select({
        label: "Scope",
        options: [
          { label: "End-to-End", value: "end-to-end" },
          { label: "Full-stack", value: "full-stack" },
          { label: "UX/UI + Frontend", value: "design-fe" },
          { label: "Frontend", value: "frontend" },
          { label: "UX/UI Design", value: "design" },
        ],
        defaultValue: "end-to-end",
      }),
      stack: fields.text({ label: "Stack", multiline: true }),
    },
    {
      label: "Technical",
    },
  ),

  description: fields.object(
    {
      client: fields.text({
        label: "Client",
        multiline: true,
      }),
      contribution: fields.text({
        label: "Contribution",
        multiline: true,
      }),
    },
    {
      label: "Description",
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
          label: "Related external resources",
          itemLabel: (props) => props.fields.title.value,
        },
      ),
    },
    {
      label: "Links",
    },
  ),

  timeline: timelineField,

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

export default casesSchema;
