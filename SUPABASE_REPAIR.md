# Supabase Repair Notes

The frontend is wired to this Supabase project:

- Project ref: `wxqwbwuognhebekddawd`
- URL: `https://wxqwbwuognhebekddawd.supabase.co`

The backend repair SQL lives here:

```text
supabase/migrations/20260602000000_repair_public_backend.sql
```

Apply it with one of these options:

0. Supabase Management API script
   - Create a Supabase access token with `database:write`.
   - Run:

```sh
SUPABASE_ACCESS_TOKEN=sbp_... npm run supabase:repair
npm run supabase:check
```

1. Supabase Dashboard
   - Open the project SQL Editor.
   - Paste the full SQL from the repair migration.
   - Run it once.

2. Supabase CLI
   - Log in with `supabase login`.
   - Link the project with `supabase link --project-ref wxqwbwuognhebekddawd`.
   - Run `supabase db push`.

3. Direct Postgres connection
   - Use the project database connection string.
   - Run the repair migration with `psql`.

The repair adds `vendors.notes`, restores resilient triggers, replaces fragile
RLS policies, and seeds starter vendors/events for a public browsing build.

If `npm run supabase:check` reports `Could not resolve host`, the project URL is
not reachable from DNS. Confirm the project is not paused/deleted and that
`VITE_SUPABASE_PROJECT_ID` matches the current project ref in Dashboard.
