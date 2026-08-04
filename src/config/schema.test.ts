import { createDefaultConfig, NoccioloConfigSchema } from "./schema.js";

describe("NoccioloConfigSchema", () => {
  it("accepts a valid config", () => {
    const config = createDefaultConfig({
      name: "nocciolo",
      root: ".",
    });
    expect(NoccioloConfigSchema.parse(config).bankId).toBe("nocciolo");
    expect(config.root).toBe(".");
  });

  it("slugifies bank ids", () => {
    const config = createDefaultConfig({
      name: "My Cool App!",
    });
    expect(config.bankId).toBe("my-cool-app");
  });

  it("rejects invalid provider", () => {
    expect(() =>
      NoccioloConfigSchema.parse({
        version: 1,
        name: "x",
        provider: "other",
        bankId: "x",
        root: "/",
        createdAt: new Date().toISOString(),
      }),
    ).toThrow();
  });
});
