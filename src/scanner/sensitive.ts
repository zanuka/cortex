import { basename } from "node:path";

const SENSITIVE_DIR_NAMES = new Set([
  ".ssh",
  ".aws",
  ".gnupg",
  ".kube",
  "secrets",
  "credentials",
  "private-keys",
  "private_keys",
]);

const SENSITIVE_FILE_NAMES = new Set([
  ".env",
  ".envrc",
  ".npmrc",
  ".pypirc",
  "credentials",
  "credentials.json",
  "credentials.yaml",
  "credentials.yml",
  "secrets.json",
  "secrets.yaml",
  "secrets.yml",
  "service-account.json",
  "serviceaccount.json",
  "id_rsa",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
  "auth.json",
  "token.json",
  "secrets.md",
  "credentials.md",
  "api-keys.md",
  "api_keys.md",
  "private-keys.md",
  "private_keys.md",
]);

const SENSITIVE_FILE_PATTERNS: RegExp[] = [
  /^\.env(\..+)?$/i,
  /\.pem$/i,
  /\.key$/i,
  /\.p12$/i,
  /\.pfx$/i,
  /\.keystore$/i,
  /\.jks$/i,
  /^id_rsa/i,
  /^id_dsa/i,
  /^id_ecdsa/i,
  /^id_ed25519/i,
  /service-account.*\.json$/i,
  /.*credentials.*\.(json|ya?ml|toml|ini|env)$/i,
  /.*secret.*\.(json|ya?ml|toml|ini|env)$/i,
  /.*\.(pem|key|p12|pfx)$/i,
];

const SENSITIVE_PATH_PATTERNS: RegExp[] = [
  /(^|\/)\.env(\/|$)/i,
  /(^|\/)secrets?\//i,
  /(^|\/)credentials\//i,
  /(^|\/)\.ssh\//i,
  /(^|\/)\.aws\//i,
  /(^|\/)\.gnupg\//i,
  /(^|\/)\.kube\//i,
];

export function isSensitiveDirectoryName(name: string): boolean {
  const lower = name.toLowerCase();
  if (SENSITIVE_DIR_NAMES.has(lower)) {
    return true;
  }
  if (lower.startsWith(".env")) {
    return true;
  }
  return false;
}

export function isSensitiveRelativePath(relativePath: string): boolean {
  const normalized = relativePath.split(/[/\\]/).join("/");
  const parts = normalized.split("/").filter(Boolean);
  const fileName = basename(normalized);

  for (const part of parts.slice(0, -1)) {
    if (isSensitiveDirectoryName(part)) {
      return true;
    }
  }

  for (const pattern of SENSITIVE_PATH_PATTERNS) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  if (SENSITIVE_FILE_NAMES.has(fileName.toLowerCase())) {
    return true;
  }

  for (const pattern of SENSITIVE_FILE_PATTERNS) {
    if (pattern.test(fileName)) {
      return true;
    }
  }

  return false;
}

export function isSkippableTraversalDirectory(name: string): boolean {
  if (name === "node_modules" || name === "dist" || name === "build") {
    return true;
  }
  if (name.startsWith(".") || isSensitiveDirectoryName(name)) {
    return true;
  }
  return false;
}
