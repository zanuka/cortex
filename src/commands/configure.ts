import { loadConfig } from "../config/load.js";
import { bankTemplatePath, hindsightDir } from "../config/paths.js";
import { detectProjectRoot } from "../project/detect-root.js";
import { generateHindsightBankTemplate } from "../providers/hindsight/template.js";
import type { HindsightBankTemplate } from "../providers/hindsight/types.js";
import { NoccioloError } from "../utils/errors.js";
import { ensureDir, pathExists, writeJsonFile } from "../utils/fs.js";

export interface ConfigureOptions {
  cwd?: string;
  dryRun?: boolean;
  force?: boolean;
}

export interface ConfigureResult {
  projectRoot: string;
  bankId: string;
  templatePath: string;
  template: HindsightBankTemplate;
  dryRun: boolean;
  wrote: boolean;
}

export async function runConfigure(
  options: ConfigureOptions = {},
): Promise<ConfigureResult> {
  const cwd = options.cwd ?? process.cwd();
  const dryRun = options.dryRun ?? false;
  const force = options.force ?? false;

  const projectRoot = await detectProjectRoot(cwd);
  const config = await loadConfig(projectRoot);
  const templatePath = bankTemplatePath(projectRoot);
  const exists = await pathExists(templatePath);

  if (exists && !force && !dryRun) {
    throw new NoccioloError(
      `Bank template already exists at ${templatePath}`,
      "Use --force to overwrite, or `nocciolo configure --dry-run` to preview.",
    );
  }

  const template = generateHindsightBankTemplate({
    projectName: config.name,
    bankId: config.bankId,
  });

  if (!dryRun) {
    await ensureDir(hindsightDir(projectRoot));
  }

  await writeJsonFile(templatePath, template, dryRun);

  return {
    projectRoot,
    bankId: config.bankId,
    templatePath,
    template,
    dryRun,
    wrote: !dryRun,
  };
}

export function printConfigureResult(result: ConfigureResult): void {
  const prefix = result.dryRun ? "[dry-run] " : "";

  if (result.dryRun) {
    console.log(`${prefix}Would write bank template for bank "${result.bankId}"`);
    console.log(`${prefix}Path: ${result.templatePath}`);
    console.log(JSON.stringify(result.template, null, 2));
    console.log("No files were written.");
    return;
  }

  console.log(`${prefix}Wrote bank template for bank "${result.bankId}"`);
  console.log(`${prefix}Path: ${result.templatePath}`);
  console.log(
    `Extraction mode: ${result.template.bank.retain_extraction_mode}; observations: ${result.template.bank.enable_observations ? "on" : "off"}`,
  );
  console.log(
    `Mental models: ${result.template.mental_models.length}, directives: ${result.template.directives.length}`,
  );
  console.log(
    "Next: run `nocciolo seed --dry-run` to preview durable sources, or import the template into Hindsight.",
  );
}
