import { formatPercent, type OperationStatus } from "./client.js";

export function formatOperationProgressLine(
  operationId: string,
  status: OperationStatus,
): string {
  const state = status.status ?? "unknown";
  const progress = status.progress;
  if (
    progress &&
    typeof progress.processed === "number" &&
    typeof progress.total === "number" &&
    progress.total > 0
  ) {
    const pct = formatPercent(progress.processed, progress.total);
    const stage = progress.stage ? ` ${progress.stage}` : "";
    return `${operationId}  ${state}  ${pct} (${progress.processed}/${progress.total})${stage}`;
  }
  if (progress?.stage) {
    return `${operationId}  ${state}  stage=${progress.stage}`;
  }
  return `${operationId}  ${state}`;
}
