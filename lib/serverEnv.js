import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function stripQuotes(value) {
  if (!value) return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function getServerEnv(key) {
  if (process.env[key]) return process.env[key];

  try {
    const libDir = path.dirname(fileURLToPath(import.meta.url));
    const candidates = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), "mon-projet", ".env.local"),
      path.join(libDir, "..", ".env.local"),
    ];

    for (const envPath of candidates) {
      if (!fs.existsSync(envPath)) continue;

      const raw = fs.readFileSync(envPath, "utf8");
      const lines = raw.split(/\r?\n/);

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;

        const k = trimmed.slice(0, eqIdx).trim();
        const v = stripQuotes(trimmed.slice(eqIdx + 1));
        if (k === key) return v;
      }
    }
  } catch {
    // ignore file read/parse errors and return undefined
  }

  return undefined;
}
