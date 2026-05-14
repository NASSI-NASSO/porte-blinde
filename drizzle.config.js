import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.join(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) return undefined;

  const content = fs.readFileSync(envPath, "utf8");
  const line = content
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith("DATABASE_URL="));
  if (!line) return undefined;

  return line.split("=").slice(1).join("=").replace(/^["']|["']$/g, "");
}

const rawUrl = readDatabaseUrl();

if (!rawUrl) {
  throw new Error("DATABASE_URL is missing in .env.local");
}

const parsed = new URL(rawUrl);

/** @type {import('drizzle-kit').Config} */
export default {
  schema: "./lib/db/schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password:decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\/+/, ""),
  },
};
