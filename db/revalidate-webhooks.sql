-- On each data change, calls /api/revalidate with only the cache tags it touches.
-- Tags must mirror src/lib/db/cacheTags.ts.
--
-- Each tag is sent once per transaction, so wrap a batch of edits in begin/commit.
--
-- Run on the PRODUCTION database only (the URL is production); re-running is safe.
-- Before running:
--   1. Set REVALIDATE_SECRET in Vercel (Production) and deploy the tag-based /api/revalidate.
--   2. Store the same value in Vault (never commit it):
--        select vault.create_secret('<the secret>', 'revalidate_secret');

create extension if not exists pg_net with schema extensions;

-- Previous version's triggers.
drop trigger if exists revalidate_storms on catfisha_typhoons.storms;
drop trigger if exists revalidate_typhoonnames on catfisha_typhoons.typhoonnames;
drop trigger if exists revalidate_suggestednames on catfisha_typhoons.suggestednames;
drop trigger if exists revalidate_facts on catfisha_typhoons.facts;
drop trigger if exists revalidate_positions on catfisha_typhoons.positions;
drop trigger if exists revalidate_imagelicenses on catfisha_typhoons.imagelicenses;
drop function if exists catfisha_typhoons.revalidate_site();

-- POSTs the tags this transaction has not sent yet.
create or replace function catfisha_typhoons.revalidate_tags(tags text[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- Tags already queued in this transaction.
  sent jsonb := coalesce(nullif(current_setting('revalidate_site.sent', true), ''), '[]')::jsonb;
  pending text[];
  secret text;
begin
  -- "db" covers every cached query.
  if sent ? 'db' then
    return;
  end if;

  if 'db' = any(tags) or cardinality(tags) > 100 then
    tags := array['db'];
  end if;

  select coalesce(array_agg(distinct t), '{}') into pending
  from unnest(tags) as t
  where t is not null and not (sent ? t);

  if cardinality(pending) = 0 then
    return;
  end if;

  select decrypted_secret into secret
  from vault.decrypted_secrets
  where name = 'revalidate_secret';

  if secret is null then
    raise warning 'revalidate_tags: vault secret "revalidate_secret" is missing; site not revalidated';
    return;
  end if;

  perform net.http_post(
    url := 'https://typhoons.vercel.app/api/revalidate/',
    body := jsonb_build_object('tags', to_jsonb(pending)),
    params := jsonb_build_object('secret', secret),
    timeout_milliseconds := 10000
  );
  perform set_config('revalidate_site.sent', (sent || to_jsonb(pending))::text, true);
end;
$$;

-- For tables whose pages are refreshed as a whole: TG_ARGV lists the tags.
create or replace function catfisha_typhoons.revalidate_static()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform catfisha_typhoons.revalidate_tags(tg_argv::text[]);
  return null;
end;
$$;

create or replace function catfisha_typhoons.revalidate_storms()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed jsonb;
  tags text[];
begin
  -- moved: name, position or year changed (always true for inserts and deletes).
  if tg_op = 'INSERT' then
    select jsonb_agg(jsonb_build_object(
      'img', 'new', 'name', name, 'position', position, 'year', year, 'moved', true))
    into changed from new_rows;
  elsif tg_op = 'DELETE' then
    select jsonb_agg(jsonb_build_object(
      'img', 'old', 'name', name, 'position', position, 'year', year, 'moved', true))
    into changed from old_rows;
  else
    select jsonb_agg(r) into changed
    from (
      select 'old' as img, o.name, o.position, o.year,
             (o.name, o.position, o.year) is distinct from (n.name, n.position, n.year) as moved
      from old_rows o join new_rows n on n.id = o.id
      union all
      select 'new', n.name, n.position, n.year,
             (o.name, o.position, o.year) is distinct from (n.name, n.position, n.year)
      from old_rows o join new_rows n on n.id = o.id
    ) as r;
  end if;

  if changed is null then
    return null;
  end if;

  with c as (
    select *
    from jsonb_to_recordset(changed) as x(img text, name text, position int, year int, moved boolean)
  )
  select array_agg(distinct tag) into tags
  from (
    select 'storms' as tag
    union all select 'name:' || lower(c.name) from c
    union all select 'position:' || c.position from c
    union all select 'year:' || c.year from c
    union all select 'storm-index' from c where c.moved
    -- Every season using the name (its debut season may change).
    union all
    select 'year:' || s.year
    from catfisha_typhoons.storms s
    where s.name in (select c.name from c where c.moved)
    -- Agency storms (navbar search).
    union all select 'name-list' from c where c.moved and c.position between 141 and 143
    -- A year lost its last storm...
    union all
    select 'storm-years'
    from c
    where c.moved and c.img = 'old'
      and not exists (select 1 from catfisha_typhoons.storms s where s.year = c.year)
    -- ...or gained its first.
    union all
    select 'storm-years'
    from c
    where c.moved and c.img = 'new'
    group by c.year
    having count(*) >= (select count(*) from catfisha_typhoons.storms s where s.year = c.year)
  ) as t;

  perform catfisha_typhoons.revalidate_tags(tags);
  return null;
end;
$$;

create or replace function catfisha_typhoons.revalidate_typhoonnames()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed jsonb;
  tags text[];
begin
  if tg_op = 'INSERT' then
    select jsonb_agg(jsonb_build_object(
      'name', name, 'position', position, 'lastyear', lastyear, 'renamed', true))
    into changed from new_rows;
  elsif tg_op = 'DELETE' then
    select jsonb_agg(jsonb_build_object(
      'name', name, 'position', position, 'lastyear', lastyear, 'renamed', true))
    into changed from old_rows;
  else
    select jsonb_agg(r) into changed
    from (
      select o.name, o.position, o.lastyear, o.name is distinct from n.name as renamed
      from old_rows o join new_rows n on n.id = o.id
      union all
      select n.name, n.position, n.lastyear, o.name is distinct from n.name
      from old_rows o join new_rows n on n.id = o.id
    ) as r;
  end if;

  if changed is null then
    return null;
  end if;

  with c as (
    select *
    from jsonb_to_recordset(changed) as x(name text, position int, lastyear int, renamed boolean)
  )
  select array_agg(distinct tag) into tags
  from (
    select 'names' as tag
    union all select 'name:' || lower(c.name) from c
    union all select 'position:' || c.position from c
    -- Season it was retired after, and every season that used it.
    union all select 'year:' || c.lastyear from c where c.lastyear is not null
    union all
    select 'year:' || s.year
    from catfisha_typhoons.storms s
    where lower(s.name) in (select lower(c.name) from c)
    union all select 'name-list' from c where c.renamed
  ) as t;

  perform catfisha_typhoons.revalidate_tags(tags);
  return null;
end;
$$;

-- Transition tables allow one event per trigger; TRUNCATE has none, so it refreshes everything.
drop trigger if exists revalidate_storms_insert on catfisha_typhoons.storms;
create trigger revalidate_storms_insert
  after insert on catfisha_typhoons.storms
  referencing new table as new_rows
  for each statement execute function catfisha_typhoons.revalidate_storms();

drop trigger if exists revalidate_storms_update on catfisha_typhoons.storms;
create trigger revalidate_storms_update
  after update on catfisha_typhoons.storms
  referencing old table as old_rows new table as new_rows
  for each statement execute function catfisha_typhoons.revalidate_storms();

drop trigger if exists revalidate_storms_delete on catfisha_typhoons.storms;
create trigger revalidate_storms_delete
  after delete on catfisha_typhoons.storms
  referencing old table as old_rows
  for each statement execute function catfisha_typhoons.revalidate_storms();

drop trigger if exists revalidate_storms_truncate on catfisha_typhoons.storms;
create trigger revalidate_storms_truncate
  after truncate on catfisha_typhoons.storms
  for each statement execute function catfisha_typhoons.revalidate_static('db');

drop trigger if exists revalidate_typhoonnames_insert on catfisha_typhoons.typhoonnames;
create trigger revalidate_typhoonnames_insert
  after insert on catfisha_typhoons.typhoonnames
  referencing new table as new_rows
  for each statement execute function catfisha_typhoons.revalidate_typhoonnames();

drop trigger if exists revalidate_typhoonnames_update on catfisha_typhoons.typhoonnames;
create trigger revalidate_typhoonnames_update
  after update on catfisha_typhoons.typhoonnames
  referencing old table as old_rows new table as new_rows
  for each statement execute function catfisha_typhoons.revalidate_typhoonnames();

drop trigger if exists revalidate_typhoonnames_delete on catfisha_typhoons.typhoonnames;
create trigger revalidate_typhoonnames_delete
  after delete on catfisha_typhoons.typhoonnames
  referencing old table as old_rows
  for each statement execute function catfisha_typhoons.revalidate_typhoonnames();

drop trigger if exists revalidate_typhoonnames_truncate on catfisha_typhoons.typhoonnames;
create trigger revalidate_typhoonnames_truncate
  after truncate on catfisha_typhoons.typhoonnames
  for each statement execute function catfisha_typhoons.revalidate_static('db');

drop trigger if exists revalidate_suggestednames_all on catfisha_typhoons.suggestednames;
create trigger revalidate_suggestednames_all
  after insert or update or delete or truncate on catfisha_typhoons.suggestednames
  for each statement execute function catfisha_typhoons.revalidate_static('suggestions');

drop trigger if exists revalidate_facts_all on catfisha_typhoons.facts;
create trigger revalidate_facts_all
  after insert or update or delete or truncate on catfisha_typhoons.facts
  for each statement execute function catfisha_typhoons.revalidate_static('facts');

-- Joined into almost every query.
drop trigger if exists revalidate_positions_all on catfisha_typhoons.positions;
create trigger revalidate_positions_all
  after insert or update or delete or truncate on catfisha_typhoons.positions
  for each statement execute function catfisha_typhoons.revalidate_static('db');

drop trigger if exists revalidate_imagelicenses_all on catfisha_typhoons.imagelicenses;
create trigger revalidate_imagelicenses_all
  after insert or update or delete or truncate on catfisha_typhoons.imagelicenses
  for each statement execute function catfisha_typhoons.revalidate_static('db');

-- Check delivery:
--   select id, status_code, error_msg, created from net._http_response order by created desc limit 5;
