import fs from "node:fs";
import zlib from "node:zlib";
import { fetchJson, getSupabaseConfig } from "./supabase_env.mjs";

const backupPath = process.argv[2];

if (!backupPath) {
  console.error("Usage: node scripts/restore_inquiries_from_backup.mjs <backup.sql.gz>");
  process.exit(1);
}

const { supabaseUrl, anonKey } = getSupabaseConfig();
const sql = zlib.gunzipSync(fs.readFileSync(backupPath)).toString("utf8");
const copyMatch = sql.match(
  /^COPY public\.inquiries \(([^)]+)\) FROM stdin;\n([\s\S]*?)^\\\.$/m
);

if (!copyMatch) {
  console.error("Could not find COPY public.inquiries block in backup.");
  process.exit(1);
}

const columns = copyMatch[1].split(",").map((column) => column.trim());
const rows = copyMatch[2]
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const values = line.split("\t").map(parseCopyValue);
    return Object.fromEntries(columns.map((column, index) => [column, values[index]]));
  });

if (rows.length === 0) {
  console.log("No inquiries found in backup.");
  process.exit(0);
}

const result = await fetchJson(`${supabaseUrl}/rest/v1/inquiries`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify(rows),
});

if (!result.ok) {
  console.error(`Restore failed: HTTP ${result.status}`);
  console.error(JSON.stringify(result.body, null, 2));
  process.exit(1);
}

console.log(`Restored ${Array.isArray(result.body) ? result.body.length : rows.length} inquiries.`);

function parseCopyValue(value) {
  if (value === "\\N") return null;
  if (/^\{.*\}$/.test(value)) return parsePgTextArray(value);
  return value.replace(/\\t/g, "\t").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\\\/g, "\\");
}

function parsePgTextArray(value) {
  const inner = value.slice(1, -1);
  if (!inner) return [];

  const items = [];
  let current = "";
  let quoted = false;
  let escaped = false;

  for (const char of inner) {
    if (escaped) {
      current += char;
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      items.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  items.push(current);
  return items.map((item) => (item === "NULL" ? null : item));
}
