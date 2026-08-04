import { Command } from "commander";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { printConfigureResult, runConfigure } from "./commands/configure.js";
import { printInitResult, runInit } from "./commands/init.js";
import { runMcp } from "./commands/mcp.js";
import { printSeedResult, runSeed } from "./commands/seed.js";
import { formatError } from "./utils/errors.js";

function readPackageVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkgPath = join(here, "..", "package.json");
    const raw = readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name("nocciolo")
    .description(
      "Company brain config for AI agents — seed Hindsight banks from durable project knowledge",
    )
    .version(readPackageVersion());

  program
    .command("init")
    .description("Detect project root and scaffold .nocciolo/ config")
    .option("--dry-run", "Show what would be written without creating files")
    .option("--force", "Overwrite an existing .nocciolo/config.json")
    .option("--name <name>", "Project name (defaults to directory name)")
    .action(async (opts: { dryRun?: boolean; force?: boolean; name?: string }) => {
      const result = await runInit({
        dryRun: Boolean(opts.dryRun),
        force: Boolean(opts.force),
        ...(opts.name !== undefined ? { name: opts.name } : {}),
      });
      printInitResult(result);
    });

  program
    .command("configure")
    .description("Generate a Hindsight bank template into .nocciolo/")
    .option("--dry-run", "Print the template without writing files")
    .option("--force", "Overwrite an existing bank template")
    .action(async (opts: { dryRun?: boolean; force?: boolean }) => {
      const result = await runConfigure({
        dryRun: Boolean(opts.dryRun),
        force: Boolean(opts.force),
      });
      printConfigureResult(result);
    });

  program
    .command("seed")
    .description("Retain durable knowledge into the configured bank")
    .option(
      "--dry-run",
      "Preview which durable sources would be retained (required for now)",
    )
    .action(async (opts: { dryRun?: boolean }) => {
      const result = await runSeed({
        dryRun: Boolean(opts.dryRun),
      });
      printSeedResult(result);
    });

  program
    .command("mcp")
    .description("Emit MCP / agent config snippets for the project bank")
    .action(async () => {
      await runMcp();
    });

  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  console.error(formatError(error));
  process.exitCode = 1;
});
