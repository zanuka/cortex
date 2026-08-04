import { readFile } from "node:fs/promises";
import {
  DurableSource,
  findDurableSources,
  summarizeSource,
} from "../scanner/durable-sources.js";

export interface SeedPreviewItem {
  relativePath: string;
  kind: DurableSource["kind"];
  summary: string;
  bytes: number;
  excerpt: string;
}

export interface SeedPreview {
  projectRoot: string;
  sources: SeedPreviewItem[];
}

export async function previewSeed(projectRoot: string): Promise<SeedPreview> {
  const sources = await findDurableSources(projectRoot);
  const items: SeedPreviewItem[] = [];

  for (const source of sources) {
    const content = await readFile(source.absolutePath, "utf8");
    items.push({
      relativePath: source.relativePath,
      kind: source.kind,
      summary: summarizeSource(source),
      bytes: Buffer.byteLength(content, "utf8"),
      excerpt: firstMeaningfulLine(content),
    });
  }

  return { projectRoot, sources: items };
}

function firstMeaningfulLine(content: string): string {
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (trimmed.startsWith("#")) {
      return trimmed.replace(/^#+\s*/, "").slice(0, 120);
    }
    return trimmed.slice(0, 120);
  }
  return "(empty file)";
}
