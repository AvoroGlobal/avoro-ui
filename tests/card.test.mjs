import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Card } from "../dist/index.mjs";

const themes = ["light", "dark"];

test("renders default and interactive in BOTH themes", () => {
  for (const theme of themes) {
    for (const interactive of [false, true]) {
      const html = renderToString(
        createElement("div", { "data-avoro-surface": theme },
          createElement(Card, { interactive, children: "Card content" })
        )
      );

      assert.ok(html.includes("Card content"), `Should render children for interactive=${interactive}/${theme}`);
      assert.ok(html.includes("var(--avoro-surface-card)"), `Should use surface-card token for ${theme}`);
    }
  }
});

test("default card uses card component tokens", () => {
  const html = renderToString(
    createElement(Card, { children: "x" })
  );

  assert.ok(html.includes("var(--avoro-component-card-padding)"), "Should use card-padding token");
  assert.ok(html.includes("var(--avoro-component-card-radius)"), "Should use card-radius token");
  assert.ok(html.includes("var(--avoro-component-card-border-width)"), "Should use card-border-width token");
  assert.ok(html.includes("var(--avoro-border-default)"), "Should use border-default token");
});

test("padding prop overrides the token", () => {
  const html = renderToString(
    createElement(Card, { padding: "var(--avoro-space-6)", children: "x" })
  );

  assert.ok(html.includes("padding:var(--avoro-space-6)"), "Custom padding should win");
  assert.ok(!html.includes("padding:var(--avoro-component-card-padding)"), "Token padding should be overridden");
});

test("interactive card is focusable with role=button", () => {
  const html = renderToString(
    createElement(Card, { interactive: true, children: "x" })
  );

  assert.ok(html.includes('tabindex="0"'), "Interactive card should be focusable");
  assert.ok(html.includes('role="button"'), "Interactive card should have role=button");
  assert.ok(html.includes("cursor:pointer"), "Interactive card should show pointer cursor");
});

test("non-interactive card has no tabindex or button role", () => {
  const html = renderToString(
    createElement(Card, { children: "x" })
  );

  assert.ok(!html.includes("tabindex"), "Default card should not be focusable");
  assert.ok(!html.includes('role="button"'), "Default card should not have button role");
});

test("no hardcoded hex in rendered styles", () => {
  for (const interactive of [false, true]) {
    const html = renderToString(
      createElement(Card, { interactive, children: "x" })
    );
    const styleMatch = html.match(/style="([^"]*)"/);
    if (styleMatch) {
      assert.ok(!styleMatch[1].match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex for interactive=${interactive}`);
    }
  }
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      createElement(Card, { interactive: true, children: "x" })
    )
  );

  assert.ok(html.includes("var(--avoro-surface-card)"), "Should use surface-card token in dark");
  assert.ok(html.includes("var(--avoro-text-primary)"), "Should use text-primary token in dark");
  assert.ok(html.includes("var(--avoro-border-default)"), "Should use border-default token in dark");
});
