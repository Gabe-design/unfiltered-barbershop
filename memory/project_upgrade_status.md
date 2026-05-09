---
name: Upgrade phase 2 status
description: What was built in the growth-system upgrade and what still needs environment wiring
type: project
---

Completed the full upgrade to the "local appointment-growth system" prompt.

**New files created:**
- `app/api/admin/settings/route.ts` — GET/PATCH AppSettings
- `app/api/admin/customers/route.ts` — CRM with search/filter/pagination
- `app/api/admin/reviews/route.ts` — review request management + auto-send on COMPLETED
- `app/api/admin/promos/route.ts` — promo campaign CRUD
- `app/api/admin/abandoned/route.ts` — abandoned booking management + follow-up email
- `app/api/admin/referrals/route.ts` — referral code + referral management
- `app/api/admin/loyalty/route.ts` — loyalty/VIP profile management
- `app/api/admin/email-templates/route.ts` — email template CRUD
- `app/api/admin/services/route.ts` — services CRUD
- `app/api/admin/gallery/route.ts` — gallery image CRUD
- `app/api/admin/seo-pages/route.ts` — SEO page CRUD
- `app/api/track/route.ts` — public client-side event tracking
- `app/api/abandoned/route.ts` — public abandoned booking save
- `app/api/review-request/[token]/route.ts` — review click tracking + redirect
- `app/admin/analytics/page.tsx` — full analytics dashboard
- `app/admin/settings/page.tsx` — platform settings UI
- `app/admin/customers/page.tsx` — CRM table + detail panel
- `app/admin/reviews/page.tsx` — review request management
- `app/admin/promos/page.tsx` — promo campaign manager with form modal
- `app/admin/abandoned/page.tsx` — abandoned booking recovery with follow-up
- `app/admin/referrals/page.tsx` — referral codes + referrals table
- `app/admin/loyalty/page.tsx` — loyalty/VIP table with inline status changes
- `app/admin/email-templates/page.tsx` — email template editor
- `app/admin/services/page.tsx` — services table + form modal
- `app/admin/gallery/page.tsx` — gallery grid + add/toggle/remove
- `app/seo/[slug]/page.tsx` — SEO landing pages with JSON-LD
- `app/review/page.tsx` — QR code review page
- `prisma/seed-seo.ts` — seeds 5 local SEO pages + AppSettings
- `lib/email.ts` extended with: sendReviewRequest, sendRebookingReminder, sendAbandonedBookingFollowUp, sendReferralInvite
- `app/api/admin/bookings/route.ts` updated to auto-trigger review request on COMPLETED

**Why:** Was already built (Prisma schema complete, nav sidebar referenced all pages) but none of the admin pages or growth APIs existed.

**How to apply:** 
- Run `prisma/seed-seo.ts` once the database is connected: `npx ts-node prisma/seed-seo.ts`
- TypeScript compiles clean (0 errors) after `prisma generate` was run
- VS Code TS server may need restart after `prisma generate` to clear stale types
