# UR TURN

The customer's phone becomes the pager. Customers scan the counter QR, enter their receipt number, and their phone rings when the cashier taps "Ready".

Static site (GitHub Pages) + Supabase (tables and functions prefixed `urturn_`).

| Page | URL |
| --- | --- |
| Home / pitch | `./` |
| Live demo (split view) | `?v=demo` |
| Customer page (QR target) | `?s=<shop>` |
| Cashier screen | `?s=<shop>&v=cashier&k=<shop key>` |
| Shop settings | `?s=<shop>&v=owner&k=<shop key>` |
| Admin (create shops) | `?v=admin&k=<admin key>` |

Staff and admin keys are checked by the database functions; only their hashes are stored.

## How the code is organised (since 2026-10-30)

Each part of the site is its own file, so a problem in one part cannot break the others:

| File | Part |
|---|---|
| `core.js` | Shared: settings, texts (AR/EN), server access, sounds, notifications, auto-update |
| `customer.js` | Customer page: order, ringing, home-screen app, QR scanner |
| `cashier.js` | Cashier screen, new-order alert, owner reports |
| `admin.js` | Admin panel: shops, subscriptions, system health |
| `home.js` | Landing page and live demo |

`index.html` loads `core.js`, then only the part the page needs.

### Safe changes: beta first, then live
1. Change files in `beta/` → `scripts/bump.sh beta` → push. Test at `/urturnapp/beta/`.
2. `tests/run-all.sh beta` runs every check (customer, cashier, ringing, home-screen icon, alerts, phones).
3. When approved: `scripts/promote.sh` re-runs all checks, copies beta to live, checks again.
4. Every fixed bug gets a new check in `tests/` + a line in `tests/expected.txt`, so it can't come back.

Safe copy of the last approved version: branch `stable-2026-10-30`.
