import { spawnSync } from "node:child_process";

const rootDir = process.cwd();

const steps = [
  {
    label: "Install backend dependencies",
    command: "npm",
    args: ["ci", "--include=dev"],
    cwd: `${rootDir}/backend`,
  },
  {
    label: "Install frontend dependencies",
    command: "npm",
    args: ["ci", "--include=dev"],
    cwd: `${rootDir}/frontend`,
  },
  {
    label: "Build backend",
    command: "npm",
    args: ["run", "build"],
    cwd: `${rootDir}/backend`,
  },
  {
    label: "Build frontend",
    command: "npm",
    args: ["run", "build"],
    cwd: `${rootDir}/frontend`,
  },
];

for (const step of steps) {
  console.log(`\n[render-build] ${step.label}`);

  const result = spawnSync(step.command, step.args, {
    cwd: step.cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\n[render-build] Render build completed successfully.");
