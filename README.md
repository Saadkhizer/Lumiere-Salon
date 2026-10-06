# Lumière — Salon & Spa (full-stack)

A complete salon/spa website with online booking and an admin dashboard.
**Next.js 16 + Supabase + Tailwind v4.** Everything here is free-tier.

- Public site: home, **services** (+ per-service detail pages), **gallery**,
  **about**, **contact** (with map + message form), plus a **booking** form
  that saves to the database. The homepage also has a *Why choose us* section,
  **offers**, **reviews/testimonials** (visitors can leave one), and an **FAQ**.
- Admin dashboard (`/admin`): manage **appointments**, and full CRUD for
  **services**, **staff**, **reviews** (approve/feature), **gallery**,
  **offers**, and a **messages inbox** from the contact form.
- Works in **demo mode** with built-in sample data *before* you connect any
  backend — so `npm run dev` shows a finished site immediately.
- Every booking / contact also offers a one-tap **WhatsApp** option.

---

## 1. Run it locally (demo mode — no backend needed)

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the site runs on sample data. You can browse
services, open detail pages, and submit the booking form (it will offer a
WhatsApp confirmation). The admin area shows a "connect Supabase" notice until
step 2.

> On Windows PowerShell run commands one per line (no `&&`).

## 2. Connect the database + admin (free Supabase)

1. Create a free project at https://supabase.com.
2. In the Supabase dashboard → **SQL Editor**, paste all of
   `supabase/schema.sql` and click **Run**. This creates the tables, security
   rules (RLS), and sample rows.
3. In the project root, copy `.env.example` to **`.env.local`** and fill in
   your values from Supabase → **Settings → API**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
   ```
4. Create your admin login: Supabase → **Authentication → Users → Add user**
   (set an email + password; tick "auto confirm").
5. Restart the dev server (`npm run dev`). Now bookings save to the database,
   and `/admin` lets you log in and manage everything.

Security note: real access is enforced by Supabase **Row Level Security** —
the public can only read services/staff and create a booking; only a
logged-in staff user can read/edit/delete. The `anon` key is safe in the
browser; never put the `service_role` key in this project.

## 3. Make it yours

- **Brand, phone, WhatsApp number, address** → edit `src/lib/config.js`
  (change `whatsapp` to your number in international format, digits only, e.g.
  `923001234567`).
- **Colours / fonts** → edit the tokens at the top of `src/app/globals.css`
  (one place rebrands the whole site).
- **Photos** → brand images are **bundled locally** in `public/img/*.jpg`
  (atmospheric, soft-focus artwork generated for the salon) so they always load
  with no internet needed. To use real photos of your own salon: replace those
  files (keep the same names), or set a real `Image URL` per item in the admin,
  or upload to Supabase Storage and use that URL.
- **Animations** → GSAP (hero entrance + gentle parallax) and a subtle three.js
  particle backdrop in the hero. Both respect "reduced motion" and degrade
  gracefully if unavailable — the site stays fully visible either way.

## 4. Deploy free (Vercel)

1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com → New Project.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables (same as
   `.env.local`).
4. Deploy — you get a live `https://your-site.vercel.app` URL.

## Project structure

```
src/
  app/
    page.js                 home
    services/page.js        services list
    services/[id]/page.js   service detail
    book/page.js            booking
    gallery/page.js         gallery
    contact/page.js         contact + map + message form
    about/page.js           about
    admin/login/page.js     staff login
    admin/page.js           appointments dashboard
    admin/services/page.js  services CRUD
    admin/staff/page.js     staff CRUD
    admin/reviews/page.js   reviews: approve / feature / delete
    admin/gallery/page.js   gallery CRUD
    admin/offers/page.js    offers CRUD
    admin/messages/page.js  contact inbox
  components/               header, footer, cards, forms, admin shell
  lib/
    config.js               brand + WhatsApp + helpers
    data.js                 fetch (Supabase, with seed fallback)
    seed.js                 demo-mode sample data
    supabase/client.js      browser client
    supabase/server.js      server client
supabase/schema.sql         database + security + seed
```
