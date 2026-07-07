# Car Edits

Premium automotive photography & cinematic video production platform — marketing site, portfolio, pricing, and a full online booking engine, for Car Edits (Kolkata, serving PAN India).

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Styling:** Tailwind CSS v4, `next/font` (Bebas Neue / Montserrat / Inter)
- **Database:** Prisma ORM + Postgres (see docker-compose.yml for a local instance, or point at any Postgres provider)
- **State:** Zustand (booking wizard), React Hook Form + Zod (forms/validation)
- **Animation:** Framer Motion
- **Icons:** lucide-react (+ hand-rolled SVGs for brand/social icons lucide no longer ships)

## Getting Started

```bash
docker compose up -d db  # starts a local Postgres container on :5432
npm install
npx prisma db push       # applies the schema (no migration history yet)
npm run db:seed          # seeds services, packages, portfolio, reviews, blog posts, time slots
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres instance (the bundled docker-compose one is `postgresql://caredits:caredits@localhost:5432/caredits`) — sandbox payments work with zero further configuration.

## What's Built (Phase 1)

The full marketing site and booking engine, wired to a real database:

- **Marketing site:** Home, About, Services (13 pages), Portfolio (filterable masonry + lightbox), Gallery, Pricing, Reviews, FAQs, Contact (working form → DB), Blog (DB-backed), legal pages (Privacy/Terms/Refund/Cancellation)
- **Booking engine:** 8-step wizard (service → package → date → time slot → location → details → summary → payment) that reads real availability from the database and creates a `Booking` record with a generated booking reference
- **Payments:** Razorpay integration scaffolded in `src/lib/payments/razorpay.ts`. Without `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` set, the flow runs in **sandbox mode** — it simulates a successful payment so the whole booking flow can be tested end to end, and the UI clearly labels this as sandbox.
- **SEO:** per-page metadata, Open Graph/Twitter cards, JSON-LD `LocalBusiness` schema, dynamic `sitemap.xml` (services + blog posts included) and `robots.txt`
- **Data model:** a complete Prisma schema (`prisma/schema.prisma`) already covers users/roles, bookings, payments, coupons, photographers, reviews, blog, support tickets, wishlist — ready for Phase 2 features below.

## What's Not Built Yet (Phase 2)

These were in the original brief but need real accounts/credentials or significantly more scope, so they were deliberately left for a follow-up phase rather than stubbed out shallowly:

- **Authentication:** phone/OTP login, Google login, email verification — needs an SMS/OTP provider (e.g. Twilio Verify) and NextAuth wiring (env vars already scaffolded in `.env.example`)
- **User dashboard:** profile, booking history, reschedule/cancel, invoices, wishlist, support tickets — the Prisma models exist (`User`, `WishlistItem`, `SupportTicket`), the UI does not yet
- **Admin panel:** revenue dashboard, booking management, photographer assignment, coupons, calendar/slot management, content CMS for portfolio/blog
- **Live payments:** flip on by adding `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` and building the client-side Razorpay Checkout widget on top of the existing order-creation scaffold
- **Real notifications:** the confirmation page currently says what *would* be sent — wiring real email (SMTP), SMS and WhatsApp Business API sends needs provider accounts
- **GST invoicing, coupons at checkout, referral program, gift cards** — schema exists, flows don't yet

## Project Structure

```
prisma/
  schema.prisma       # full data model
  seed.ts              # seeds services/packages/portfolio/reviews/blog/time slots
src/
  app/                 # routes (App Router)
    api/               # bookings, timeslots, payment, contact
    book/              # booking wizard + confirmation page
    services/[slug]/   # 13 dynamic service pages
    blog/[slug]/        # DB-backed blog posts
  components/
    booking/            # 8-step wizard + steps
    home/                # homepage sections
    ui/                  # Button, Badge, Logo, PlaceholderMedia, etc.
  lib/
    data/                # static content (services, packages, portfolio, faqs...)
    payments/razorpay.ts # payment scaffold (sandbox fallback)
    validations/         # zod schemas
  store/booking-store.ts # zustand wizard state
```

## Deployment

Set `DATABASE_URL` to a reachable Postgres instance (Neon, Supabase, Vercel Postgres, Hostinger, etc.) as an environment variable on your host — the `build` script runs `prisma db push` automatically before `next build`, so the schema syncs on every deploy with no manual migration step. Also set `NEXTAUTH_SECRET` (any random string) for login sessions to work.

**Vercel:** push to a Git repo and import into Vercel. Add `DATABASE_URL`, `NEXTAUTH_SECRET`, and any payment/notification env vars, then deploy.

**Docker:** `docker compose up --build` starts the app plus a Postgres container (see `docker-compose.yml`), which already wires `DATABASE_URL` for you.

## Brand System

Colors, type, spacing and component rules are documented in the original brand kit; the working values live in `src/app/globals.css` (`--color-*` tokens) and `src/lib/site-config.ts` (copy, contact details, nav).
