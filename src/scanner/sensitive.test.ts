import { isSensitiveRelativePath } from "./sensitive.js";

describe("isSensitiveRelativePath", () => {
  it("flags env and credential files", () => {
    expect(isSensitiveRelativePath(".env")).toBe(true);
    expect(isSensitiveRelativePath(".env.local")).toBe(true);
    expect(isSensitiveRelativePath(".env.production")).toBe(true);
    expect(isSensitiveRelativePath("credentials.json")).toBe(true);
    expect(isSensitiveRelativePath("secrets.yaml")).toBe(true);
    expect(isSensitiveRelativePath("service-account.json")).toBe(true);
    expect(isSensitiveRelativePath("id_rsa")).toBe(true);
    expect(isSensitiveRelativePath("certs/server.pem")).toBe(true);
  });

  it("flags sensitive directories and secret docs", () => {
    expect(isSensitiveRelativePath("secrets/tokens.md")).toBe(true);
    expect(isSensitiveRelativePath("docs/secrets/api.md")).toBe(true);
    expect(isSensitiveRelativePath("docs/credentials.md")).toBe(true);
    expect(isSensitiveRelativePath("docs/api-keys.md")).toBe(true);
    expect(isSensitiveRelativePath(".ssh/config")).toBe(true);
    expect(isSensitiveRelativePath(".aws/credentials")).toBe(true);
  });

  it("allows normal durable docs", () => {
    expect(isSensitiveRelativePath("README.md")).toBe(false);
    expect(isSensitiveRelativePath("AGENTS.md")).toBe(false);
    expect(isSensitiveRelativePath("docs/cli-architecture.md")).toBe(false);
    expect(isSensitiveRelativePath("docs/adr/0001-use-ts.md")).toBe(false);
    expect(isSensitiveRelativePath("docs/dev-workflow.md")).toBe(false);
  });
});
