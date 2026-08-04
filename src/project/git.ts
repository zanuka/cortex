import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function resolveGitCommit(
  projectRoot: string,
): Promise<string | undefined> {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["rev-parse", "HEAD"],
      { cwd: projectRoot },
    );
    const commit = stdout.trim();
    return commit.length > 0 ? commit : undefined;
  } catch {
    return undefined;
  }
}
