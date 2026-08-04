import { toRetainItems } from "./prepare.js";
import type { CandidateFact } from "../extractor/types.js";

describe("toRetainItems", () => {
  it("maps candidate facts to Hindsight retain items with provenance", () => {
    const fact: CandidateFact = {
      id: "nocciolo:README.md#goal",
      title: "Goal",
      content: "Seed durable knowledge.",
      knowledgeKind: "overview",
      score: 5,
      provenance: {
        sourcePath: "README.md",
        kind: "readme",
        commit: "deadbeef",
      },
    };

    const items = toRetainItems([fact]);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      document_id: "nocciolo:README.md#goal",
      timestamp: "unset",
      metadata: {
        source: "README.md",
        commit: "deadbeef",
        knowledge_kind: "overview",
      },
    });
  });
});
