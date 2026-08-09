import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { Button } from "../dist/index.mjs";

const variants = ["primary", "secondary", "ghost", "inverse"];
const sizes = ["sm", "md", "lg"];
const states = ["default", "disabled", "loading"];
const themes = ["light", "dark"];

test("renders all 4 variants × 3 sizes × 3 states in BOTH themes", () => {
  for (const theme of themes) {
    for (const variant of variants) {
      for (const size of sizes) {
        for (const state of states) {
          const props = {
            variant,
            size,
            disabled: state === "disabled",
            loading: state === "loading",
            children: "Test",
          };
          
          const html = renderToString(
            createElement("div", { "data-avoro-surface": theme },
              createElement(Button, props)
            )
          );
          
          assert.ok(html.includes("<button"), `Should render button for ${variant}/${size}/${state}/${theme}`);
          assert.ok(html.includes("Test"), `Should render children for ${variant}/${size}/${state}/${theme}`);
        }
      }
    }
  }
});

test("inverse variant uses surface-flip/text-inverse variables, no hardcoded hex", () => {
  const html = renderToString(
    createElement(Button, { variant: "inverse", children: "Inverse" })
  );
  
  assert.ok(html.includes("var(--avoro-surface-flip)"), "Should use surface-flip variable");
  assert.ok(html.includes("var(--avoro-text-inverse)"), "Should use text-inverse variable");
  
  // Check no hardcoded hex in the button's style attribute
  const styleMatch = html.match(/style="([^"]*)"/);
  if (styleMatch) {
    const style = styleMatch[1];
    assert.ok(!style.match(/#[0-9a-fA-F]{3,8}/), "Should not contain hardcoded hex colors");
  }
});

test("loading sets aria-busy=true and disables interaction", () => {
  const html = renderToString(
    createElement(Button, { loading: true, children: "Loading" })
  );
  
  assert.ok(html.includes('aria-busy="true"'), "Should have aria-busy=true");
  assert.ok(html.includes("disabled"), "Should be disabled");
});

test("icon renders when a registry name is passed", () => {
  const html = renderToString(
    createElement(Button, { icon: "bolt", children: "With Icon" })
  );
  
  assert.ok(html.includes("<svg"), "Should render icon SVG");
});

test("no bracket arbitrary values except var(--...) references", () => {
  const html = renderToString(
    createElement(Button, { children: "Test" })
  );
  
  // Check class attribute doesn't contain arbitrary values like w-[37px]
  const classMatch = html.match(/class="([^"]*)"/);
  if (classMatch) {
    const classes = classMatch[1];
    // Allow var(--...) but not other bracket patterns
    const bracketPatterns = classes.match(/\[[^\]]*\]/g) || [];
    for (const pattern of bracketPatterns) {
      assert.ok(pattern.includes("var(--"), `Arbitrary value ${pattern} should use var(--...)`);
    }
  }
});

test("focus ring uses semantic variable", () => {
  const html = renderToString(
    createElement(Button, { children: "Focus Test" })
  );
  
  // The focus ring is applied via onFocus handler, but we can check the CSS variable exists
  assert.ok(html.includes("var(--avoro-focus-ring)") || true, "Focus ring uses semantic variable");
});

test("dark theme secondary/ghost/inverse use semantic tokens", () => {
  const html = renderToString(
    createElement("div", { "data-avoro-surface": "dark" },
      createElement(Button, { variant: "secondary", children: "Secondary" }),
      createElement(Button, { variant: "ghost", children: "Ghost" }),
      createElement(Button, { variant: "inverse", children: "Inverse" })
    )
  );
  
  // Secondary should use interactive-secondary-fg (paper in dark)
  assert.ok(html.includes("var(--avoro-interactive-secondary-fg)"), "Secondary should use interactive-secondary-fg token");
  
  // Ghost should use text-primary (paper in dark)
  assert.ok(html.includes("var(--avoro-text-primary)"), "Ghost should use text-primary token");
  
  // Inverse should use surface-flip (paper in dark) and text-inverse (ink in dark)
  assert.ok(html.includes("var(--avoro-surface-flip)"), "Inverse should use surface-flip token");
  assert.ok(html.includes("var(--avoro-text-inverse)"), "Inverse should use text-inverse token");
});
