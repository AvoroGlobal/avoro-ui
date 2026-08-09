// Generates demo/{light,dark}.html from the REAL components via renderToString.
// Every demo section is actual component output — no hand-written markup, so the
// demo can never drift from the components. Run: node scripts/build-demo.mjs
import { renderToString } from "react-dom/server";
import { createElement as h } from "react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Button, Input, Badge, Card, Table, Modal, Toast, Tabs, EmptyState, Skeleton,
} from "../dist/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// --- Section layout helpers (page chrome only — never component styling) ---

const gridStyle = (cols) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
  gap: "24px",
  marginTop: "16px",
  alignItems: "start",
});

const cellLabelStyle = {
  fontFamily: "var(--avoro-font-mono)",
  fontSize: "var(--avoro-size-micro)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  opacity: 0.6,
  marginBottom: "8px",
  color: "var(--avoro-text-muted)",
};

const Cell = (label, ...children) =>
  h("div", null, h("div", { style: cellLabelStyle }, label), ...children);

const Section = (title, note, ...cells) =>
  h("section", { style: { marginTop: "60px" } },
    h("h1", null, title),
    note ? h("div", { style: { ...cellLabelStyle, marginBottom: 0 } }, note) : null,
    h("div", { style: gridStyle(Math.min(cells.length, 3)) }, ...cells));

// --- Per-component states grids (real component output) ---

function buttonSection() {
  const variants = ["primary", "secondary", "ghost", "inverse"];
  const sizes = ["sm", "md", "lg"];
  const states = [
    { name: "default", props: {} },
    { name: "disabled", props: { disabled: true } },
    { name: "loading", props: { loading: true } },
  ];
  return Section("Button Component", "Variants × sizes × states",
    ...variants.map((variant) =>
      Cell(variant,
        ...states.flatMap((state) =>
          sizes.map((size) =>
            h("div", { key: `${variant}-${size}-${state.name}`, style: { marginBottom: "12px" } },
              h(Button, { variant, size, ...state.props }, state.name === "default" ? "Button" : state.name)))))));
}

function inputSection() {
  return Section("Input Component", "States",
    Cell("default", h(Input, { label: "Email", placeholder: "agent@brokerage.com" })),
    Cell("filled", h(Input, { label: "Email", defaultValue: "agent@brokerage.com" })),
    Cell("disabled", h(Input, { label: "Email", placeholder: "agent@brokerage.com", disabled: true })),
    Cell("error", h(Input, { label: "Email", defaultValue: "not-an-email", error: "Enter a valid email address" })),
    Cell("with hint", h(Input, { label: "Email", placeholder: "agent@brokerage.com", hint: "We never share your email." })));
}

function badgeSection() {
  const tones = ["neutral", "success", "warning", "error", "brand"];
  const labels = { neutral: "Draft", success: "Closed", warning: "Pending", error: "Failed", brand: "New" };
  return Section("Badge Component", "Tones",
    ...tones.map((tone) => Cell(tone, h(Badge, { tone }, labels[tone]))));
}

function cardSection() {
  return Section("Card Component", "States",
    Cell("default", h(Card, null,
      h("div", { style: { fontFamily: "var(--avoro-font-display)", fontSize: "var(--avoro-size-h4)", fontWeight: 600, marginBottom: "var(--avoro-space-2)" } }, "Quarterly recap"),
      h("div", { style: { fontSize: "var(--avoro-size-body-sm)", color: "var(--avoro-text-secondary)" } }, "Static container for grouped content."))),
    Cell("interactive", h(Card, { interactive: true },
      h("div", { style: { fontFamily: "var(--avoro-font-display)", fontSize: "var(--avoro-size-h4)", fontWeight: 600, marginBottom: "var(--avoro-space-2)" } }, "Open listing"),
      h("div", { style: { fontSize: "var(--avoro-size-body-sm)", color: "var(--avoro-text-secondary)" } }, "Hover raises the border; focus shows the ring."))));
}

function tableSection() {
  const columns = [
    { key: "agent", header: "Agent" },
    { key: "closings", header: "Closings", align: "right" },
    { key: "gci", header: "GCI", align: "right" },
  ];
  const rows = [
    { agent: "Priya Nair", closings: 12, gci: "$148k" },
    { agent: "Marcus Webb", closings: 9, gci: "$102k" },
    { agent: "Elena Ruiz", closings: 7, gci: "$88k" },
  ];
  return Section("Table Component", "States",
    Cell("default", h(Table, { columns, rows })),
    Cell("loading", h(Table, { columns, rows: [], loading: true })),
    Cell("empty", h(Table, { columns, rows: [], empty: true })),
    Cell("error + retry", h(Table, { columns, rows: [], error: "Couldn't load rankings", onRetry: () => {} })));
}

