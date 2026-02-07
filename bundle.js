#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const viteBin = path.join(rootDir, "node_modules", ".bin", "vite");

const bundleRoots = [
  "packages/core",
  "packages/icons",
  "packages/inputs",
  "packages/sliders",
  "packages/colors",
  "packages/menus",
  "packages/navigation",
  "packages/editors",
  "packages/layout",
  "packages/markdown",
  "packages/three",
  "apps/circuits",
  "apps/todo",
];

async function bundle(bundleRoot) {
  return new Promise((resolve, reject) => {
    console.log(`\nBundling ${bundleRoot}...`);
    const proc = spawn(
      viteBin,
      ["build", "--config", "vite.bundle.config.ts"],
      {
        env: { ...process.env, BUNDLE_ROOT: bundleRoot },
        stdio: "inherit",
        cwd: rootDir,
      },
    );
    proc.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Failed to bundle ${bundleRoot}`)),
    );
  });
}

for (const root of bundleRoots) {
  await bundle(root);
}
