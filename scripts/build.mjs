import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const tscJs = path.join(root, "node_modules", "typescript", "bin", "tsc");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

execFileSync(
  process.execPath,
  [
    tscJs,
    "-p",
    "tsconfig.json",
    "--outDir",
    "dist/esm",
    "--declarationDir",
    "dist/types",
  ],
  {
    cwd: root,
    stdio: "inherit",
  },
);

// Copy .d.ts files to dist root
for (const file of fs.readdirSync(path.join(dist, "types"))) {
  if (file.endsWith(".d.ts")) {
    fs.copyFileSync(
      path.join(dist, "types", file),
      path.join(dist, file)
    );
  }
}

// Write ESM and CJS entry points
fs.writeFileSync(
  path.join(dist, "index.mjs"),
  `export * from "./esm/index.js";\n`,
  "utf8",
);

fs.writeFileSync(
  path.join(dist, "index.cjs"),
  `module.exports = require("./esm/index.js");\n`,
  "utf8",
);

// Clean up types directory
fs.rmSync(path.join(dist, "types"), { recursive: true, force: true });

console.log("Build complete");
