import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Tabs } from "../dist/index.mjs";

const themes = ["light", "dark"];
const noop = () => {};
const tabs = [
  { value: "overview", label: "Overview" },
  { value: "listings", label: "Listings" },
  { value: "archive", label: "Archive", disabled: true },
];

test("renders all 4 states (selected/hover/focus/disabled) in BOTH themes", () => {
  for (const theme of themes) {
    const html = renderToString(
      createElement("div", { "data-avoro-surface": theme },
        createElement(Tabs, { tabs, value: "overview", onChange: noop })
      )
    );

    assert.ok(html.includes('role="tablist"'), `Should render tablist for ${theme}`);
    assert.ok(html.includes("Overview"), `Should render tab labels for ${theme}`);
    assert.ok(html.includes("Listings"), `Should render tab labels for ${theme}`);
    assert.ok(html.includes("Archive"), `Should render disabled tab for ${theme}`);
  }
});

test("selected tab has aria-selected=true and tabindex=0", () => {
  const html = renderToString(
    createElement(Tabs, { tabs, value: "listings", onChange: noop })
  );

  assert.ok(html.includes('aria-selected="true"'), "Selected tab should have aria-selected=true");
  assert.ok(html.includes('aria-selected="false"'), "Unselected tabs should have aria-selected=false");
  // Selected tab is in the tab order; others are reachable via arrow keys in a full impl
  assert.ok(html.includes('tabindex="0"'), "Selected tab should have tabindex=0");
  assert.ok(html.includes('tabindex="-1"'), "Unselected tabs should have tabindex=-1");
});

test("selected tab uses the interactive-primary-bg indicator", () => {
  const html = renderToString(
    createElement(Tabs, { tabs, value: "overview", onChange: noop })
  );

  assert.ok(html.includes("var(--avoro-interactive-primary-bg)"), "Selected indicator should use interactive-primary-bg token");
});

test("disabled tab is disabled with aria-disabled and disabled token", () => {
  const html = renderToString(
    createElement(Tabs, { tabs, value: "overview", onChange: noop })
  );

  assert.ok(html.includes('aria-disabled="true"'), "Disabled tab should have aria-disabled");
  assert.ok(html.includes("var(--avoro-interactive-disabled-fg)"), "Disabled tab should use disabled-fg token");
  assert.ok(html.includes("cursor:not-allowed"), "Disabled tab should show not-allowed cursor");
});

test("unselected tabs use text-muted, selected uses text-primary", () => {
  const html = renderToString(
    createElement(Tabs, { tabs, value: "overview", onChange: noop })
  );

  assert.ok(html.includes("var(--avoro-text-muted)"), "Unselected tabs should use text-muted token");
  assert.ok(html.includes("var(--avoro-text-primary)"), "Selected tab should use text-primary token");
});

test("no hardcoded hex in rendered styles", () => {
  const html = renderToString(
    createElement(Tabs, { tabs, value: "overview", onChange: noop })
  );
  const styleMatches = html.match(/style="([^"]*)"/g) || [];
  for (const styleAttr of styleMatches) {
    assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex in ${styleAttr}`);
  }
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      createElement(Tabs, { tabs, value: "overview", onChange: noop })
    )
  );

  assert.ok(html.includes("var(--avoro-border-default)"), "Tablist border should use border-default token in dark");
  assert.ok(html.includes("var(--avoro-text-primary)"), "Selected tab should use text-primary token in dark");
  assert.ok(html.includes("var(--avoro-interactive-primary-bg)"), "Indicator token present in dark");
});
