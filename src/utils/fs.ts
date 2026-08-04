import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function readJsonFile<T>(path: string): Promise<T> {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(
  path: string,
  value: unknown,
  dryRun: boolean,
): Promise<void> {
  if (dryRun) {
    return;
  }
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeTextFile(
  path: string,
  content: string,
  dryRun: boolean,
): Promise<void> {
  if (dryRun) {
    return;
  }
  await writeFile(path, content, "utf8");
}
