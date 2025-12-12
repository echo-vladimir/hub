import { fields } from "@keystatic/core";

const PHASES_OPTIONS = [
  { label: "Strategy", value: "strategy" },
  { label: "Design", value: "design" },
  { label: "Build", value: "build" },
  { label: "Integrations", value: "integrations" },
  { label: "Quality", value: "quality" },
  { label: "Launch", value: "launch" },
  // { label: "Custom", value: "custom" },
] as const;

const STRATEGY_PROCESS_OPTIONS = [
  { label: "Discovery", value: "strategy-discovery" },
  { label: "Stakeholder interviews", value: "strategy-stakeholders" },
  { label: "Objectives & KPIs", value: "strategy-objectives-kpis" },
  { label: "Audience & segments", value: "strategy-audience-segments" },
  { label: "Market & competitors", value: "strategy-market-competitors" },
  { label: "Scope & roadmap", value: "strategy-scope-roadmap" },
  { label: "Technical assessment", value: "strategy-planning-tech" },
  { label: "Risks & assumptions", value: "strategy-risks-assumptions" },
] as const;

const DESIGN_PROCESS_OPTIONS = [
  { label: "User flows", value: "design-ux-flows" },
  { label: "Content structure & IA", value: "design-content-ia" },
  { label: "Page & screen types", value: "design-ux-page-types" },
  { label: "Wireframes (low-fi)", value: "design-ux-wire-low" },
  { label: "Layouts (high-fi)", value: "design-ux-wire-high" },
  { label: "Brand & visual direction", value: "design-brand-visual" },
  { label: "Design system & components", value: "design-system-components" },
  { label: "States & variants", value: "design-system-variants" },
  { label: "Motion & interactions", value: "design-motion-interactions" },
  { label: "Prototype testing", value: "design-research-testing" },
] as const;

const BUILD_PROCESS_OPTIONS = [
  { label: "Domain & data modelling", value: "build-backend-domain-data" },
  { label: "API design & services", value: "build-backend-api-services" },
  { label: "Frontend implementation", value: "build-frontend-implementation" },
  { label: "Responsive layout", value: "build-responsive-layout" },
  { label: "Component architecture", value: "build-component-architecture" },
  { label: "Animations & UX", value: "build-frontend-animations" },
  { label: "Mobile experience", value: "build-mobile-experience" },
  { label: "Security & access controls", value: "build-dev-security-access" },
  { label: "Feature flags", value: "build-dev-feature-flags" },
  { label: "Performance optimisation", value: "build-dev-performance" },
] as const;

const INTEGRATIONS_PROCESS_OPTIONS = [
  { label: "Headless CMS", value: "integrations-cms-headless" },
  { label: "Auth & identity", value: "integrations-auth-identity" },
  { label: "Roles & permissions", value: "integrations-auth-roles" },
  { label: "Payments & billing", value: "integrations-payments" },
  { label: "Email & CRM", value: "integrations-crm-email" },
  { label: "Push & in-app", value: "integrations-comms-push-inapp" },
  { label: "Analytics & tracking", value: "integrations-analytics" },
  { label: "Error tracking & logging", value: "integrations-error-tracking" },
  { label: "Search & filters", value: "integrations-external-search" },
  { label: "Maps & location", value: "integrations-external-maps" },
  { label: "External SDKs & services", value: "integrations-external-sdks" },
  { label: "Consent & compliance", value: "integrations-compliance-consent" },
] as const;

const QUALITY_PROCESS_OPTIONS = [
  {
    label: "Test strategy & scenarios",
    value: "quality-qa-strategy-scenarios",
  },
  { label: "Accessibility review", value: "quality-qa-a11y" },
  { label: "Performance tuning", value: "quality-qa-performance" },
  { label: "Unit tests", value: "quality-qa-unit" },
  { label: "Integration tests", value: "quality-qa-integration" },
  { label: "E2E tests", value: "quality-qa-e2e" },
  { label: "Visual regression", value: "quality-qa-visual" },
  { label: "Devices & browsers", value: "quality-qa-cross-platform" },
  { label: "Security checks", value: "quality-qa-security" },
  { label: "Stabilisation & fixes", value: "quality-qa-stabilisation" },
  { label: "UX polish", value: "quality-ux-polish" },
] as const;

