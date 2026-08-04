export type RetainExtractionMode =
  | "concise"
  | "verbose"
  | "custom"
  | "chunks"
  | "verbatim";

export interface HindsightEntityLabelValue {
  value: string;
}

export interface HindsightEntityLabel {
  key: string;
  type: "value";
  values: HindsightEntityLabelValue[];
}

export interface HindsightBankConfig {
  reflect_mission: string;
  retain_mission: string;
  retain_extraction_mode: RetainExtractionMode;
  enable_observations: boolean;
  observations_mission: string;
  disposition_skepticism: number;
  disposition_literalism: number;
  disposition_empathy: number;
  entities_allow_free_form: boolean;
  entity_labels: HindsightEntityLabel[];
}

export interface HindsightMentalModel {
  id: string;
  name: string;
  source_query: string;
  max_tokens: number;
  tags: string[];
  trigger: {
    refresh_after_consolidation: boolean;
  };
}

export interface HindsightDirective {
  name: string;
  content: string;
  priority: number;
  is_active: boolean;
  tags: string[];
}

export interface HindsightBankTemplate {
  version: "1";
  bank: HindsightBankConfig;
  mental_models: HindsightMentalModel[];
  directives: HindsightDirective[];
}

export interface BankTemplateInput {
  projectName: string;
  bankId: string;
}
