import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Table } from "../dist/index.mjs";

const columns = [{ key: "agent", header: "Agent" }];

test("error state without onRetry renders no retry button (no breaking change)", () => {
  const html = renderToString(
    createElement(Table, { columns, rows: [], error: "Failed to load" })
  );

  assert.ok(!html.includes("Try again"), "No retry button without onRetry");
  assert.ok(html.includes("Failed to load"), "Error message still renders");
});

test("error state with onRetry renders a Try again secondary button", () => {
  const html = renderToString(
    createElement(Table, { columns, rows: [], error: "Failed to load", onRetry: () => {} })
  );

  assert.ok(html.includes("Try again"), "Retry button should render");
  assert.ok(html.includes("<button"), "Should render a Button element");
  assert.ok(html.includes("var(--avoro-interactive-secondary-fg)"), "Should be a secondary Button");
});

// DOM test: the retry button actually calls onRetry
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

test("clicking Try again calls onRetry", () => {
  let calls = 0;
  act(() => {
    root.render(
      createElement(Table, { columns, rows: [], error: "Failed to load", onRetry: () => { calls++; } })
    );
  });

  const button = [...container.querySelectorAll("button")].find((b) => b.textContent === "Try again");
  assert.ok(button, "Try again button should exist");

  act(() => {
    button.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  assert.equal(calls, 1, "onRetry should be called once");
});
