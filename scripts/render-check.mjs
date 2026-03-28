import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "render.yaml",
  "package.json",
  "backend/package.json",
  "backend/tsconfig.json",
  "backend/src/server.ts",
  "frontend/package.json",
  "frontend/tsconfig.json",
  "frontend/vite.config.ts",
  "frontend/index.html",
  "frontend/public/manifest.json",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const checks = [
  {
    name: "Root package-lock",
    ok: fs.existsSync(path.join(root, "package-lock.json")),
  },
  {
    name: "Backend package-lock",
    ok: fs.existsSync(path.join(root, "backend", "package-lock.json")),
  },
  {
    name: "Frontend package-lock",
    ok: fs.existsSync(path.join(root, "frontend", "package-lock.json")),
  },
];

if (missingFiles.length > 0) {
  console.error("[render-check] Missing required files:");
  for (const file of missingFiles) {
    console.error(` - ${file}`);
  }
  process.exit(1);
}

console.log("[render-check] Required files are present.");

for (const check of checks) {
  if (!check.ok) {
    console.error(`[render-check] Missing ${check.name}.`);
    process.exit(1);
  }
  console.log(`[render-check] ${check.name} found.`);
}

console.log("[render-check] Render deployment configuration looks healthy.");
