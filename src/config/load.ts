import { NoccioloError } from "../utils/errors.js";
import { pathExists, readJsonFile, writeJsonFile } from "../utils/fs.js";
import { configPath } from "./paths.js";
import { NoccioloConfig, NoccioloConfigSchema } from "./schema.js";

export async function loadConfig(projectRoot: string): Promise<NoccioloConfig> {
  const path = configPath(projectRoot);
  if (!(await pathExists(path))) {
    throw new NoccioloError(
      `No Nocciolo config found at ${path}`,
      "Run `nocciolo init` from your project root first.",
    );
  }

  const raw = await readJsonFile<unknown>(path);
  const parsed = NoccioloConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new NoccioloError(
      `Invalid config at ${path}: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
      "Fix the config or re-run `nocciolo init --force`.",
    );
  }
  return parsed.data;
}

export async function saveConfig(
  projectRoot: string,
  config: NoccioloConfig,
  dryRun: boolean,
): Promise<void> {
  await writeJsonFile(configPath(projectRoot), config, dryRun);
}

export async function configExists(projectRoot: string): Promise<boolean> {
  return pathExists(configPath(projectRoot));
}
