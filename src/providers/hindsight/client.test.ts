import {
  HindsightClient,
  resolveHindsightBaseUrl,
} from "./client.js";

describe("resolveHindsightBaseUrl", () => {
  it("prefers cli over config over env over default", () => {
    expect(
      resolveHindsightBaseUrl({
        cliUrl: "http://cli:1",
        configUrl: "http://config:1",
        env: {
          NOCCIOLO_HINDSIGHT_URL: "http://env:1",
        },
      }),
    ).toBe("http://cli:1");

    expect(
      resolveHindsightBaseUrl({
        configUrl: "http://config:1",
        env: {
          HINDSIGHT_URL: "http://env:1",
        },
      }),
    ).toBe("http://config:1");

    expect(
      resolveHindsightBaseUrl({
        env: {
          HINDSIGHT_URL: "http://env:1",
        },
      }),
    ).toBe("http://env:1");

    expect(resolveHindsightBaseUrl({ env: {} })).toBe("http://localhost:8888");
  });
});

describe("HindsightClient.retain", () => {
  it("posts retain payload to the memories endpoint", async () => {
    const calls: Array<{
      url: string;
      headers: Record<string, string> | undefined;
      body: unknown;
    }> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      calls.push({
        url: String(input),
        headers: init?.headers as Record<string, string> | undefined,
        body: JSON.parse(String(init?.body)),
      });
      return new Response(
        JSON.stringify({ success: true, bank_id: "nocciolo", items_count: 1 }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const client = new HindsightClient({
      baseUrl: "http://localhost:8888/",
      apiKey: "test-key",
      fetchImpl,
    });

    const result = await client.retain("nocciolo", {
      items: [
        {
          content: "Use TypeScript",
          context: "docs",
          document_id: "nocciolo:README.md#goal",
          timestamp: "unset",
          metadata: { source: "README.md" },
          tags: ["nocciolo"],
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(
      "http://localhost:8888/v1/default/banks/nocciolo/memories",
    );
    expect(calls[0]?.headers).toMatchObject({
      Authorization: "Bearer test-key",
    });
    expect(calls[0]?.body).toMatchObject({
      async: false,
      items: [{ document_id: "nocciolo:README.md#goal" }],
    });
  });

  it("throws an actionable error when Hindsight is unreachable", async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new Error("ECONNREFUSED");
    };
    const client = new HindsightClient({
      baseUrl: "http://localhost:8888",
      fetchImpl,
    });

    await expect(
      client.retain("nocciolo", {
        items: [
          {
            content: "x",
            context: "docs",
            document_id: "id",
            timestamp: "unset",
            metadata: {},
            tags: [],
          },
        ],
      }),
    ).rejects.toThrow(/Failed to reach Hindsight/);
  });
});
