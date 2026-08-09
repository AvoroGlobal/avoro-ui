import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";
import { Modal } from "../dist/index.mjs";

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

test("modal portals into document.body, not its React parent", () => {
  act(() => {
    root.render(
      createElement("div", { id: "react-parent" },
        createElement(Modal, { open: true, onClose: () => {}, title: "Archive", children: "Body text" })
      )
    );
  });

  const dialog = document.querySelector('[role="dialog"]');
  assert.ok(dialog, "Dialog should be in the document");
  // The dialog must NOT be inside the React render container — it portals to body
  assert.ok(!container.contains(dialog), "Dialog should not render inside its React parent");
  assert.equal(dialog.parentElement, document.body, "Dialog should be a direct child of document.body");
});

test("closed modal portals nothing", () => {
  act(() => {
    root.render(
      createElement(Modal, { open: false, onClose: () => {}, title: "Hidden", children: "x" })
    );
  });

  assert.equal(document.querySelector('[role="dialog"]'), null, "Closed modal should not portal");
});

test("Escape key closes (focus trap + escape still work through the portal)", () => {
  let closed = false;
  act(() => {
    root.render(
      createElement(Modal, { open: true, onClose: () => { closed = true; }, title: "Confirm", children: createElement("button", null, "OK") })
    );
  });

  act(() => {
    document.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
    );
  });
  assert.ok(closed, "Escape should call onClose");
});
