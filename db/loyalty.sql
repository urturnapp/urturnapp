-- UR TURN: loyalty stamps (بطاقة الولاء). Adds columns and functions only; changes and deletes no existing data.
-- A stamp = an order from this phone that the cashier marked Ready. After loyal_need stamps, the next order carries the gift.
alter table urturn_shops  add column if not exists loyal_need smallint, add column if not exists loyal_gift text;
alter table urturn_orders add column if not exists dev text, add column if not exists gift boolean not null default false;
create index if not exists urturn_orders_dev on urturn_orders(shop_id, dev) where dev is not null;

-- stamps since the last gift that was handed over (internal)
create or replace function public.urturn_loyal_count(p_shop uuid, p_dev text)
returns int language sql stable security definer set search_path to 'public' as $function$
  select count(*)::int from urturn_orders o
  where o.shop_id=p_shop and o.dev=p_dev and o.ready_at is not null and not o.gift
    and o.created_at > coalesce((select max(g.created_at) from urturn_orders g
        where g.shop_id=p_shop and g.dev=p_dev and g.gift and g.ready_at is not null), '-infinity'::timestamptz)
$function$;
revoke execute on function public.urturn_loyal_count(uuid,text) from public, anon, authenticated;

-- what the customer page shows: {need, gift, n, this_gift}
create or replace function public.urturn_loyal_status(p_slug text, p_dev text, p_order uuid default null)
returns json language plpgsql stable security definer set search_path to 'public' as $function$
declare s urturn_shops; h text;
begin
  select * into s from urturn_shops where slug=p_slug and active;
  if s.id is null or coalesce(s.loyal_need,0)<=0 then return json_build_object('need',0); end if;
  if coalesce(p_dev,'') !~ '^[0-9a-zA-Z-]{16,64}$' then return json_build_object('need',s.loyal_need,'gift',s.loyal_gift,'n',0,'this_gift',false); end if;
  h := urturn_hash(p_dev);
  return json_build_object('need',s.loyal_need,'gift',s.loyal_gift,'n',least(urturn_loyal_count(s.id,h),s.loyal_need),
    'this_gift',coalesce((select o.gift from urturn_orders o where o.id=p_order and o.dev=h),false));
end $function$;

-- link a new order to the phone (once); if the card is full, this order gets the gift
create or replace function public.urturn_set_device(p_id uuid, p_dev text)
returns json language plpgsql security definer set search_path to 'public' as $function$
declare o urturn_orders; s urturn_shops; h text;
begin
  if coalesce(p_dev,'') !~ '^[0-9a-zA-Z-]{16,64}$' then raise exception 'bad_dev'; end if;
  select * into o from urturn_orders where id=p_id and status='waiting' and created_at>now()-interval '15 minutes';
  if o.id is null then raise exception 'not_found'; end if;
  select * into s from urturn_shops where id=o.shop_id;
  h := urturn_hash(p_dev);
  if o.dev is null then
    update urturn_orders set dev=h where id=p_id;
    if coalesce(s.loyal_need,0)>0
       and urturn_loyal_count(s.id,h) >= s.loyal_need
       and not exists(select 1 from urturn_orders g where g.shop_id=s.id and g.dev=h and g.gift and g.ready_at is null and g.status in ('waiting','ready')) then
      update urturn_orders set gift=true where id=p_id;
    end if;
  end if;
  return urturn_loyal_status(s.slug, p_dev, p_id);
end $function$;

-- admin: turn loyalty on/off per shop (need 0 = off)
create or replace function public.urturn_admin_set_loyal(p_admin text, p_slug text, p_need int, p_gift text)
returns void language plpgsql security definer set search_path to 'public' as $function$
begin
  if not urturn_admin_ok(p_admin) then raise exception 'not_allowed'; end if;
  update urturn_shops set loyal_need = case when coalesce(p_need,0) between 2 and 20 then p_need else null end,
                          loyal_gift = nullif(left(trim(coalesce(p_gift,'')),60),'')
   where slug=p_slug;
end $function$;

grant execute on function public.urturn_loyal_status(text,text,uuid) to anon, authenticated;
grant execute on function public.urturn_set_device(uuid,text) to anon, authenticated;
grant execute on function public.urturn_admin_set_loyal(text,text,int,text) to anon, authenticated;
