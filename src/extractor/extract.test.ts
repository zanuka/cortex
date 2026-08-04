import { extractFromSource } from "./extract.js";
import type { DurableSource } from "../scanner/durable-sources.js";

function source(
  relativePath: string,
  kind: DurableSource["kind"],
): DurableSource {
  return {
    absolutePath: `/tmp/${relativePath}`,
    relativePath,
    kind,
  };
}

describe("extractFromSource", () => {
  it("keeps ADR documents as decision facts", () => {
    const content = `# ADR 0001: Use TypeScript

## Decision

We will use TypeScript for the CLI.

## Consequences

Stronger typing for config schemas.
`;
    const result = extractFromSource(source("docs/adr/0001.md", "adr"), content, {
      commit: "abc123",
    });
    expect(result.facts).toHaveLength(1);
    expect(result.facts[0]?.knowledgeKind).toBe("decision");
    expect(result.facts[0]?.provenance.commit).toBe("abc123");
    expect(result.facts[0]?.id).toContain("docs/adr/0001.md");
  });

  it("extracts high-signal README sections and skips install noise", () => {
    const content = `# Nocciolo

Company brain config for AI agents.

## Goal

Seed Hindsight memory banks from durable project docs and architecture decisions.

## Quick Start

\`\`\`bash
# From your project root
npx @nocciolo-ai/cli init
\`\`\`

## Installation

npm install -g whatever

## Core Principles

Prefer durable knowledge over ephemeral content. Local control is non-negotiable.

## Contributing

Please open an issue.
`;
    const result = extractFromSource(source("README.md", "readme"), content);
    const titles = result.facts.map((f) => f.title);
    expect(titles.some((t) => /goal/i.test(t))).toBe(true);
    expect(titles.some((t) => /principle/i.test(t))).toBe(true);
    expect(titles.some((t) => /nocciolo/i.test(t))).toBe(true);
    expect(titles.some((t) => /install/i.test(t))).toBe(false);
    expect(titles.some((t) => /quick start/i.test(t))).toBe(false);
    expect(titles.some((t) => /from your project root/i.test(t))).toBe(false);
    expect(titles.some((t) => /contributing/i.test(t))).toBe(false);
  });

  it("skips empty files", () => {
    const result = extractFromSource(source("README.md", "readme"), "   \n");
    expect(result.skipped).toBe(true);
    expect(result.facts).toHaveLength(0);
  });
});
