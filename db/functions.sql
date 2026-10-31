-- UR TURN database functions (Supabase project urturn). Snapshot 2026-10-31. No secrets.

CREATE OR REPLACE FUNCTION public.urturn_admin_create_shop(p_admin text, p_slug text, p_name text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_shop uuid; v_key text := encode(extensions.gen_random_bytes(12),'hex');
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  insert into urturn_shops(slug, name) values (lower(trim(p_slug)), trim(p_name)) returning id into v_shop;
  insert into urturn_shop_keys(shop_id, key_hash) values (v_shop, urturn_hash(v_key));
  insert into urturn_subscriptions(shop_id, plan, ends_at) values (v_shop, 'trial', now() + interval '7 days');
  return v_key;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_get_contact(p_admin text)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  return (select json_build_object('whatsapp', whatsapp, 'email', email) from urturn_contact where id = 1);
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_health(p_admin text)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  return json_build_object(
    'db_mb', round(pg_database_size(current_database())/1048576.0,1),
    'orders_total', (select count(*) from urturn_orders),
    'shops', coalesce((select json_agg(x order by x.active desc, x.name) from (
       select s.slug, s.name, s.active, s.open_at, s.close_at,
         (select max(o.created_at) from urturn_orders o where o.shop_id=s.id) as last_order,
         (select count(*) from urturn_orders o where o.shop_id=s.id and o.created_at > now()-interval '24 hours') as orders_24h,
         (select count(*) from urturn_orders o where o.shop_id=s.id and o.created_at > now()-interval '7 days') as orders_7d,
         (select count(*) from urturn_orders o where o.shop_id=s.id and o.status in ('waiting','ready') and o.created_at < now()-interval '3 hours') as stuck
       from urturn_shops s) x),'[]'::json),
    'errors', coalesce((select json_agg(e) from (
       select day, slug, view, msg, ua, n, last_at from urturn_errors
       where day > current_date-7 and msg not like 'info:%' and msg not like 'Script error.%' and view <> 'test'
       order by last_at desc limit 40) e),'[]'::json));
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_ok(p_key text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$ select exists(select 1 from urturn_admin where key_hash = urturn_hash(p_key)) $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_reset_key(p_admin text, p_slug text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_key text := encode(extensions.gen_random_bytes(12),'hex');
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  update urturn_shop_keys set key_hash = urturn_hash(v_key) where shop_id = (select id from urturn_shops where slug = p_slug);
  if not found then raise exception 'shop_not_found'; end if;
  return v_key;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_save_shop(p_admin text, p_slug text, p_name text, p_color text, p_logo text, p_review_url text, p_welcome text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  update urturn_shops set name = coalesce(nullif(trim(p_name),''), name), color = coalesce(nullif(p_color,''), color),
    logo = nullif(p_logo,''), review_url = nullif(trim(p_review_url),''), welcome = nullif(trim(p_welcome),'')
  where slug = p_slug;
  if not found then raise exception 'shop_not_found'; end if;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_set_active(p_admin text, p_slug text, p_active boolean)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  if p_slug = 'demo' then raise exception 'demo_locked'; end if;
  update urturn_shops set active = p_active where slug = p_slug;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_set_contact(p_admin text, p_whatsapp text, p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  update urturn_contact set whatsapp = nullif(trim(p_whatsapp),''), email = nullif(trim(p_email),'') where id = 1;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_set_hours(p_admin text, p_slug text, p_open text, p_close text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  update urturn_shops set open_at = nullif(p_open,'')::time, close_at = nullif(p_close,'')::time where slug = p_slug;
  if not found then raise exception 'shop_not_found'; end if;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_set_sub(p_admin text, p_slug text, p_plan text, p_ends_at timestamp with time zone, p_whatsapp text, p_notes text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_shop uuid;
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  select id into v_shop from urturn_shops where slug = p_slug;
  if v_shop is null then raise exception 'shop_not_found'; end if;
  insert into urturn_subscriptions(shop_id, plan, ends_at, whatsapp, notes) values (v_shop, p_plan, p_ends_at, nullif(trim(p_whatsapp),''), nullif(trim(p_notes),''))
  on conflict (shop_id) do update set plan = excluded.plan, ends_at = excluded.ends_at, whatsapp = excluded.whatsapp, notes = excluded.notes, updated_at = now();
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_shops(p_admin text)
 RETURNS TABLE(slug text, name text, created_at timestamp with time zone, orders_7d bigint, avg_rating numeric)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  return query select s.slug, s.name, s.created_at,
    (select count(*) from urturn_orders o where o.shop_id=s.id and o.created_at > now()-interval '7 days'),
    (select round(avg(o.rating),1) from urturn_orders o where o.shop_id=s.id and o.created_at > now()-interval '7 days')
  from urturn_shops s order by s.created_at desc;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_admin_shops2(p_admin text)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  return coalesce((select json_agg(x order by x.active desc, x.ends_at nulls last) from (
    select s.slug, s.name, s.active, s.created_at, sb.plan, sb.ends_at, sb.whatsapp, sb.notes,
      (select count(*) from urturn_orders o where o.shop_id=s.id and o.created_at > now()-interval '7 days') as orders_7d,
      (select round(avg(o.rating),1) from urturn_orders o where o.shop_id=s.id and o.created_at > now()-interval '7 days') as avg_rating
    from urturn_shops s left join urturn_subscriptions sb on sb.shop_id = s.id) x), '[]'::json);
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_cancel_order(p_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ delete from urturn_orders where id = p_id and status = 'waiting' and source = 'customer' $function$
;

CREATE OR REPLACE FUNCTION public.urturn_create_order(p_slug text, p_num text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_shop uuid; v_id uuid;
begin
  select id into v_shop from urturn_shops where slug = p_slug and active;
  if v_shop is null then raise exception 'shop_not_found'; end if;
  if not urturn_sub_ok(v_shop) then raise exception 'subscription_expired'; end if;
  if not coalesce(urturn_is_open(v_shop), true) then raise exception 'shop_closed'; end if;
  p_num := regexp_replace(coalesce(p_num,''), '\D', '', 'g');
  if p_num !~ '^[0-9]{1,8}$' then raise exception 'bad_number'; end if;
  select id into v_id from urturn_orders where shop_id = v_shop and num = p_num and status <> 'done'
    and created_at > now() - interval '12 hours' order by created_at desc limit 1;
  if v_id is not null then return v_id; end if;
  insert into urturn_orders(shop_id, num, source) values (v_shop, p_num, 'customer') returning id into v_id;
  return v_id;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_eta_seen(p_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ update urturn_orders set eta_seen = now() where id = p_id and eta_at is not null and eta_seen is null $function$
;

CREATE OR REPLACE FUNCTION public.urturn_hash(p text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public', 'extensions'
AS $function$ select encode(extensions.digest(coalesce(p,''),'sha256'),'hex') $function$
;

CREATE OR REPLACE FUNCTION public.urturn_is_open(p_shop uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when s.open_at is null or s.close_at is null or s.open_at = s.close_at then true
    when s.open_at < s.close_at then (now() at time zone 'Africa/Cairo')::time >= s.open_at and (now() at time zone 'Africa/Cairo')::time < s.close_at
    else (now() at time zone 'Africa/Cairo')::time >= s.open_at or (now() at time zone 'Africa/Cairo')::time < s.close_at end
  from urturn_shops s where s.id = p_shop $function$
;

CREATE OR REPLACE FUNCTION public.urturn_log_error(p_slug text, p_view text, p_msg text, p_ua text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if p_msg is null or length(trim(p_msg))=0 then return; end if;
  if (select count(*) from urturn_errors where day=current_date) >= 300 then return; end if;
  insert into urturn_errors(slug,view,msg,ua)
  values (left(coalesce(p_slug,''),40), left(coalesce(p_view,''),20), left(p_msg,300), left(p_ua,200))
  on conflict (day,slug,view,msg) do update set n=least(urturn_errors.n+1,100000), last_at=now(), ua=excluded.ua;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_picked_up(p_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ update urturn_orders set status = 'done', done_at = now() where id = p_id and status = 'ready' $function$
;

CREATE OR REPLACE FUNCTION public.urturn_public_status(p_slug text)
 RETURNS json
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ select json_build_object('locked', not urturn_sub_ok(s.id), 'whatsapp', c.whatsapp, 'email', c.email) from urturn_shops s, urturn_contact c where s.slug = p_slug and s.active $function$
;

CREATE OR REPLACE FUNCTION public.urturn_rate(p_id uuid, p_rating integer)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ update urturn_orders set rating = greatest(1, least(5, p_rating)) where id = p_id and status = 'done' $function$
;

CREATE OR REPLACE FUNCTION public.urturn_repeat_push_tick()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if exists (select 1 from urturn_push p join urturn_orders o on o.id=p.order_id
             where o.status='ready' and o.ring_at > now()-interval '5 minutes'
               and p.push_n between 1 and 10 and p.last_push < now()-interval '25 seconds') then
    perform net.http_post(url:='https://hlbccdgdsbgfuxppqiuc.supabase.co/functions/v1/urturn-push',
      body:='{"repeat":true}'::jsonb, headers:='{"Content-Type":"application/json"}'::jsonb);
  end if;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_save_shop(p_slug text, p_key text, p_name text, p_color text, p_logo text, p_review_url text, p_welcome text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$ begin raise exception 'admin_only'; end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_set_push(p_id uuid, p_sub jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not exists(select 1 from urturn_orders where id=p_id and status in ('waiting','ready')) then raise exception 'not_found'; end if;
  if p_sub is null or coalesce(p_sub->>'endpoint','') !~ '^https://' then raise exception 'bad_sub'; end if;
  insert into urturn_push(order_id,sub) values(p_id,p_sub) on conflict(order_id) do update set sub=excluded.sub;
  update urturn_orders set has_push=true where id=p_id and not has_push;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_shop_by_key(p_slug text, p_key text)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$ select s.id from urturn_shops s join urturn_shop_keys k on k.shop_id = s.id where s.slug = p_slug and k.key_hash = urturn_hash(p_key) $function$
;

CREATE OR REPLACE FUNCTION public.urturn_staff_add(p_slug text, p_key text, p_num text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_shop uuid := urturn_shop_by_key(p_slug, p_key); v_id uuid;
begin
  if v_shop is null then raise exception 'not_allowed'; end if;
  if not urturn_sub_ok(v_shop) then raise exception 'subscription_expired'; end if;
  p_num := regexp_replace(coalesce(p_num,''), '\D', '', 'g');
  if p_num !~ '^[0-9]{1,8}$' then raise exception 'bad_number'; end if;
  select id into v_id from urturn_orders where shop_id = v_shop and num = p_num and status <> 'done'
    and created_at > now() - interval '12 hours' limit 1;
  if v_id is not null then return v_id; end if;
  insert into urturn_orders(shop_id, num, source) values (v_shop, p_num, 'cashier') returning id into v_id;
  return v_id;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_staff_check(p_slug text, p_key text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$ select urturn_shop_by_key(p_slug, p_key) is not null $function$
;

CREATE OR REPLACE FUNCTION public.urturn_staff_eta(p_slug text, p_key text, p_id uuid, p_minutes integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_shop uuid := urturn_shop_by_key(p_slug, p_key);
begin
  if v_shop is null then raise exception 'not_allowed'; end if;
  if p_minutes is null or p_minutes < 0 or p_minutes > 120 then raise exception 'bad_minutes'; end if;
  update urturn_orders set eta_at = case when p_minutes = 0 then null else now() + make_interval(mins => p_minutes) end, eta_seen = null
  where id = p_id and shop_id = v_shop and status = 'waiting';
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_staff_set(p_slug text, p_key text, p_id uuid, p_action text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_shop uuid := urturn_shop_by_key(p_slug, p_key);
begin
  if v_shop is null then raise exception 'not_allowed'; end if;
  if p_action = 'ready' then
    update urturn_orders set status='ready', ready_at=now(), ring_at=now() where id=p_id and shop_id=v_shop;
  elsif p_action = 'ring' then
    update urturn_orders set ring_at=now() where id=p_id and shop_id=v_shop and status='ready';
  elsif p_action = 'done' then
    update urturn_orders set status='done', done_at=now() where id=p_id and shop_id=v_shop;
  elsif p_action = 'delete' then
    delete from urturn_orders where id=p_id and shop_id=v_shop;
  else raise exception 'bad_action'; end if;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_staff_status(p_slug text, p_key text)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
declare v_shop uuid := urturn_shop_by_key(p_slug, p_key); r json;
begin
  if v_shop is null then raise exception 'not_allowed'; end if;
  select json_build_object('plan', sb.plan, 'ends_at', sb.ends_at, 'locked', not urturn_sub_ok(v_shop),
    'whatsapp', c.whatsapp, 'email', c.email) into r
  from urturn_contact c left join urturn_subscriptions sb on sb.shop_id = v_shop;
  return r;
end $function$
;

CREATE OR REPLACE FUNCTION public.urturn_sub_ok(p_shop uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ select coalesce((select ends_at > now() from urturn_subscriptions where shop_id = p_shop), true) $function$
;
