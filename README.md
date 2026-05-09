# Unfiltered Barbershop - Premium Booking Platform

> **Production-ready, full-stack luxury barbershop booking system built with Next.js 14, Prisma, PostgreSQL, and NextAuth.**

---

## Overview

Unfiltered Barbershop is a SaaS-quality, full-stack web application for a premium modern barbershop located at **1706 Erringer Rd Suite #4, Simi Valley, CA 93065**. The platform delivers a luxury booking experience comparable to Booksy, with a design aesthetic inspired by Apple, Tesla, and high-end creative agencies.

**Live rating:** 5.0 ⭐ with 585+ verified Google reviews.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design system |
| UI Components | Radix UI primitives |
| Animations | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Auth | NextAuth v4 (JWT strategy) |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Email | Resend |
| SMS | Twilio (optional) |
| Deployment | Vercel-ready |

---

## Features

### Customer-Facing
- **Cinematic homepage** — hero, trust bar, about, services, team, gallery, testimonials, FAQ, map, CTA
- **Multi-step booking flow** — service → add-ons → date/time → barber → summary → info → confirmation
- **Real-time availability** — dynamic slot generation based on barber schedules and existing bookings
- **House Call booking** — special flow for $300 premium in-home service (40-mile radius)
- **Email confirmations** — instant booking receipts with full details via Resend
- **All standalone pages** — /services, /team, /gallery, /contact, /faq
- **Mobile-first** — sticky booking button, swipe-friendly calendar, thumb-optimized UI

### Admin Dashboard (/admin)
- Booking management — view, filter, search, update status
- Barber management — schedules, availability, house call toggle
- Message center — contact form submissions
- Revenue overview — daily/monthly stats
- Protected routes — admin-only via NextAuth + middleware

### Technical
- Server-side validation on all API routes
- Rate limiting on contact/booking endpoints
- Honeypot spam protection
- Double-booking prevention with conflict detection
- SEO — metadata, OpenGraph, Twitter cards, JSON-LD, sitemap, robots.txt
- Security headers — X-Frame-Options, CSP, Referrer-Policy

---

## Getting Started

### Prerequisites
- Node.js 18.17+
- PostgreSQL database (local or hosted)
- Resend account (for email)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/unfiltered-barbershop.git
cd unfiltered-barbershop

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# → Edit .env.local with your values
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data (barbers, services, FAQs, testimonials, admin user)
npm run db:seed
```

**Default admin credentials — change immediately after first login:**
- Email: `admin@unfilteredbarbershop.com`
- Password: `admin123!`

### Development

```bash
npm run dev
# → http://localhost:3000
# → Admin: http://localhost:3000/admin
```

### Production Build

```bash
npm run build
npm start
```

---

## Deployment (Vercel — Recommended)

1. Push this repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Connect a PostgreSQL database (**Neon** recommended — free, serverless)
5. Set `NEXTAUTH_URL` to your production domain (e.g. `https://unfilteredbarbershop.com`)
6. Deploy — Prisma generates automatically via `postinstall`

### Recommended Free-Tier Services

| Service | Purpose |
|---|---|
| [Neon](https://neon.tech) | PostgreSQL database |
| [Resend](https://resend.com) | Email (3,000 emails/month free) |
| [Vercel](https://vercel.com) | Hosting + CDN |
| [Cloudinary](https://cloudinary.com) | Image hosting/optimization |

---

## Project Structure

```
unfiltered-barbershop/
├── app/
│   ├── page.tsx                    # Homepage (all sections)
│   ├── layout.tsx                  # Root layout + SEO + JSON-LD
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── booking/page.tsx            # Multi-step booking flow
│   ├── services/page.tsx
│   ├── team/page.tsx
│   ├── gallery/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── login/page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Sidebar nav + auth guard
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── bookings/page.tsx
│   │   ├── barbers/page.tsx
│   │   └── messages/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth
│       ├── bookings/               # Create + fetch bookings
│       ├── availability/           # Real-time slot availability
│       ├── contact/                # Contact form + rate limit
│       ├── services/               # Service catalog
│       └── admin/                  # Admin-protected CRUD
├── components/
│   ├── layout/navbar.tsx
│   ├── layout/footer.tsx
│   ├── home/                       # Hero, trust bar, services, team...
│   ├── booking/                    # 7 booking step components
│   └── admin/                      # Admin UI components
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── email.ts                    # Resend templates
│   ├── utils.ts                    # Shared helpers + constants
│   ├── validations.ts              # Zod schemas
│   └── booking-store.ts            # Zustand booking state
├── prisma/
│   ├── schema.prisma               # 13 database models
│   └── seed.ts
├── types/
│   ├── booking.ts
│   └── next-auth.d.ts
├── middleware.ts                   # Route protection
└── .env.example
```

---

## Database Models

| Model | Description |
|---|---|
| User | Customer accounts + admin users |
| Account / Session | NextAuth OAuth support |
| Barber | Barber profiles + house call flag |
| Service | 7 services with pricing + duration |
| AddOn | 4 service add-ons |
| Booking | Complete booking with status tracking |
| BookingItem | Per-booking line items |
| BarberAvailability | Weekly schedule per barber |
| BlockedDate | Per-barber day blocks |
| GalleryImage | CMS gallery |
| Testimonial | Featured reviews |
| FAQ | Accordion FAQ entries |
| ContactMessage | Contact form submissions |

---

## Services & Pricing

| Service | Price | Duration | Notes |
|---|---|---|---|
| Haircut | $45 | 60 min | +$20 before 9am / after 7pm |
| Haircut w/ Enhancement | $50 | 60 min | |
| Haircut & Design | $55 | 75 min | |
| Haircut & Beard | $60 | 60 min | +$20 before 9am / after 7pm |
| Beard Trim & Line Up w/ Hot Towel | $30 | 45 min | |
| Shape Up (No Beard) | $20 | 15 min | |
| **House Call** | **$300** | **3 hrs** | 40-mile radius |

**Add-ons:** Eyebrows (+$5) · Hot Towel (+$5) · Hair Wash (+$10) · Enhancement Upgrade (+$10)

---

## Business Hours

| Day | Hours |
|---|---|
| Sunday | 10 AM – 2 PM |
| Monday – Friday | 9 AM – 7 PM |
| Saturday | 9 AM – 5 PM |

---

## Environment Variables

See `.env.example` for the complete list. Minimum required:

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
RESEND_API_KEY=
ADMIN_EMAIL=
```

Generate `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

---

## Customization

**Colors** → `app/globals.css` CSS variables + `tailwind.config.ts` brand tokens

**Add a barber** → Admin dashboard `/admin/barbers` or Prisma Studio (`npm run db:studio`)

**Update services** → Admin dashboard or edit `prisma/seed.ts` and re-seed

**Business hours** → `lib/utils.ts` → `BUSINESS_HOURS` + `prisma/seed.ts` barber availability

---

## Security

- All admin routes protected by NextAuth middleware
- Input validated server-side via Zod on every API route
- Passwords hashed with bcryptjs (12 rounds)
- Rate limiting on public endpoints
- Honeypot field on all public forms
- HTTP security headers configured
- All queries via Prisma ORM — no raw SQL

---

**© 2025 Unfiltered Barbershop — Simi Valley, CA. All rights reserved.**
