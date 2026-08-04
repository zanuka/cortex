import { NoccioloError } from "../../utils/errors.js";

export interface RetainItem {
  content: string;
  context: string;
  document_id: string;
  timestamp: "unset";
  metadata: Record<string, string>;
  tags: string[];
}

export interface RetainRequest {
  items: RetainItem[];
  async?: boolean;
}

export interface RetainResponse {
  success?: boolean;
  bank_id?: string;
  items_count?: number;
  async?: boolean;
  operation_id?: string;
  operation_ids?: string[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
}

export interface OperationProgress {
  stage?: string;
  at?: string;
  processed?: number | null;
  total?: number | null;
  detail?: Record<string, unknown>;
}

export interface OperationStatus {
  id?: string;
  status?: string;
  error_message?: string | null;
  updated_at?: string | null;
  progress?: OperationProgress | null;
}

export interface HindsightClientOptions {
  baseUrl: string;
  apiKey?: string;
  fetchImpl?: typeof fetch;
}

export class HindsightClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: HindsightClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    if (options.apiKey !== undefined) {
      this.apiKey = options.apiKey;
    }
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async retain(
    bankId: string,
    request: RetainRequest,
  ): Promise<RetainResponse> {
    const url = `${this.baseUrl}/v1/default/banks/${encodeURIComponent(bankId)}/memories`;

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({
          items: request.items,
          async: request.async ?? false,
        }),
      });
    } catch (error) {
      throw new NoccioloError(
        `Failed to reach Hindsight at ${this.baseUrl}`,
        `Check that Hindsight is running and NOCCIOLO_HINDSIGHT_URL / config hindsightBaseUrl is correct. (${error instanceof Error ? error.message : String(error)})`,
      );
    }

    if (!response.ok) {
      const body = await safeReadText(response);
      const authHint =
        response.status === 401 || response.status === 403
          ? " Set NOCCIOLO_HINDSIGHT_API_KEY or HINDSIGHT_API_KEY (same value as HINDSIGHT_API_TENANT_API_KEY in your Hindsight container), or pass --api-key."
          : "";
      throw new NoccioloError(
        `Hindsight retain failed (${response.status} ${response.statusText}) for bank "${bankId}"`,
        body
          ? `Response: ${body.slice(0, 500)}.${authHint}`
          : `Verify the bank id exists and the retain payload is valid.${authHint}`,
        response.status,
      );
    }

    if (response.status === 204) {
      return {
        success: true,
        bank_id: bankId,
        items_count: request.items.length,
      };
    }

    return (await response.json()) as RetainResponse;
  }

  async getOperationStatus(
    bankId: string,
    operationId: string,
  ): Promise<OperationStatus> {
    const url = `${this.baseUrl}/v1/default/banks/${encodeURIComponent(bankId)}/operations/${encodeURIComponent(operationId)}`;

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method: "GET",
        headers: this.headers(),
      });
    } catch (error) {
      throw new NoccioloError(
        `Failed to reach Hindsight at ${this.baseUrl}`,
        `Could not poll operation status. (${error instanceof Error ? error.message : String(error)})`,
      );
    }

    if (!response.ok) {
      const body = await safeReadText(response);
      throw new NoccioloError(
        `Hindsight operation status failed (${response.status}) for "${operationId}"`,
        body ? `Response: ${body.slice(0, 500)}` : undefined,
        response.status,
      );
    }

    return (await response.json()) as OperationStatus;
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }
    return headers;
  }
}

export function resolveHindsightBaseUrl(input: {
  cliUrl?: string;
  configUrl?: string;
  env?: NodeJS.ProcessEnv;
}): string {
  const env = input.env ?? process.env;
  const fromEnv =
    env.NOCCIOLO_HINDSIGHT_URL?.trim() || env.HINDSIGHT_URL?.trim();
  return (
    input.cliUrl?.trim() ||
    input.configUrl?.trim() ||
    fromEnv ||
    "http://localhost:8888"
  );
}

export function resolveHindsightApiKey(input: {
  cliKey?: string;
  configKey?: string;
  env?: NodeJS.ProcessEnv;
}): string | undefined {
  const env = input.env ?? process.env;
  const key =
    input.cliKey?.trim() ||
    input.configKey?.trim() ||
    env.NOCCIOLO_HINDSIGHT_API_KEY?.trim() ||
    env.HINDSIGHT_API_KEY?.trim();
  return key || undefined;
}

export function formatPercent(processed: number, total: number): string {
  if (total <= 0) {
    return "0%";
  }
  return `${Math.min(100, Math.round((processed / total) * 100))}%`;
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
