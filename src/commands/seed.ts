import { loadConfig } from "../config/load.js";
import { detectProjectRoot } from "../project/detect-root.js";
import { previewSeed, type SeedPreview } from "../seeder/preview.js";
import { NoccioloError } from "../utils/errors.js";

export interface SeedOptions {
  cwd?: string;
  dryRun?: boolean;
}

export interface SeedResult {
  preview: SeedPreview;
  bankId: string;
  dryRun: boolean;
}

export async function runSeed(options: SeedOptions = {}): Promise<SeedResult> {
  const cwd = options.cwd ?? process.cwd();
  const dryRun = options.dryRun ?? false;

  if (!dryRun) {
    throw new NoccioloError(
      "Live seeding is not implemented yet.",
      "Use `nocciolo seed --dry-run` to preview durable sources that would be retained.",
    );
  }

  const projectRoot = await detectProjectRoot(cwd);
  const config = await loadConfig(projectRoot);
  const preview = await previewSeed(projectRoot);

  return {
    preview,
    bankId: config.bankId,
    dryRun: true,
  };
}

export function printSeedResult(result: SeedResult): void {
  const { preview, bankId } = result;
  console.log(`[dry-run] Seed preview for bank "${bankId}"`);
  console.log(`[dry-run] Project root: ${preview.projectRoot}`);
  console.log("");

  if (preview.sources.length === 0) {
    console.log("No durable sources found.");
    console.log(
      "Looked for README.md, AGENTS.md, docs/**, and ADR files. Add project docs, then re-run.",
    );
    return;
  }

  console.log(`Would retain from ${preview.sources.length} source(s):\n`);
  for (const source of preview.sources) {
    console.log(`  ${source.relativePath}`);
    console.log(`    kind: ${source.kind}  bytes: ${source.bytes}`);
    console.log(`    ${source.summary}`);
    console.log(`    excerpt: ${source.excerpt}`);
    console.log("");
  }

  console.log(
    "No memories were retained. Live `nocciolo seed` will call Hindsight in a later release.",
  );
}
