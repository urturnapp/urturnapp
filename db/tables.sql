-- UR TURN tables (Supabase project "urturn", ref hlbccdgdsbgfuxppqiuc). Column reference, snapshot 2026-10-31.
-- Keys, RLS policies and indexes are not listed here; ask the Supabase connector for the exact schema.
-- urturn_secrets holds the VAPID push keys (service role only) - never copy its values into the repo.
create table urturn_admin (id integer not null default 1, key_hash text not null);
create table urturn_contact (id integer not null default 1, whatsapp text, email text);
create table urturn_errors (day date not null default CURRENT_DATE, slug text not null default '', view text not null default '', msg text not null, ua text, n integer not null default 1, last_at timestamptz not null default now());
create table urturn_orders (id uuid not null default gen_random_uuid(), shop_id uuid not null, num text not null, status text not null default 'waiting', source text not null default 'customer', created_at timestamptz not null default now(), ready_at timestamptz, ring_at timestamptz, done_at timestamptz, rating smallint, eta_at timestamptz, eta_seen timestamptz, has_push boolean not null default false);
create table urturn_push (order_id uuid not null, sub jsonb not null, sent_ring timestamptz, created_at timestamptz default now(), last_push timestamptz, push_n integer not null default 0);
create table urturn_secrets (k text not null, v text not null);
create table urturn_shop_keys (shop_id uuid not null, key_hash text not null);
create table urturn_shops (id uuid not null default gen_random_uuid(), slug text not null, name text not null, color text not null default '#0E5E5A', logo text, review_url text, welcome text, active boolean not null default true, created_at timestamptz not null default now(), open_at time, close_at time);
create table urturn_subscriptions (shop_id uuid not null, plan text not null default 'trial', ends_at timestamptz not null, whatsapp text, notes text, updated_at timestamptz not null default now());

-- pg_cron job "urturn-repeat-push", every 30 seconds: select urturn_repeat_push_tick();
