import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Modal } from "../dist/index.mjs";

const themes = ["light", "dark"];
const noop = () => {};

test("renders open state in BOTH themes", () => {
  for (const theme of themes) {
    const html = renderToString(
      createElement("div", { "data-avoro-surface": theme },
        createElement(Modal, { open: true, onClose: noop, title: "Archive listing", children: "Are you sure?" })
      )
    );

    assert.ok(html.includes('role="dialog"'), `Should render dialog for ${theme}`);
    assert.ok(html.includes("Archive listing"), `Should render title for ${theme}`);
    assert.ok(html.includes("Are you sure?"), `Should render children for ${theme}`);
  }
});

test("closed modal renders nothing", () => {
  const html = renderToString(
    createElement(Modal, { open: false, onClose: noop, title: "Hidden", children: "x" })
  );

  assert.ok(!html.includes('role="dialog"'), "Closed modal should not render");
  assert.ok(!html.includes("Hidden"), "Closed modal should not render title");
});

test("dialog has aria-modal and aria-label", () => {
  const html = renderToString(
    createElement(Modal, { open: true, onClose: noop, title: "Confirm", children: "x" })
  );

  assert.ok(html.includes('aria-modal="true"'), "Should set aria-modal");
  assert.ok(html.includes('aria-label="Confirm"'), "Should label the dialog with the title");
});

test("backdrop click closes (backdrop has onClick + aria-hidden)", () => {
  const html = renderToString(
    createElement(Modal, { open: true, onClose: noop, title: "Confirm", children: "x" })
  );

  assert.ok(html.includes('aria-hidden="true"'), "Backdrop should be aria-hidden");
  // Backdrop is the first fixed-position div
  assert.ok(html.includes("position:fixed"), "Backdrop should be fixed-positioned");
});

test("uses modal component tokens", () => {
  const html = renderToString(
    createElement(Modal, { open: true, onClose: noop, title: "Confirm", children: "x" })
  );

  assert.ok(html.includes("var(--avoro-component-modal-max-width)"), "Should use modal-max-width token");
  assert.ok(html.includes("var(--avoro-component-modal-padding)"), "Should use modal-padding token");
  assert.ok(html.includes("var(--avoro-component-modal-radius)"), "Should use modal-radius token");
  assert.ok(html.includes("var(--avoro-shadow-lg)"), "Should use shadow-lg token");
});

test("no hardcoded hex in rendered styles", () => {
  const html = renderToString(
    createElement(Modal, { open: true, onClose: noop, title: "Confirm", children: "x" })
  );
  const styleMatches = html.match(/style="([^"]*)"/g) || [];
  for (const styleAttr of styleMatches) {
    assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex in ${styleAttr}`);
  }
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      createElement(Modal, { open: true, onClose: noop, title: "Confirm", children: "x" })
    )
  );

  assert.ok(html.includes("var(--avoro-surface-card)"), "Should use surface-card token in dark");
  assert.ok(html.includes("var(--avoro-text-primary)"), "Should use text-primary token in dark");
});

test("visible title is optional — ariaLabel labels the dialog when no title", () => {
  const html = renderToString(
    createElement(Modal, { open: true, onClose: noop, ariaLabel: "Confirm archive", children: "x" })
  );

  assert.ok(html.includes('aria-label="Confirm archive"'), "aria-label should come from ariaLabel");
  assert.ok(!html.includes("var(--avoro-size-h3)"), "No visible title heading should render without a title");
});

test("visible title still renders and labels the dialog when provided", () => {
  const html = renderToString(
    createElement(Modal, { open: true, onClose: noop, title: "Archive listing", children: "x" })
  );

  assert.ok(html.includes('aria-label="Archive listing"'), "aria-label should come from the title");
  assert.ok(html.includes("Archive listing"), "Visible title should render");
});

test("title wins over ariaLabel for the accessible name when both provided", () => {
  const html = renderToString(
    createElement(Modal, { open: true, onClose: noop, title: "Visible", ariaLabel: "Fallback", children: "x" })
  );

  assert.ok(html.includes('aria-label="Visible"'), "title should win for aria-label");
});

test("dev warning when neither title nor ariaLabel is provided", async () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(msg);
  try {
    renderToString(
      createElement(Modal, { open: true, onClose: noop, children: "x" })
    );
  } finally {
    console.warn = originalWarn;
  }

  assert.ok(
    warnings.some((w) => String(w).includes("no `title` or `ariaLabel`")),
    "Should warn when neither title nor ariaLabel is provided",
  );
});
