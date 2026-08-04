import { z } from "zod";

export const NoccioloConfigSchema = z.object({
  version: z.literal(1),
  name: z.string().min(1),
  provider: z.literal("hindsight"),
  bankId: z.string().min(1),
  root: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type NoccioloConfig = z.infer<typeof NoccioloConfigSchema>;

export function createDefaultConfig(input: {
  name: string;
  root?: string;
  bankId?: string;
}): NoccioloConfig {
  const bankId = input.bankId ?? slugify(input.name);
  return {
    version: 1,
    name: input.name,
    provider: "hindsight",
    bankId,
    root: input.root ?? ".",
    createdAt: new Date().toISOString(),
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "project";
}
