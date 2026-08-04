import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { findDurableSources } from "./durable-sources.js";

describe("findDurableSources", () => {
  it("finds README, AGENTS, docs, and ADRs", async () => {
    const root = await mkdtemp(join(tmpdir(), "nocciolo-scan-"));
    await writeFile(join(root, "README.md"), "# Hello\n");
    await writeFile(join(root, "AGENTS.md"), "# Agents\n");
    await mkdir(join(root, "docs", "adr"), { recursive: true });
    await writeFile(join(root, "docs", "guide.md"), "# Guide\n");
    await writeFile(join(root, "docs", "adr", "0001-use-ts.md"), "# ADR\n");

    const sources = await findDurableSources(root);
    const paths = sources.map((s) => s.relativePath).sort();

    expect(paths).toEqual([
      "AGENTS.md",
      "README.md",
      "docs/adr/0001-use-ts.md",
      "docs/guide.md",
    ]);
  });
});
