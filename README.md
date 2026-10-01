# SABA READYMADE

A full-stack, responsive clothing shop for SABA READYMADE in Laheriyasarai, Darbhanga. Customers can browse, search, filter, add products to a persistent guest cart, check out with cash on delivery, and track an order without making an account. A separate authenticated store studio manages the catalog, categories, orders, stock, homepage, and shop details.

## Stack

- **Customer and admin UI:** React 18, TypeScript, Vite, React Router, Lucide icons, responsive CSS
- **API:** Node.js, Express, TypeScript, Zod validation, Helmet, rate-limited admin sign-in
- **Database:** Prisma ORM and persistent SQLite (no separate database server required to get started)
- **Admin access:** bcrypt password hashes and an HTTP-only, SameSite=Strict, expiring JWT cookie

SQLite is a real relational database and is used here so a local shop can get started without installing PostgreSQL. The schema is defined in Prisma and can be migrated to a hosted database when deployment requirements call for it.

## Project structure

```text
.
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── admin/                 # Private store studio and management screens
│   │   ├── components/            # Reusable customer storefront components
│   │   ├── App.tsx                 # Customer routes and shopping flows
│   │   ├── api.ts                  # Typed API helper
│   │   ├── cart.tsx                # Persistent, variant-aware guest cart
│   │   └── styles.css              # Responsive customer and admin styles
│   └── vite.config.ts              # Local API proxy
├── server/
│   ├── prisma/
│   │   ├── schema.prisma           # Products, categories, admins, orders and settings
│   │   └── seed.ts                 # Idempotent starter catalog
│   ├── scripts/create-admin.ts
│   └── src/
│       ├── index.ts                # Express app, security and errors
│       ├── middleware.ts           # Admin authentication and route helpers
│       ├── routes.ts               # Customer and admin REST API
│       └── db.ts
└── package.json                    # Workspace and convenience commands
```

## Prerequisites

- Node.js 20 or newer and npm
- No PostgreSQL server, payment provider, image host, or Maps API key is required for local development.

## Install and start

Run these commands in the project root:

```powershell
npm install
Copy-Item server\.env.example server\.env
npm run db:generate
npm run db:migrate -w server -- --name initial
npm run db:seed
npm run admin:create
npm run dev
```

The customer shop runs at <http://localhost:5173>, and the API runs at <http://localhost:4000>. Both development processes run together with `npm run dev`.

No admin account or shared password is shipped in the seed data. Before creating your first admin, edit `server\.env` and set `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Use a unique, randomly generated secret of at least 32 characters and a strong password of at least 12 characters. The setup script refuses to replace an existing admin account. Admin passwords are never sent to the browser or stored as plaintext.

Open <http://localhost:5173/admin> to sign in to the separate store studio.

To deliberately reset an existing admin password, first set the new `ADMIN_PASSWORD` in the private service environment, then run `npm run admin:reset -w server` once against that service. This explicit maintenance command updates only the matching `ADMIN_EMAIL`; normal deploy startup never changes an existing password.

The protected admin studio includes sales and order summaries, product search/category/stock filters, price and inventory editing, multi-image URL fields, storefront visibility controls, category management, homepage settings, and order status updates. Orders can be tracked through Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered, or Cancelled. Cancelling an order requires confirmation and restores its reserved stock.

Admin registration is invite-only. A signed-in admin can open **Admin access** in the studio to create a one-time invitation for an email address. Share the displayed private link directly with that person; it expires after 24 hours. The invitee creates a password of at least 12 characters and is signed in automatically. Public sign-up without a valid invitation is not allowed.

## Publish on Render

### Free hosting with Render and Neon

The Render Blueprint deploys a free web service and uses a separate PostgreSQL database so orders and store data do not disappear when the free web service sleeps or redeploys. The production PostgreSQL schema and migrations are in `server/prisma-postgres/`; local development continues to use SQLite.

1. Create a free Neon project at <https://neon.tech>. Copy both PostgreSQL connection strings from its **Connect** dialog: the **pooled** URL (hostname contains `-pooler`) and the **direct** URL (no `-pooler`).
2. In Render choose **New → Blueprint**, connect this GitHub repository, and apply `render.yaml`. Choose the **Free** service plan. When asked for environment values, paste the pooled URL into `DATABASE_URL`, the direct URL into `DATABASE_URL_UNPOOLED`, and enter the admin email and a unique password of at least 12 characters. Render generates `JWT_SECRET`.
3. Wait for the first deploy to finish. The service runs PostgreSQL migrations, seeds the 80-product catalog, and creates the initial protected admin automatically.
4. Open `https://<your-service>.onrender.com` for the shop and `/admin` for the store studio. Keep the Neon connection string and admin password private.
5. If the admin password is forgotten later, update `ADMIN_PASSWORD` under the Render service's **Environment** settings, deploy the change, then use the service **Shell** to run `npm run admin:reset -w server` once. The command hashes the new password and updates the existing admin account.

