import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Table } from "../dist/index.mjs";

const themes = ["light", "dark"];
const columns = [
  { key: "agent", header: "Agent" },
  { key: "closings", header: "Closings", align: "right" },
];
const rows = [
  { agent: "Priya Nair", closings: 12 },
  { agent: "Marcus Webb", closings: 9 },
];

test("renders all 5 states in BOTH themes", () => {
  for (const theme of themes) {
    const variants = [
      { name: "default", props: { columns, rows } },
      { name: "row-hover", props: { columns, rows } }, // hover is handler-driven; same SSR
      { name: "loading", props: { columns, rows: [], loading: true } },
      { name: "empty", props: { columns, rows: [], empty: true } },
      { name: "error", props: { columns, rows: [], error: "Couldn't load rankings" } },
    ];
    for (const { name, props } of variants) {
      const html = renderToString(
        createElement("div", { "data-avoro-surface": theme },
          createElement(Table, props)
        )
      );
      assert.ok(html.includes("<table"), `Should render table for ${name}/${theme}`);
      assert.ok(html.includes("Agent"), `Should render headers for ${name}/${theme}`);
    }
  }
});

test("default state renders typed rows via column render", () => {
  const html = renderToString(
    createElement(Table, { columns, rows })
  );

  assert.ok(html.includes("Priya Nair"), "Should render row data");
  assert.ok(html.includes("Marcus Webb"), "Should render row data");
  assert.ok(html.includes("12"), "Should render numeric cell");
});

test("custom column render is used when provided", () => {
  const cols = [
    { key: "agent", header: "Agent", render: (row) => `Agent: ${row.agent}` },
  ];
  const html = renderToString(
    createElement(Table, { columns: cols, rows })
  );

  assert.ok(html.includes("Agent: Priya Nair"), "Should use custom render");
});

test("loading state renders skeleton rows, not data", () => {
  const html = renderToString(
    createElement(Table, { columns, rows, loading: true })
  );

  assert.ok(html.includes("avoro-skeleton-pulse"), "Should render skeleton shimmer");
  assert.ok(!html.includes("Priya Nair"), "Should not render data while loading");
  assert.ok(html.includes("var(--avoro-duration-base)"), "Shimmer should use duration-base token");
  assert.ok(html.includes("var(--avoro-easing-standard)"), "Shimmer should use easing-standard token");
});

test("empty state renders the empty placeholder", () => {
  const html = renderToString(
    createElement(Table, { columns, rows: [], empty: true })
  );

  assert.ok(html.includes("No data yet"), "Should render empty message");
  assert.ok(html.includes("var(--avoro-text-muted)"), "Empty should use text-muted token");
});

test("error state renders the error message with error token", () => {
  const html = renderToString(
    createElement(Table, { columns, rows: [], error: "Couldn't load rankings" })
  );

  assert.ok(html.includes("Couldn&#x27;t load rankings"), "Should render error message");
  assert.ok(html.includes("var(--avoro-status-error-fg)"), "Error should use status-error-fg token");
});

test("uses table component tokens", () => {
  const html = renderToString(
    createElement(Table, { columns, rows })
  );

  assert.ok(html.includes("var(--avoro-component-table-row-height)"), "Should use row-height token");
  assert.ok(html.includes("var(--avoro-component-table-cell-padding-x)"), "Should use cell-padding-x token");
  assert.ok(html.includes("var(--avoro-component-table-header-weight)"), "Should use header-weight token");
});

test("no hardcoded hex in rendered styles", () => {
  const variants = [
    { columns, rows },
    { columns, rows: [], loading: true },
    { columns, rows: [], empty: true },
    { columns, rows: [], error: "x" },
  ];
  for (const props of variants) {
    const html = renderToString(createElement(Table, props));
    const styleMatches = html.match(/style="([^"]*)"/g) || [];
    for (const styleAttr of styleMatches) {
      assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex in ${styleAttr}`);
    }
  }
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      createElement(Table, { columns, rows })
    )
  );

  assert.ok(html.includes("var(--avoro-surface-card)"), "Should use surface-card token in dark");
  assert.ok(html.includes("var(--avoro-text-primary)"), "Should use text-primary token in dark");
  assert.ok(html.includes("var(--avoro-text-muted)"), "Should use text-muted token in dark");
  assert.ok(html.includes("var(--avoro-border-default)"), "Should use border-default token in dark");
});
