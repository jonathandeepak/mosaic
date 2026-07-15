# Event creation & organizer roles

## Why event creation didn't work in production

Creating an event requires a **global role** (`organizer` or `admin`) in the
`user_roles` table — that's enforced by the `events_insert` RLS policy. The only
thing that ever granted a role was `supabase/seed.sql`, which is local-dev only.
Production had no organization row and no roles, so the console showed
"You do not have organizer access" and inserts were rejected.

## One-time fix: apply migration 0003

Run [`supabase/migrations/0003_event_creation_bootstrap.sql`](../supabase/migrations/0003_event_creation_bootstrap.sql)
against production. Either:

- **Supabase dashboard** → SQL Editor → paste the file's contents → Run, or
- **CLI**: `supabase db push` (with the project linked).

The migration:

1. Creates the `Cru` organization if none exists, and backfills `profiles.org_id`.
2. If **no role has ever been granted**, makes the **earliest-created user** an
   admin. Check who that is first: if the wrong account gets it, grant yourself
   admin manually instead (SQL Editor, service role bypasses RLS):

   ```sql
   insert into user_roles (user_id, org_id, role)
   select p.id, p.org_id, 'admin' from profiles p
   where lower(p.email) = 'you@example.com'
   on conflict (user_id, org_id) do update set role = excluded.role;
   ```

3. Adds `grant_global_role(email, role)` so admins can grant access from the
   SQL editor (or a future admin UI) — the target user must have signed in once:

   ```sql
   select grant_global_role('teammate@example.com', 'organizer');
   ```

4. Adds an `events.contact` column (contact info shown on the public event page).

## Role model recap

| Role | Where | Can |
| --- | --- | --- |
| `admin` (global) | `user_roles` | everything, incl. deleting events and granting roles |
| `organizer` (global) | `user_roles` | create events; manage events they created |
| `organizer` (per-event) | `event_organizers` | manage that event (granted via the event's Team page) |
| `viewer` (per-event) | `event_organizers` | view that event's console pages |

Event creators automatically become that event's organizer (database trigger).
Additional helpers can be added per event in the console under **Team**.
