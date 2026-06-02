import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function readEnv() {
  const envPath = path.join(root, ".env");
  const fileEnv = {};

  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([^#=\s]+)=["']?(.+?)["']?$/);
      if (match) fileEnv[match[1]] = match[2];
    }
  }

  return { ...fileEnv, ...process.env };
}

export function getSupabaseConfig() {
  const env = readEnv();
  const projectRef = env.VITE_SUPABASE_PROJECT_ID || "yjjyjtmbcmveynotiuld";
  const supabaseUrl = env.VITE_SUPABASE_URL || `https://${projectRef}.supabase.co`;
  const anonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;

  if (!projectRef) throw new Error("Missing VITE_SUPABASE_PROJECT_ID.");
  if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL.");
  if (!anonKey) throw new Error("Missing VITE_SUPABASE_PUBLISHABLE_KEY.");

  return {
    env,
    projectRef,
    supabaseUrl,
    anonKey,
  };
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = text;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Keep plain text response.
  }

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}
