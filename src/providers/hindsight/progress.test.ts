import { formatPercent } from "./client.js";
import { formatOperationProgressLine } from "./progress.js";

describe("formatPercent", () => {
  it("rounds item progress", () => {
    expect(formatPercent(0, 17)).toBe("0%");
    expect(formatPercent(1, 17)).toBe("6%");
    expect(formatPercent(17, 17)).toBe("100%");
  });
});

describe("formatOperationProgressLine", () => {
  it("includes percentage when processed/total are present", () => {
    expect(
      formatOperationProgressLine("op-1", {
        status: "processing",
        progress: { processed: 17, total: 46, stage: "processing_batch" },
      }),
    ).toBe("op-1  processing  37% (17/46) processing_batch");
  });

  it("falls back to status when progress is missing", () => {
    expect(
      formatOperationProgressLine("op-2", { status: "pending" }),
    ).toBe("op-2  pending");
  });
});
