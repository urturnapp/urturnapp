# UR TURN: guide for whoever works on this next

> **بالعربي باختصار:** هاد الملف بيشرح النظام كامل لأي Claude أو مبرمج بيستلم المشروع. أول ما تبلّش بحساب جديد، اربط GitHub (هالمستودع) وSupabase، وقلّه: "اقرأ CLAUDE.md وكمّل من هون". ما فيه أي كلمة سر. روابط الأدمن والمفاتيح محفوظة عند صاحب المشروع بس.

## What it is
UR TURN turns a café customer's phone into a pager. The customer scans the counter QR, types their receipt number, and their phone rings when the cashier taps "Ready". Then it asks for a Google review. No app install needed. Market: Egypt. Owner: MOHPTON (writes in Levantine Arabic, **always reply in Arabic**).

- Live: https://urturnapp.github.io/urturnapp/ (GitHub Pages from `main` of this repo, about 10 minutes of cache after a push)
- Beta: https://urturnapp.github.io/urturnapp/beta/ (same database)
- First real shop: Cupresso, slug `cupresso-egypt`, open 10:00 to 02:00 Cairo time, live since 2026-10-30.
- Pricing: 1,500 EGP/month or 15,000 EGP/year, 7-day free trial, free QR stand.

## Owner's rules (follow them strictly)
1. **The QR link and the cashier link must never change.** Every shop has these printed or installed.
2. **Beta first.** Change files in `beta/`, run the tests, push, and let the owner try it on iPhone and Samsung. Only move it live (`scripts/promote.sh`) after the owner says "انقلها" or "نفّذ".
3. **Small, clearly correct bug fixes** may go live right away: save a `stable-*` branch of the current live first, pass all tests, then tell the owner what changed.
4. **"ما تصلح اشي و تخرب اشي"**: never fix one thing and break another. Run the full suite before every push.
5. When the owner asks "منقدر...؟" (can we...?), answer and show a plan or preview first. Don't build until they say "نفّذ".
6. Never delete data, and never change subscriptions without asking. The one standing exception: after a shop's `close_at`, orders still `waiting` or `ready` from that working day may be set to `done` (never deleted, never the `demo` shop).
7. Never put keys or passwords in this repo or in memory.

## Code layout
| File | Part |
|---|---|
| `index.html` | Loads `core.js`, then only the part the page needs |
| `core.js` | Shared: settings, Arabic/English texts, server access (`Api`), sounds (`Ring`), push (`Push`), install prompt, auto-update |
| `customer.js` | Customer page: enter number, waiting screen, full-screen alert/install steps (`gateHTML`), ringing, rating |
| `cashier.js` | Cashier screen (orders, Ready, prep-time buttons, 🔔/🔕 per order) and read-only owner reports |
| `admin.js` | Admin panel: create/edit/archive shops, subscriptions, system health |
| `home.js` | Landing page and live demo |
| `sw.js`, `manifest.json` | Service worker (push notifications) and home-screen app |
| `app.js` | Old single-file version, kept only so old cached pages still work |

URLs: customer `?s=<slug>`, cashier `?s=<slug>&v=cashier&k=<shop key>`, reports `?s=<slug>&v=owner&k=<shop key>`, admin `?v=admin&k=<admin key>`, installed app `?v=app`.

## Release process
```bash
# 1. edit files in beta/
scripts/bump.sh beta          # new version number, so phones reload
tests/run-all.sh beta         # must say ALL PASSED
git push                      # owner tests at /beta/
# 2. after the owner says "انقلها":
git branch stable-pre-<what>-<date> origin/main && git push origin stable-pre-<what>-<date>
scripts/promote.sh            # tests beta, copies to live, tests live
git commit -am "..." && git push
```
Every fixed bug gets a check in `tests/` plus a line in `tests/expected.txt` (`file|regex`). Tests use Playwright with mocked Supabase, so they never touch real data.
To roll back: copy the files from the latest `stable-*` branch and push.

## Database (Supabase)
- Project **"urturn"**, ref `hlbccdgdsbgfuxppqiuc`, Frankfurt, free plan, in the owner's org "Azmielw's Org". **Never touch the separate "Azmi" project.**
- Table and column reference: `db/tables.sql`. All functions: `db/functions.sql`. Push edge function: `db/edge/urturn-push/index.ts`.
- The site only talks to the database through `urturn_*` functions. Staff and admin keys are stored only as hashes.
- Push: the customer saves a subscription with `urturn_set_push` (also sets `urturn_orders.has_push`). The cashier's Ready calls the edge function `urturn-push`. The pg_cron job `urturn-repeat-push` (every 30s) re-sends every ~30s for 5 minutes until pickup. VAPID keys live in `urturn_secrets` (never copy them out).
- Client errors land in `urturn_errors`. The admin "صحة السيستم" panel reads `urturn_admin_health`.
- Free plan limits: about 3 busy shops. Suggest Supabase Pro ($25/month) at about 3 paying shops or Egress over 70%. A free project pauses after 7 days with no activity.

## Hourly health check (recreate it on a new account)
Schedule: `CRON_TZ=Africa/Cairo 13 0,3,10-23 * * *`. What it does:
1. `git pull`, then `tests/run-all.sh .` and `tests/run-all.sh beta`.
2. Read-only on Supabase: new rows in `urturn_errors` (ignore `info:` / `Script error.` / view `test`); per shop the last order, orders in the last 24h, orders stuck in waiting/ready for over 3h, open shops with no orders for 3h+, failed pushes; subscriptions ending within 3 days; database size; security advisors; failures of the `urturn-repeat-push` cron job.
3. After a shop's close time, close its leftover orders (status `done`, never delete, never `demo`).
4. Fix bugs as in the release rules above. If live breaks for shops, roll back to the last `stable-*` branch.
5. Messages in Levantine Arabic: at 10:13 always one short morning summary; at other times only if something needs attention or was fixed.

## Other project material
Marketing files, previews, shop messages and the private links file live in the Claude project's files (`/mnt/project-files/ur-turn/`). The owner keeps their own copy. Contacts: WhatsApp +201055602979, Instagram @urturn.app, email urturnapp1@gmail.com.
