import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";
import { Input } from "../dist/index.mjs";

let dom, container, root;

before(() => {
  dom = new JSDOM(
    '<!doctype html><html><head><style>body { font-family: "Custom Body Font", serif; }</style></head><body></body></html>',
    { url: "http://localhost" }
  );
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

after(() => {
  act(() => root.unmount());
  dom.window.close();
});

test("input element inherits the body font stack (font-family: inherit)", () => {
  act(() => {
    root.render(createElement(Input, { label: "Email" }));
  });

  const input = container.querySelector("input");
  assert.ok(input, "Input should render");

  // The inline style must be `inherit`, not a token or UA default — so the
  // computed value follows the surrounding (body) font stack.
  assert.equal(input.style.fontFamily, "inherit", "Input should set font-family: inherit");

  const bodyFont = dom.window.getComputedStyle(document.body).fontFamily;
  assert.ok(bodyFont.includes("Custom Body Font"), `Body stack should be the custom font, got ${bodyFont}`);
});
