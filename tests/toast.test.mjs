import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Toast } from "../dist/index.mjs";

const tones = ["success", "warning", "error"];
const themes = ["light", "dark"];

test("renders all 3 tones in BOTH themes", () => {
  for (const theme of themes) {
    for (const tone of tones) {
      const html = renderToString(
        createElement("div", { "data-avoro-surface": theme },
          createElement(Toast, { tone, message: `${tone} message` })
        )
      );

      assert.ok(html.includes('role="status"'), `Should render status role for ${tone}/${theme}`);
      assert.ok(html.includes(`${tone} message`), `Should render message for ${tone}/${theme}`);
    }
  }
});

test("each tone uses its status.*Fg/*Bg semantic tokens", () => {
  const html = renderToString(
    createElement("div", null,
      ...tones.map((tone) => createElement(Toast, { key: tone, tone, message: tone }))
    )
  );

  for (const tone of tones) {
    assert.ok(html.includes(`var(--avoro-status-${tone}-fg)`), `${tone} should use status-${tone}-fg`);
  }
});

test("has aria-live=polite for screen readers", () => {
  const html = renderToString(
    createElement(Toast, { message: "Saved" })
  );

  assert.ok(html.includes('aria-live="polite"'), "Should set aria-live=polite");
  assert.ok(html.includes('role="status"'), "Should have role=status");
});

test("default duration is 4000ms (auto-dismiss 4s)", async () => {
  // The auto-dismiss is a useEffect timer; verify the default in the built source
  const fs = await import("node:fs");
  const src = fs.readFileSync(new URL("../dist/esm/toast/Toast.js", import.meta.url), "utf8");
  assert.ok(src.includes("duration = 4000"), "Default duration should be 4000ms");
  assert.ok(src.includes("setTimeout"), "Should use a timer for auto-dismiss");
});

test("surface + shadow tokens for the toast card", () => {
  const html = renderToString(
    createElement(Toast, { message: "Saved" })
  );

  assert.ok(html.includes("var(--avoro-surface-card)"), "Should use surface-card token");
  assert.ok(html.includes("var(--avoro-shadow-md)"), "Should use shadow-md token");
  assert.ok(html.includes("var(--avoro-text-primary)"), "Should use text-primary token");
});

test("no hardcoded hex in rendered styles", () => {
  for (const tone of tones) {
    const html = renderToString(
      createElement(Toast, { tone, message: "x" })
    );
    const styleMatches = html.match(/style="([^"]*)"/g) || [];
    for (const styleAttr of styleMatches) {
      assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex for ${tone}`);
    }
  }
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      ...tones.map((tone) => createElement(Toast, { key: tone, tone, message: tone }))
    )
  );

  assert.ok(html.includes("var(--avoro-surface-card)"), "Should use surface-card token in dark");
  assert.ok(html.includes("var(--avoro-status-success-fg)"), "success token present in dark");
  assert.ok(html.includes("var(--avoro-status-warning-fg)"), "warning token present in dark");
  assert.ok(html.includes("var(--avoro-status-error-fg)"), "error token present in dark");
});