Free hosting has trade-offs: the Render website sleeps after 15 minutes without traffic and may take about a minute to wake up. Render's free service can restart and has usage limits; Neon Free is permanent under its current plan but also has storage and compute quotas. This is a free hobby deployment, not a production uptime guarantee. Watch both providers' current quotas and back up the Neon database.

## Environment variables

The starter template is `server/.env.example`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma database URL; local default is `file:./dev.db`; hosted service uses the Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign the expiring admin session cookie |
| `ADMIN_EMAIL` | Email for `npm run admin:create` |
| `ADMIN_PASSWORD` | Initial admin password; never add this to the client |
| `CLIENT_ORIGIN` | Exact browser origin allowed to call the API |
| `PORT` | API port (default `4000`) |
| `NODE_ENV` | Set to `production` to enable secure cookies |

## Database and sample catalog

The migrations create the relational tables for administrators, admin invitations, categories, products, orders, order items, and store settings. The seed script can be safely run again: it adds or updates the starter categories and inserts missing sample products without resetting products already edited in the admin panel. The expanded catalog includes men's, boys' and girls' ready-made styles; gender and garment subcategory are searchable product tags, so the existing catalog, search, and filter system handles them without a separate product model.

To regenerate Prisma Client after changing the schema:

```powershell
npm run db:generate
npm run db:migrate -w server -- --name describe_your_change
```

There are 80 editable sample products across 17 categories, including 63 additional men's, boys' and girls' styles. Product descriptions, prices, variants, inventory, flags, searchable style tags and images are persisted in the existing database. The sample image URLs use Unsplash; replace them with shop-owned image URLs when the real catalog is ready.

The default store contact details are phone `918210869821`, WhatsApp `918210869821`, and `Gudri Bazar, Laheriyasarai, Darbhanga, Bihar`. They can be changed in the admin store settings.

## Shopping and order behavior

- Customer routes are public; no customer login, signup, registration, or account is provided.
- Cart items are saved in the browser's `localStorage`, grouped by product, size, and color.
- Checkout accepts guest delivery details and Cash on Delivery. The API reads current catalog prices, validates variants and stock, creates an order, and deducts inventory in a database transaction.
- Delivery is ₹99 for orders below ₹1,999 and free from ₹1,999. The server calculates the fee; the browser's displayed total is not trusted.
- Order tracking requires both the order ID and the same 10-digit mobile number used at checkout. It returns only a limited tracking view.
- Online payments are not enabled. There is no payment gateway configured.

## Store management

Sign in at `/admin`. The studio includes:

- Sales and order overview, recent orders and low/out-of-stock counts
- Product creation, editing, removal, pricing, discount, image URLs, variants, inventory and homepage flags
- Category creation, visibility controls and deletion when no products remain
- Order search, status filters, delivery/customer information and order status management
- Store identity, contact information, homepage announcement and hero content

Category names can be changed from the Categories screen. An order's product snapshot is retained when an administrator updates the catalog.

## API overview

Public routes:

- `GET /api/health`, `/api/products`, `/api/products/:id`, `/api/categories`, `/api/store`
- `POST /api/orders`, `POST /api/orders/track`

Admin routes use the `saba_admin` HTTP-only cookie. Sign-in, sign-out and session check:

- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`

Authenticated routes:

- `/api/admin/dashboard`, `/api/admin/products`, `/api/admin/categories`, `/api/admin/orders`, `/api/admin/store`

## Production build

```powershell
npm run build
```

The built customer application is written to `client/dist`; the compiled API is written to `server/dist`. For a production deployment, configure a persistent database location (or migrate the Prisma provider to PostgreSQL), set production-only secrets and `NODE_ENV=production`, set `CLIENT_ORIGIN` to the actual HTTPS storefront origin, run migrations, and serve the static client from a web server/CDN with `/api` routed to the Express service. Back up the SQLite database if you keep SQLite. Set up HTTPS before using the secure production admin cookie.

Image hosting and Google Maps API services are not configured. Products accept image URLs, and the contact page links to Google Maps search without claiming a Maps integration. Online payment must be connected to a real provider before it is offered.

## Checks

```powershell
npm run build
npm test
```

The admin dashboard is private to authenticated administrators. Do not expose the Express API or SQLite file through static hosting.

---

SABA READYMADE · Owner: Mr. MD Jawed Equbal · Website developed by Mr. Amber Rehan
