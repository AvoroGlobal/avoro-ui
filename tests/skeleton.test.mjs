import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Skeleton } from "../dist/index.mjs";

const themes = ["light", "dark"];
const shapes = ["text", "card", "avatar"];

test("renders all 3 shapes in BOTH themes", () => {
  for (const theme of themes) {
    for (const shape of shapes) {
      const html = renderToString(
        createElement("div", { "data-avoro-surface": theme },
          createElement(Skeleton, { shape })
        )
      );

      assert.ok(html.includes("avoro-skeleton-pulse"), `Should render shimmer for ${shape}/${theme}`);
      assert.ok(html.includes('aria-hidden="true"'), `Should be aria-hidden for ${shape}/${theme}`);
    }
  }
});

test("shimmer uses duration-base + easing-standard tokens", () => {
  const html = renderToString(createElement(Skeleton, {}));

  assert.ok(html.includes("var(--avoro-duration-base)"), "Shimmer should use duration-base token");
  assert.ok(html.includes("var(--avoro-easing-standard)"), "Shimmer should use easing-standard token");
});

test("fill uses surface-subtle token", () => {
  const html = renderToString(createElement(Skeleton, {}));

  assert.ok(html.includes("var(--avoro-surface-subtle)"), "Fill should use surface-subtle token");
});

test("text shape renders `lines` lines, last one shorter", () => {
  const html = renderToString(
    createElement(Skeleton, { shape: "text", lines: 4 })
  );

  // 4 line blocks
  const lineCount = (html.match(/height:12px/g) || []).length;
  assert.equal(lineCount, 4, "Should render 4 lines");
  assert.ok(html.includes("width:60%"), "Last line should be the shorter paragraph tail");
});

test("single text line renders full width", () => {
  const html = renderToString(
    createElement(Skeleton, { shape: "text", lines: 1 })
  );

  const lineCount = (html.match(/height:12px/g) || []).length;
  assert.equal(lineCount, 1, "Should render 1 line");
  assert.ok(!html.includes("width:60%"), "Single line should not be shortened");
});

test("avatar shape is a pill-radius circle", () => {
  const html = renderToString(
    createElement(Skeleton, { shape: "avatar" })
  );

  assert.ok(html.includes("var(--avoro-radius-pill)"), "Avatar should use radius-pill token");
});

test("card shape uses card-radius token", () => {
  const html = renderToString(
    createElement(Skeleton, { shape: "card" })
  );

  assert.ok(html.includes("var(--avoro-component-card-radius)"), "Card should use card-radius token");
});

test("no hardcoded hex in rendered styles", () => {
  for (const shape of shapes) {
    const html = renderToString(createElement(Skeleton, { shape }));
    const styleMatches = html.match(/style="([^"]*)"/g) || [];
    for (const styleAttr of styleMatches) {
      assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex for ${shape}`);
    }
  }
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      ...shapes.map((shape) => createElement(Skeleton, { key: shape, shape }))
    )
  );

  assert.ok(html.includes("var(--avoro-surface-subtle)"), "Fill token present in dark");
  assert.ok(html.includes("var(--avoro-duration-base)"), "Duration token present in dark");
  assert.ok(html.includes("var(--avoro-easing-standard)"), "Easing token present in dark");
});
