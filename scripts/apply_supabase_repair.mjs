import fs from "node:fs";
import path from "node:path";
import { fetchJson, getSupabaseConfig, root } from "./supabase_env.mjs";

const { env, projectRef } = getSupabaseConfig();
const accessToken = env.SUPABASE_ACCESS_TOKEN;

if (!accessToken) {
  console.error("Missing SUPABASE_ACCESS_TOKEN.");
  console.error("Create a Supabase access token with database:write permission, then run:");
  console.error("  SUPABASE_ACCESS_TOKEN=sbp_... npm run supabase:repair");
  process.exit(1);
}

const migrationPath = path.join(
  root,
  "supabase/migrations/20260602000000_repair_public_backend.sql"
);
const query = fs.readFileSync(migrationPath, "utf8");

const result = await fetchJson(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      read_only: false,
    }),
  }
);

if (!result.ok) {
  console.error(`Supabase repair failed: HTTP ${result.status}`);
  console.error(JSON.stringify(result.body, null, 2));
  process.exit(1);
}

console.log("Supabase repair migration applied.");