function modalSection() {
  // The Modal's SSR output is position:fixed, which would float over the whole
  // screenshot page. For the static demo we render the real component inside a
  // clipped stage and override its position to absolute so it captures in flow.
  // (The client component portals to document.body with a real backdrop.)
  const stageStyle = {
    position: "relative",
    height: "340px",
    border: "1px dashed var(--avoro-border-strong)",
    borderRadius: "var(--avoro-radius-lg)",
    overflow: "hidden",
  };
  const backdropOverride = {
    position: "absolute",
  };
  return Section("Modal Component", "Open state (SSR renders inline; the client portals over a backdrop)",
    Cell("open",
      h("div", { style: stageStyle, className: "modal-stage" },
        h(Modal, { open: true, onClose: () => {}, title: "Archive listing", style: { position: "absolute" } },
          h("p", { style: { fontSize: "var(--avoro-size-body-sm)", color: "var(--avoro-text-secondary)", marginBottom: "var(--avoro-space-5)" } },
            "123 Maple St will be removed from active listings. You can restore it within 30 days."),
          h("div", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--avoro-space-3)" } },
            h(Button, { variant: "secondary" }, "Cancel"),
            h(Button, { variant: "primary" }, "Archive"))))));
}

function toastSection() {
  const tones = ["success", "warning", "error"];
  const messages = {
    success: "Listing published to the MLS.",
    warning: "3 documents are missing signatures.",
    error: "Couldn't sync the calendar feed.",
  };
  return Section("Toast Component", "Tones (auto-dismiss after 4s)",
    Cell("all tones",
      h("div", { style: { display: "flex", flexDirection: "column", gap: "var(--avoro-space-3)", maxWidth: "420px" } },
        ...tones.map((tone) => h(Toast, { key: tone, tone, message: messages[tone], duration: 0 })))));
}

function tabsSection() {
  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "listings", label: "Listings" },
    { value: "clients", label: "Clients" },
    { value: "archive", label: "Archive", disabled: true },
  ];
  return Section("Tabs Component", "Selected / unselected / disabled (keyboard: arrows, Home, End)",
    Cell("states", h(Tabs, { tabs, value: "overview", onChange: () => {} })));
}

function emptyStateSection() {
  return Section("EmptyState Component", "Default",
    Cell("default",
      h("div", { style: { border: "1px dashed var(--avoro-border-strong)", borderRadius: "var(--avoro-radius-lg)" } },
        h(EmptyState, {
          icon: "search",
          title: "No listings found",
          body: "Try widening your filters or clearing the search.",
          action: h(Button, { variant: "secondary" }, "Clear filters"),
        }))));
}

function skeletonSection() {
  return Section("Skeleton Component", "Shapes (shimmer: duration-base + easing-standard)",
    Cell("text (3 lines)", h(Skeleton, { shape: "text", lines: 3 })),
    Cell("card", h(Skeleton, { shape: "card" })),
    Cell("avatar", h(Skeleton, { shape: "avatar" })));
}

// --- Page shell ---

const SHELL_CSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--avoro-font-sans);
      background: var(--avoro-surface-page);
      color: var(--avoro-text-primary);
      padding: 40px;
    }
    .demo-container { max-width: 1200px; margin: 0 auto; }
    h1 {
      font-family: var(--avoro-font-display);
      font-size: var(--avoro-size-h2);
      margin-bottom: 24px;
      color: var(--avoro-text-primary);
    }
    @keyframes avoro-skeleton-pulse {
      from { opacity: 1; }
      to { opacity: 0.45; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    /* Demo-only: keep the Modal's fixed backdrop contained inside its stage */
    .modal-stage > div[aria-hidden="true"] { position: absolute !important; }
`;

function page(theme) {
  const body = renderToString(
    h("div", { className: "demo-container" },
      buttonSection(), inputSection(), badgeSection(), cardSection(), tableSection(),
      modalSection(), toastSection(), tabsSection(), emptyStateSection(), skeletonSection())
  );

  return `<!DOCTYPE html>
<html lang="en" data-avoro-surface="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@avoroglobal/ui Demo — ${theme === "light" ? "Light" : "Dark"} Theme</title>
  <link rel="stylesheet" href="/node_modules/@avoroglobal/brand-tokens/dist/css-variables.css">
  <style>${SHELL_CSS}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

for (const theme of ["light", "dark"]) {
  fs.writeFileSync(path.join(root, "demo", `${theme}.html`), page(theme));
  console.log(`wrote demo/${theme}.html`);
}
