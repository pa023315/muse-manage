import { fetchJson, getSupabaseConfig } from "./supabase_env.mjs";
import dns from "node:dns/promises";

const { supabaseUrl, anonKey } = getSupabaseConfig();
const { hostname } = new URL(supabaseUrl);

try {
  const addresses = await dns.lookup(hostname);
  console.log(`OK dns: ${hostname} -> ${addresses.address}`);
} catch (error) {
  console.error(`FAIL dns: Could not resolve ${hostname}.`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

async function check(name, path) {
  const result = await fetchJson(`${supabaseUrl}${path}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  if (!result.ok) {
    return {
      name,
      ok: false,
      status: result.status,
      body: result.body,
    };
  }

  return {
    name,
    ok: true,
    status: result.status,
    rows: Array.isArray(result.body) ? result.body.length : null,
  };
}

try {
  const checks = [
    await check("vendors", "/rest/v1/vendors?select=*&limit=3"),
    await check("vendors.notes", "/rest/v1/vendors?select=notes&limit=1"),
    await check("inquiries", "/rest/v1/inquiries?select=*&limit=3"),
    await check("events", "/rest/v1/events?select=*&limit=3"),
  ];

  for (const item of checks) {
    if (item.ok) {
      console.log(`OK ${item.name}: HTTP ${item.status}, rows=${item.rows}`);
    } else {
      console.log(`FAIL ${item.name}: HTTP ${item.status}`);
      console.log(JSON.stringify(item.body, null, 2));
    }
  }

  if (checks.some((item) => !item.ok)) process.exit(1);
} catch (error) {
  console.error("Supabase connection check failed.");
  console.error(error instanceof Error ? error.message : error);
  if (error instanceof Error && error.cause) {
    console.error(error.cause);
  }
  process.exit(1);
}
