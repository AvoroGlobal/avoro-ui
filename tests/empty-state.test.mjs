import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { EmptyState, Button } from "../dist/index.mjs";

const themes = ["light", "dark"];

test("renders default state in BOTH themes", () => {
  for (const theme of themes) {
    const html = renderToString(
      createElement("div", { "data-avoro-surface": theme },
        createElement(EmptyState, {
          icon: "search",
          title: "No listings found",
          body: "Try widening your filters or clearing the search.",
          action: createElement(Button, { variant: "secondary", children: "Clear filters" }),
        })
      )
    );

    assert.ok(html.includes("No listings found"), `Should render title for ${theme}`);
    assert.ok(html.includes("Try widening your filters"), `Should render body for ${theme}`);
    assert.ok(html.includes("Clear filters"), `Should render action for ${theme}`);
    assert.ok(html.includes("<svg"), `Should render icon for ${theme}`);
  }
});

test("icon renders from the registry by name", () => {
  const html = renderToString(
    createElement(EmptyState, { icon: "search", title: "Nothing here" })
  );

  assert.ok(html.includes("<svg"), "Should render the icon SVG");
});

test("body and action are optional", () => {
  const html = renderToString(
    createElement(EmptyState, { icon: "layers", title: "No data yet" })
  );

  assert.ok(html.includes("No data yet"), "Should render title only");
  assert.ok(!html.includes("<button"), "No action button when action omitted");
});

test("uses semantic tokens for icon/title/body", () => {
  const html = renderToString(
    createElement(EmptyState, { icon: "search", title: "T", body: "B" })
  );

  assert.ok(html.includes("var(--avoro-text-muted)"), "Icon/body should use text-muted token");
  assert.ok(html.includes("var(--avoro-text-primary)"), "Title should use text-primary token");
});

test("no hardcoded hex in rendered styles", () => {
  const html = renderToString(
    createElement(EmptyState, {
      icon: "search",
      title: "T",
      body: "B",
      action: createElement(Button, { children: "Go" }),
    })
  );
  const styleMatches = html.match(/style="([^"]*)"/g) || [];
  for (const styleAttr of styleMatches) {
    assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex in ${styleAttr}`);
  }
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      createElement(EmptyState, { icon: "search", title: "T", body: "B" })
    )
  );

  assert.ok(html.includes("var(--avoro-text-primary)"), "Title token present in dark");
  assert.ok(html.includes("var(--avoro-text-muted)"), "Muted token present in dark");
});
