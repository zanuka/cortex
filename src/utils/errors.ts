export class NoccioloError extends Error {
  readonly hint?: string;

  constructor(message: string, hint?: string) {
    super(message);
    this.name = "NoccioloError";
    if (hint !== undefined) {
      this.hint = hint;
    }
  }
}

export function formatError(error: unknown): string {
  if (error instanceof NoccioloError) {
    const parts = [`Error: ${error.message}`];
    if (error.hint) {
      parts.push(`Hint: ${error.hint}`);
    }
    return parts.join("\n");
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return `Error: ${String(error)}`;
}
