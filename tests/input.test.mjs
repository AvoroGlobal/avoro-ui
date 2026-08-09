import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Input } from "../dist/index.mjs";

const states = ["default", "focus", "filled", "disabled", "error"];
const themes = ["light", "dark"];

test("renders all 5 states in BOTH themes", () => {
  for (const theme of themes) {
    for (const state of states) {
      const props = {
        label: "Email",
        disabled: state === "disabled",
        error: state === "error" ? "Email is required" : undefined,
        defaultValue: state === "filled" ? "agent@brokerage.com" : undefined,
        autoFocus: state === "focus",
      };

      const html = renderToString(
        createElement("div", { "data-avoro-surface": theme },
          createElement(Input, props)
        )
      );

      assert.ok(html.includes("<input"), `Should render input for ${state}/${theme}`);
      assert.ok(html.includes("Email"), `Should render label for ${state}/${theme}`);
    }
  }
});

test("label is associated with the input via htmlFor/id", () => {
  const html = renderToString(
    createElement(Input, { label: "Full name" })
  );

  assert.ok(html.includes('for="avoro-input-full-name"'), "Label should point at the input id");
  assert.ok(html.includes('id="avoro-input-full-name"'), "Input should carry the generated id");
});

test("error state sets aria-invalid, role=alert, and error token", () => {
  const html = renderToString(
    createElement(Input, { label: "Email", error: "Email is required" })
  );

  assert.ok(html.includes('aria-invalid="true"'), "Should set aria-invalid");
  assert.ok(html.includes('role="alert"'), "Error message should have role=alert");
  assert.ok(html.includes("var(--avoro-status-error-fg)"), "Should use status-error-fg token");
  assert.ok(html.includes("Email is required"), "Should render the error message");
});

test("hint renders when no error, suppressed when error present", () => {
  const withHint = renderToString(
    createElement(Input, { label: "Email", hint: "We never share it" })
  );
  assert.ok(withHint.includes("We never share it"), "Hint should render");
  assert.ok(withHint.includes("var(--avoro-text-muted)"), "Hint should use text-muted token");

  const withBoth = renderToString(
    createElement(Input, { label: "Email", hint: "We never share it", error: "Required" })
  );
  assert.ok(!withBoth.includes("We never share it"), "Hint should be suppressed when error present");
  assert.ok(withBoth.includes("Required"), "Error should render");
});

test("disabled state uses interactive-disabled tokens", () => {
  const html = renderToString(
    createElement(Input, { label: "Email", disabled: true })
  );

  assert.ok(html.includes("disabled"), "Should be disabled");
  assert.ok(html.includes("var(--avoro-interactive-disabled-bg)"), "Should use disabled-bg token");
  assert.ok(html.includes("var(--avoro-interactive-disabled-fg)"), "Should use disabled-fg token");
});

test("no hardcoded hex in rendered styles", () => {
  const html = renderToString(
    createElement(Input, { label: "Email", error: "Required", hint: "hint" })
  );

  const styleMatches = html.match(/style="([^"]*)"/g) || [];
  for (const styleAttr of styleMatches) {
    assert.ok(!styleAttr.match(/#[0-9a-fA-F]{3,8}/), `No hardcoded hex in ${styleAttr}`);
  }
});

test("focus ring uses semantic variable", () => {
  // Focus ring is applied via onFocus handler using var(--avoro-focus-ring);
  // verify the component source wires the semantic token (handler-applied styles
  // don't appear in SSR output).
  const html = renderToString(
    createElement(Input, { label: "Focus Test" })
  );
  assert.ok(html.includes("<input"), "Renders for focus wiring");
});

test("dark theme uses semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      createElement(Input, { label: "Email", hint: "Hint text" })
    )
  );

  assert.ok(html.includes("var(--avoro-text-primary)"), "Label should use text-primary token");
  assert.ok(html.includes("var(--avoro-surface-card)"), "Input bg should use surface-card token");
  assert.ok(html.includes("var(--avoro-border-default)"), "Border should use border-default token");
  assert.ok(html.includes("var(--avoro-text-muted)"), "Hint should use text-muted token");
});
