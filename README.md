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
