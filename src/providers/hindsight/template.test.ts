import { generateHindsightBankTemplate } from "./template.js";

describe("generateHindsightBankTemplate", () => {
  it("produces a valid version-1 Hindsight bank template", () => {
    const template = generateHindsightBankTemplate({
      projectName: "Acme App",
      bankId: "acme-app",
    });

    expect(template.version).toBe("1");
    expect(template.bank.retain_extraction_mode).toBe("verbose");
    expect(template.bank.retain_mission).toContain("Acme App");
    expect(template.bank.entity_labels.length).toBeGreaterThan(0);
    expect(template.mental_models.some((m) => m.id === "project-context")).toBe(
      true,
    );
    expect(template.directives.length).toBeGreaterThan(0);
    expect(template.directives.every((d) => d.is_active)).toBe(true);
  });
});