const LAUNCH_PROCESS_OPTIONS = [
  { label: "Production deploy", value: "launch-production-deploy" },
  { label: "Domains, SSL & CDN", value: "launch-domains" },
  { label: "SEO & indexing", value: "launch-seo-seo-indexing" },
  { label: "App store presence", value: "launch-ops-store-presence" },
  { label: "Monitoring & alerting", value: "launch-ops-monitoring-alerting" },
  {
    label: "Release strategy & rollback",
    value: "launch-ops-release-strategy",
  },
  { label: "Release automation", value: "launch-ops-release-automation" },
  { label: "Release documentation", value: "launch-ops-release-docs" },
  { label: "Training & handover", value: "launch-ops-training" },
  { label: "Post-launch review", value: "launch-post-launch-review" },
  { label: "Growth experiments", value: "launch-growth-experiments" },
] as const;

export const timelineField = fields.object(
  {
    phases: fields.array(
      fields.conditional(
        fields.select({
          label: "Phase type",
          options: PHASES_OPTIONS,
          defaultValue: "strategy",
        }),
        {
          strategy: fields.object(
            {
              label: fields.text({
                label: "Label",
                description: "Optional, e.g. “Strategy iteration 1”",
              }),
              start: fields.datetime({ label: "Start" }),
              end: fields.datetime({ label: "End" }),
              processes: fields.multiselect({
                label: "Processes",
                options: STRATEGY_PROCESS_OPTIONS,
              }),
            },
            { label: "Strategy phase" },
          ),

          design: fields.object(
            {
              label: fields.text({
                label: "Label",
                description: "Optional, e.g. “Design sprint 1”",
              }),
              start: fields.datetime({ label: "Start" }),
              end: fields.datetime({ label: "End" }),
              processes: fields.multiselect({
                label: "Processes",
                options: DESIGN_PROCESS_OPTIONS,
              }),
            },
            { label: "Design phase" },
          ),

          build: fields.object(
            {
              label: fields.text({
                label: "Label",
                description: "Optional, e.g. “Build iteration 2”",
              }),
              start: fields.datetime({ label: "Start" }),
              end: fields.datetime({ label: "End" }),
              processes: fields.multiselect({
                label: "Processes",
                options: BUILD_PROCESS_OPTIONS,
              }),
            },
            { label: "Build phase" },
          ),

          integrations: fields.object(
            {
              label: fields.text({
                label: "Label",
                description: "Optional, e.g. “CMS & Integrations”",
              }),
              start: fields.datetime({ label: "Start" }),
              end: fields.datetime({ label: "End" }),
              processes: fields.multiselect({
                label: "Processes",
                options: INTEGRATIONS_PROCESS_OPTIONS,
              }),
            },
            { label: "Integrations phase" },
          ),

          quality: fields.object(
            {
              label: fields.text({
                label: "Label",
                description: "Optional, e.g. “QA/Perf/A11y”",
              }),
              start: fields.datetime({ label: "Start" }),
              end: fields.datetime({ label: "End" }),
              processes: fields.multiselect({
                label: "Processes",
                options: QUALITY_PROCESS_OPTIONS,
              }),
            },
            { label: "Quality phase" },
          ),

          launch: fields.object(
            {
              label: fields.text({
                label: "Label",
                description: "Optional, e.g. “Launch & Learn”",
              }),
              start: fields.datetime({ label: "Start" }),
              end: fields.datetime({ label: "End" }),
              processes: fields.multiselect({
                label: "Processes",
                options: LAUNCH_PROCESS_OPTIONS,
              }),
            },
            { label: "Launch phase" },
          ),

          custom: fields.object(
            {
              label: fields.text({
                label: "Custom phase name",
                description: "e.g. “Brand sprint” or “Experiment”",
              }),
              start: fields.datetime({ label: "Start" }),
              end: fields.datetime({ label: "End" }),
              processes: fields.array(fields.text({ label: "Process" }), {
                label: "Processes",
                itemLabel: (props) => props.value,
              }),
            },
            { label: "Custom phase" },
          ),
        },
      ),
      {
        label: "Phases",
        itemLabel: (props) => {
          const names: Record<string, string> = {
            strategy: "Strategy",
            design: "Design",
            build: "Build",
            integrations: "Integrations",
            quality: "Quality",
            launch: "Launch",
            custom: "Custom",
          };

          const kind = props.discriminant as string;
          const base = names[kind] ?? "Phase";

          let label: string | undefined;
          if (
            props.value &&
            "fields" in props.value &&
            props.value.fields &&
            "label" in props.value.fields
          ) {
            const v = props.value as {
              fields: {
                label?: { value?: string };
              };
            };
            label = v.fields.label?.value;
          }

          return label ? `${base}: ${label}` : base;
        },
      },
    ),
  },
  {
    label: "Timeline",
  },
);
