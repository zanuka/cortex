import { dirname, join, parse } from "node:path";
import { pathExists } from "../utils/fs.js";

const MARKERS = [".git", "package.json", "pnpm-workspace.yaml", "Cargo.toml", "go.mod"];

export async function detectProjectRoot(
  startDir: string = process.cwd(),
): Promise<string> {
  let current = startDir;

  while (true) {
    for (const marker of MARKERS) {
      if (await pathExists(join(current, marker))) {
        return current;
      }
    }

    const parent = dirname(current);
    if (parent === current) {
      return startDir;
    }
    current = parent;
  }
}

export function defaultProjectName(root: string): string {
  return parse(root).base || "project";
}
