import { createInterface } from "node:readline";

export function isInteractive(stdin: NodeJS.ReadStream = process.stdin): boolean {
  return Boolean(stdin.isTTY);
}

export async function promptLine(
  question: string,
  options: {
    defaultValue?: string;
    stdin?: NodeJS.ReadStream;
    stdout?: NodeJS.WritableStream;
  } = {},
): Promise<string> {
  const stdin = options.stdin ?? process.stdin;
  const stdout = options.stdout ?? process.stdout;
  const suffix =
    options.defaultValue !== undefined && options.defaultValue.length > 0
      ? ` [${options.defaultValue}]`
      : "";

  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await new Promise<string>((resolve) => {
      rl.question(`${question}${suffix}: `, (line) => {
        resolve(line);
      });
    });
    const trimmed = answer.trim();
    if (trimmed.length === 0 && options.defaultValue !== undefined) {
      return options.defaultValue;
    }
    return trimmed;
  } finally {
    rl.close();
  }
}
