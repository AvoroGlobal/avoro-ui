import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Wordmark } from "../dist/index.mjs";

const lockups = ["horizontal", "stacked", "mark"];
const themes = ["light", "dark", "onBrand"];

test("each lockup renders in each theme", () => {
  for (const lockup of lockups) {
    for (const theme of themes) {
      const html = renderToString(
        createElement(Wordmark, { lockup, theme, size: 24 })
      );
      assert.ok(html.includes('aria-label="avoro/"'), `Should render for ${lockup}/${theme}`);
      assert.ok(html.includes("/"), `Should render the slash for ${lockup}/${theme}`);
    }
  }
});

test("horizontal lockup renders the full 'avoro/' wordmark", () => {
  const html = renderToString(createElement(Wordmark, { lockup: "horizontal" }));
  assert.ok(html.includes("avoro"), "Should render 'avoro'");
  assert.ok(html.includes("/"), "Should render the slash");
});

test("mark lockup renders only the slash", () => {
  const html = renderToString(createElement(Wordmark, { lockup: "mark" }));
  assert.ok(html.includes("/"), "Should render the slash");
  assert.ok(!html.includes("avoro<"), "Should not render the 'avoro' text");
});

test("dark theme: paper text + chartreuse slash (kit on-ink rule)", () => {
  const html = renderToString(createElement(Wordmark, { theme: "dark" }));
  assert.ok(html.includes("color:var(--avoro-paper)"), "Text should be paper on dark");
  assert.ok(html.includes("color:var(--avoro-chartreuse)"), "Slash should be chartreuse on dark");
});

test("light theme: ink text + ink slash (kit on-paper rule)", () => {
  const html = renderToString(createElement(Wordmark, { theme: "light" }));
  assert.ok(html.includes("color:var(--avoro-ink)"), "Text and slash should be ink on light");
});

test("onBrand theme: all ink (for chartreuse backgrounds)", () => {
  const html = renderToString(createElement(Wordmark, { theme: "onBrand" }));
  assert.ok(html.includes("color:var(--avoro-ink)"), "Should be ink on brand");
  assert.ok(!html.includes("color:var(--avoro-chartreuse)"), "No chartreuse on a chartreuse bg");
});

test("uses Geist Mono Medium + tracking -0.02em (locked spec)", () => {
  const html = renderToString(createElement(Wordmark, {}));
  assert.ok(html.includes("var(--avoro-font-mono)"), "Should use the mono font token");
  assert.ok(html.includes("font-weight:500"), "Should be Medium (500)");
  assert.ok(html.includes("letter-spacing:-0.02em"), "Should use tracking -0.02em");
});

test("size below the kit minimum warns", () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(String(msg));
  try {
    renderToString(createElement(Wordmark, { lockup: "horizontal", size: 12 }));
  } finally {
    console.warn = originalWarn;
  }
  assert.ok(
    warnings.some((w) => w.includes("below the kit minimum")),
    "Should warn when size is below the kit minimum",
  );
});

test("size at or above the kit minimum does not warn", () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(String(msg));
  try {
    renderToString(createElement(Wordmark, { lockup: "horizontal", size: 16 }));
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(warnings.length, 0, "Should not warn at the kit minimum");
});

test("no hardcoded hex in rendered styles", () => {
  for (const theme of themes) {
    const html = renderToString(createElement(Wordmark, { theme }));
    const styleMatches = html.match(/style="([^"]*)"/g) || [];
    for (const styleAttr of styleMatches) {
      assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex for ${theme}`);
    }
  }
});
