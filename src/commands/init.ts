import { configExists, saveConfig } from "../config/load.js";
import { configPath, noccioloDir } from "../config/paths.js";
import { createDefaultConfig } from "../config/schema.js";
import {
  defaultProjectName,
  detectProjectRoot,
} from "../project/detect-root.js";
import { NoccioloError } from "../utils/errors.js";
import { ensureDir } from "../utils/fs.js";

export interface InitOptions {
  cwd?: string;
  dryRun?: boolean;
  force?: boolean;
  name?: string;
}

export interface InitResult {
  projectRoot: string;
  configPath: string;
  created: boolean;
  dryRun: boolean;
}

export async function runInit(options: InitOptions = {}): Promise<InitResult> {
  const cwd = options.cwd ?? process.cwd();
  const dryRun = options.dryRun ?? false;
  const force = options.force ?? false;

  const projectRoot = await detectProjectRoot(cwd);
  const dir = noccioloDir(projectRoot);
  const path = configPath(projectRoot);
  const exists = await configExists(projectRoot);

  if (exists && !force) {
    throw new NoccioloError(
      `Nocciolo is already initialized at ${path}`,
      "Use --force to overwrite, or run `nocciolo configure` next.",
    );
  }

  const name = options.name ?? defaultProjectName(projectRoot);
  const config = createDefaultConfig({
    name,
    root: ".",
  });

  if (!dryRun) {
    await ensureDir(dir);
  }

  await saveConfig(projectRoot, config, dryRun);

  return {
    projectRoot,
    configPath: path,
    created: !exists || force,
    dryRun,
  };
}

export function printInitResult(result: InitResult): void {
  const prefix = result.dryRun ? "[dry-run] " : "";
  console.log(`${prefix}Initialized Nocciolo in ${result.projectRoot}`);
  console.log(`${prefix}Config: ${result.configPath}`);
  if (result.dryRun) {
    console.log("No files were written.");
  } else {
    console.log(
      "Next: run `nocciolo configure` to generate a Hindsight bank template.",
    );
  }
}
