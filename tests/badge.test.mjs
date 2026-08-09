import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Badge } from "../dist/index.mjs";

const tones = ["neutral", "success", "warning", "error", "brand"];
const themes = ["light", "dark"];

test("renders all 5 tones in BOTH themes", () => {
  for (const theme of themes) {
    for (const tone of tones) {
      const html = renderToString(
        createElement("div", { "data-avoro-surface": theme },
          createElement(Badge, { tone, children: tone })
        )
      );

      assert.ok(html.includes("<span"), `Should render span for ${tone}/${theme}`);
      assert.ok(html.includes(tone), `Should render children for ${tone}/${theme}`);
    }
  }
});

test("status tones use the status.*Fg/*Bg semantic tokens", () => {
  const html = renderToString(
    createElement("div", null,
      createElement(Badge, { tone: "success", children: "s" }),
      createElement(Badge, { tone: "warning", children: "w" }),
      createElement(Badge, { tone: "error", children: "e" })
    )
  );

  for (const tone of ["success", "warning", "error"]) {
    assert.ok(html.includes(`var(--avoro-status-${tone}-bg)`), `${tone} should use status-${tone}-bg`);
    assert.ok(html.includes(`var(--avoro-status-${tone}-fg)`), `${tone} should use status-${tone}-fg`);
  }
});

test("brand tone uses chartreuse + text-on-brand", () => {
  const html = renderToString(
    createElement(Badge, { tone: "brand", children: "New" })
  );

  assert.ok(html.includes("var(--avoro-chartreuse)"), "Brand should use chartreuse token");
  assert.ok(html.includes("var(--avoro-text-on-brand)"), "Brand should use text-on-brand token");
});

test("neutral tone uses surface-subtle + text-secondary", () => {
  const html = renderToString(
    createElement(Badge, { tone: "neutral", children: "Draft" })
  );

  assert.ok(html.includes("var(--avoro-surface-subtle)"), "Neutral should use surface-subtle token");
  assert.ok(html.includes("var(--avoro-text-secondary)"), "Neutral should use text-secondary token");
});

test("uses badge component tokens for sizing", () => {
  const html = renderToString(
    createElement(Badge, { children: "Size" })
  );

  assert.ok(html.includes("var(--avoro-component-badge-height)"), "Should use badge-height token");
  assert.ok(html.includes("var(--avoro-component-badge-padding-x)"), "Should use badge-padding-x token");
  assert.ok(html.includes("var(--avoro-component-badge-radius)"), "Should use badge-radius token");
});

test("no hardcoded hex in rendered styles", () => {
  for (const tone of tones) {
    const html = renderToString(
      createElement(Badge, { tone, children: "x" })
    );
    const styleMatch = html.match(/style="([^"]*)"/);
    if (styleMatch) {
      assert.ok(!styleMatch[1].match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex for ${tone}`);
    }
  }
});

test("dark theme renders all tones with semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      ...tones.map((tone) => createElement(Badge, { key: tone, tone, children: tone }))
    )
  );

  // Every tone's tokens appear in the dark-theme render
  assert.ok(html.includes("var(--avoro-status-success-fg)"), "success token present in dark");
  assert.ok(html.includes("var(--avoro-status-warning-fg)"), "warning token present in dark");
  assert.ok(html.includes("var(--avoro-status-error-fg)"), "error token present in dark");
  assert.ok(html.includes("var(--avoro-chartreuse)"), "brand token present in dark");
  assert.ok(html.includes("var(--avoro-surface-subtle)"), "neutral token present in dark");
});
