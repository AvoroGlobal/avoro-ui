import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { JSDOM } from "jsdom";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { Tabs } from "../dist/index.mjs";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "listings", label: "Listings" },
  { value: "clients", label: "Clients" },
  { value: "archive", label: "Archive", disabled: true },
];

let dom, container, root;

before(() => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
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

function renderTabs(initial = "overview", onChange = () => {}) {
  act(() => {
    root.render(createElement(Tabs, { tabs, value: initial, onChange }));
  });
}

function tabEls() {
  return [...container.querySelectorAll('[role="tab"]')];
}

function pressKey(key) {
  act(() => {
    document.activeElement.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
    );
  });
}

function focusTab(index) {
  act(() => { tabEls()[index].focus(); });
}

test("ArrowRight moves to the next tab and activates it", () => {
  let selected = "overview";
  renderTabs("overview", (v) => { selected = v; });
  focusTab(0);
  pressKey("ArrowRight");
  assert.equal(document.activeElement.textContent, "Listings", "Focus should move right");
  assert.equal(selected, "listings", "Activation should follow focus");
});

test("ArrowLeft moves to the previous tab and activates it", () => {
  let selected = "listings";
  renderTabs("listings", (v) => { selected = v; });
  focusTab(1);
  pressKey("ArrowLeft");
  assert.equal(document.activeElement.textContent, "Overview", "Focus should move left");
  assert.equal(selected, "overview", "Activation should follow focus");
});

test("ArrowRight wraps from last enabled to first", () => {
  let selected = "clients";
  renderTabs("clients", (v) => { selected = v; });
  focusTab(2);
  pressKey("ArrowRight");
  assert.equal(document.activeElement.textContent, "Overview", "Focus should wrap to first");
  assert.equal(selected, "overview");
});

test("ArrowRight skips the disabled tab", () => {
  let selected = "clients";
  renderTabs("clients", (v) => { selected = v; });
  focusTab(2);
  // clients (idx 2) -> ArrowRight should skip archive (disabled, idx 3) and wrap to overview
  pressKey("ArrowRight");
  assert.equal(document.activeElement.textContent, "Overview", "Should skip disabled Archive");
  assert.notEqual(selected, "archive", "Disabled tab must never be activated");
});

test("Home jumps to the first enabled tab", () => {
  let selected = "clients";
  renderTabs("clients", (v) => { selected = v; });
  focusTab(2);
  pressKey("Home");
  assert.equal(document.activeElement.textContent, "Overview", "Home should jump to first");
  assert.equal(selected, "overview");
});

test("End jumps to the last ENABLED tab (skips disabled)", () => {
  let selected = "overview";
  renderTabs("overview", (v) => { selected = v; });
  focusTab(0);
  pressKey("End");
  assert.equal(document.activeElement.textContent, "Clients", "End should jump to last enabled, not disabled Archive");
  assert.equal(selected, "clients");
});

test("roving tabindex: only the selected tab is in the tab order", () => {
  renderTabs("listings");
  const indexes = tabEls().map((el) => el.getAttribute("tabindex"));
  assert.deepEqual(indexes, ["-1", "0", "-1", "-1"], "Only selected tab should have tabindex=0");
});
