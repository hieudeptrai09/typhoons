-- Refreshes typhoons.vercel.app whenever the data changes.
--
-- Every cached query is `revalidate: false`, so the site keeps serving what it rendered until
-- /api/revalidate is called. These triggers call it after each committed change, one request per
-- statement (a bulk UPDATE sends one request, not one per row). pg_net queues the request inside
-- the transaction, so a rolled-back edit sends nothing.
--
-- Run once on the PRODUCTION database only: the URL is the production site, so a trigger on the
-- dev database would revalidate production from dev edits.
--
-- Before running:
--   1. Set REVALIDATE_SECRET in Vercel (Production) and deploy the code that adds /api/revalidate.
--   2. Store the same value in Vault (SQL editor, once — never commit the real value):
--        select vault.create_secret('<the secret>', 'revalidate_secret');
--      To rotate it later:
--        select vault.update_secret(
--          (select id from vault.secrets where name = 'revalidate_secret'), '<new secret>');

create extension if not exists pg_net with schema extensions;

-- TG_ARGV[0] is the cache tag to revalidate; no argument revalidates every tag.
create or replace function catfisha_typhoons.revalidate_site()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  secret text;
  params jsonb;
begin
  select decrypted_secret into secret
  from vault.decrypted_secrets
  where name = 'revalidate_secret';

  if secret is null then
    raise warning 'revalidate_site: vault secret "revalidate_secret" is missing; site not revalidated';
    return null;
  end if;

  params := jsonb_build_object('secret', secret);
  if tg_nargs > 0 then
    params := params || jsonb_build_object('tag', tg_argv[0]);
  end if;

  perform net.http_post(
    url := 'https://typhoons.vercel.app/api/revalidate/',
    params := params,
    timeout_milliseconds := 10000
  );

  return null;
end;
$$;

-- Mirrors the tag map in src/lib/db/cacheTags.ts.
drop trigger if exists revalidate_storms on catfisha_typhoons.storms;
create trigger revalidate_storms
  after insert or update or delete or truncate on catfisha_typhoons.storms
  for each statement execute function catfisha_typhoons.revalidate_site('storms');

drop trigger if exists revalidate_typhoonnames on catfisha_typhoons.typhoonnames;
create trigger revalidate_typhoonnames
  after insert or update or delete or truncate on catfisha_typhoons.typhoonnames
  for each statement execute function catfisha_typhoons.revalidate_site('names');

drop trigger if exists revalidate_suggestednames on catfisha_typhoons.suggestednames;
create trigger revalidate_suggestednames
  after insert or update or delete or truncate on catfisha_typhoons.suggestednames
  for each statement execute function catfisha_typhoons.revalidate_site('names');

drop trigger if exists revalidate_facts on catfisha_typhoons.facts;
create trigger revalidate_facts
  after insert or update or delete or truncate on catfisha_typhoons.facts
  for each statement execute function catfisha_typhoons.revalidate_site('facts');

-- Joined into both storm and name queries, so these refresh everything.
drop trigger if exists revalidate_positions on catfisha_typhoons.positions;
create trigger revalidate_positions
  after insert or update or delete or truncate on catfisha_typhoons.positions
  for each statement execute function catfisha_typhoons.revalidate_site();

drop trigger if exists revalidate_imagelicenses on catfisha_typhoons.imagelicenses;
create trigger revalidate_imagelicenses
  after insert or update or delete or truncate on catfisha_typhoons.imagelicenses
  for each statement execute function catfisha_typhoons.revalidate_site();

-- Check delivery after an edit (most recent first):
--   select id, status_code, error_msg, created from net._http_response order by created desc limit 5;
