-- Production bootstrap for event creation + event contact information.
--
-- Fixes: in production nothing ever created an organization row or granted
-- anyone a global role (seed.sql is local-dev only), so events_insert RLS
-- rejected every "New event" attempt and the console showed "no access".

-- ---------------------------------------------------------------------------
-- 1. Ensure the organization exists (idempotent; safe to run anywhere).
-- ---------------------------------------------------------------------------
insert into organizations (slug, name)
select 'cru', 'Cru'
where not exists (select 1 from organizations);

-- Profiles created while the organizations table was empty have org_id null.
update profiles
set org_id = (select id from organizations order by created_at limit 1)
where org_id is null;

-- ---------------------------------------------------------------------------
-- 2. Bootstrap the first admin: if no global role has ever been granted,
--    the earliest-created profile becomes admin. From then on, admins grant
--    roles to others via grant_global_role below.
-- ---------------------------------------------------------------------------
insert into user_roles (user_id, org_id, role)
select p.id, p.org_id, 'admin'
from profiles p
where p.org_id is not null
  and not exists (select 1 from user_roles)
order by p.created_at
limit 1
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 3. Admin-only helper to grant/change a user's global role by email.
--    Usage (SQL editor or a future admin UI):
--      select grant_global_role('person@example.com', 'organizer');
-- ---------------------------------------------------------------------------
create or replace function public.grant_global_role(p_email text, p_role global_role)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid;
  v_org uuid;
begin
  if not private.is_admin() then
    raise exception 'not allowed';
  end if;
  select id, org_id into v_user, v_org
    from profiles where lower(email) = lower(trim(p_email));
  if v_user is null then
    raise exception 'no user with that email — they must sign in once first';
  end if;
  if v_org is null then
    select id into v_org from organizations order by created_at limit 1;
  end if;
  insert into user_roles (user_id, org_id, role)
  values (v_user, v_org, p_role)
  on conflict (user_id, org_id) do update set role = excluded.role;
end;
$$;
revoke execute on function public.grant_global_role(text, global_role) from public, anon;
grant execute on function public.grant_global_role(text, global_role) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Event contact information (shown publicly on the event page):
--    {"name": "...", "email": "...", "phone": "...", "website": "..."}
-- ---------------------------------------------------------------------------
alter table events add column if not exists contact jsonb not null default '{}';
