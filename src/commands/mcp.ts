export interface McpOptions {
  cwd?: string;
}

export async function runMcp(_options: McpOptions = {}): Promise<void> {
  console.log("MCP config emission is not implemented yet.");
  console.log(
    "Coming soon: ready-to-paste Cursor / Claude Code / MCP snippets for your Hindsight bank.",
  );
  console.log(
    "For now: run `nocciolo configure` and `nocciolo seed --dry-run`, then wire the bank manually.",
  );
}
