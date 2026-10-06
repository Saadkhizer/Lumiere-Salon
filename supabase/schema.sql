-- ===========================================================================
-- Lumière Salon — database schema, security, and seed data.
-- Run this in Supabase → SQL Editor (paste all, click Run).
-- ===========================================================================

-- ---- Tables ----------------------------------------------------------------
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text,
  description   text,
  price         integer not null default 0,   -- PKR
  duration_min  integer not null default 30,
  image_url     text,
  featured      boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists public.staff (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  bio         text,
  image_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.appointments (
  id                uuid primary key default gen_random_uuid(),
  service_id        uuid references public.services(id) on delete set null,
  staff_id          uuid references public.staff(id) on delete set null,
  customer_name     text not null,
  customer_phone    text not null,
  appointment_date  date not null,
  appointment_time  text not null,
  notes             text,
  status            text not null default 'pending',  -- pending | confirmed | done | cancelled
  created_at        timestamptz not null default now()
);

-- ---- Row Level Security ----------------------------------------------------
alter table public.services     enable row level security;
alter table public.staff        enable row level security;
alter table public.appointments enable row level security;

-- Table privileges MUST be granted too — RLS runs AFTER privilege checks.
grant select on public.services to anon, authenticated;
grant select on public.staff    to anon, authenticated;
grant insert on public.appointments to anon, authenticated;   -- public can book
grant select, insert, update, delete on public.services     to authenticated;
grant select, insert, update, delete on public.staff        to authenticated;
grant select, update, delete on public.appointments         to authenticated;

-- Policies (drop-if-exists so re-running is safe)
drop policy if exists services_public_read  on public.services;
drop policy if exists services_admin_write  on public.services;
drop policy if exists staff_public_read     on public.staff;
drop policy if exists staff_admin_write     on public.staff;
drop policy if exists appt_public_insert    on public.appointments;
drop policy if exists appt_admin_read       on public.appointments;
drop policy if exists appt_admin_update     on public.appointments;
drop policy if exists appt_admin_delete     on public.appointments;

create policy services_public_read on public.services for select to anon, authenticated using (true);
create policy services_admin_write on public.services for all    to authenticated using (true) with check (true);

create policy staff_public_read on public.staff for select to anon, authenticated using (true);
create policy staff_admin_write on public.staff for all    to authenticated using (true) with check (true);

create policy appt_public_insert on public.appointments for insert to anon, authenticated with check (true);
create policy appt_admin_read    on public.appointments for select to authenticated using (true);
create policy appt_admin_update  on public.appointments for update to authenticated using (true) with check (true);
create policy appt_admin_delete  on public.appointments for delete to authenticated using (true);

-- ---- Seed data -------------------------------------------------------------
insert into public.services (name, category, description, price, duration_min, image_url, featured) values
('Haircut & Style',     'Hair',   'A precision cut tailored to your face shape, finished with a blow-dry and style.', 1800, 45,  '/img/svc-haircut.jpg', true),
('Hair Colour',         'Hair',   'Full-head colour or roots touch-up using gentle, ammonia-free formulas.',        5500, 120, '/img/svc-color.jpg', true),
('Signature Facial',    'Skin',   'A deep-cleanse facial with steam, exfoliation, mask and a relaxing massage.',    3500, 60,  '/img/svc-facial.jpg', true),
('Classic Manicure',    'Nails',  'Shaping, cuticle care, and a flawless polish of your choice.',                   1500, 40,  '/img/svc-manicure.jpg', false),
('Spa Pedicure',        'Nails',  'A soothing soak, scrub and massage with a long-lasting polish finish.',          2000, 50,  '/img/svc-pedicure.jpg', false),
('Relaxation Massage',  'Spa',    'Full-body massage to release tension, with warm oils and calm music.',           4500, 60,  '/img/svc-massage.jpg', true),
('Bridal Makeup',       'Makeup', 'Complete bridal look — HD makeup, hair styling and draping. By appointment.',     25000, 180,'/img/svc-bridal.jpg', true),
('Threading & Brows',   'Skin',   'Clean, defined brows and face threading by expert hands.',                       600, 20,   '/img/svc-threading.jpg', false);

insert into public.staff (name, role, bio, image_url) values
('Ayesha Malik', 'Senior Stylist',        '12 years in colour and cutting. Lumière''s lead stylist for bridal and editorial looks.', '/img/staff-ayesha.jpg'),
('Hina Raza',    'Skin & Spa Therapist',  'Certified esthetician specialising in facials, massage and skin treatments.',             '/img/staff-hina.jpg'),
('Sara Noor',    'Nail Artist',           'Detail-obsessed nail artist — classic manicures to intricate nail art.',                  '/img/staff-sara.jpg');

-- ===========================================================================
-- Extra sections: reviews, gallery, offers, contact messages
-- ===========================================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  rating      integer not null default 5,
  text        text not null,
  image_url   text,
  approved    boolean not null default false,  -- public submissions wait for approval
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.gallery (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  image_url   text not null,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.offers (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  badge       text,
  image_url   text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text,
  message     text not null,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.reviews  enable row level security;
alter table public.gallery  enable row level security;
alter table public.offers   enable row level security;
alter table public.messages enable row level security;

grant select on public.reviews to anon, authenticated;
grant insert on public.reviews to anon, authenticated;            -- public can submit a review
grant select, insert, update, delete on public.reviews  to authenticated;
grant select on public.gallery to anon, authenticated;
grant select, insert, update, delete on public.gallery  to authenticated;
grant select on public.offers to anon, authenticated;
grant select, insert, update, delete on public.offers   to authenticated;
grant insert on public.messages to anon, authenticated;           -- public contact form
grant select, update, delete on public.messages to authenticated;

drop policy if exists reviews_public_read   on public.reviews;
drop policy if exists reviews_public_insert on public.reviews;
drop policy if exists reviews_admin_write   on public.reviews;
drop policy if exists gallery_public_read   on public.gallery;
drop policy if exists gallery_admin_write   on public.gallery;
drop policy if exists offers_public_read    on public.offers;
drop policy if exists offers_admin_write    on public.offers;
drop policy if exists messages_public_insert on public.messages;
drop policy if exists messages_admin_read    on public.messages;
drop policy if exists messages_admin_update  on public.messages;
drop policy if exists messages_admin_delete  on public.messages;

-- Public sees only approved reviews; staff see everything.
create policy reviews_public_read   on public.reviews for select to anon using (approved = true);
create policy reviews_public_insert on public.reviews for insert to anon, authenticated with check (approved = false);
create policy reviews_admin_write   on public.reviews for all to authenticated using (true) with check (true);

create policy gallery_public_read on public.gallery for select to anon, authenticated using (true);
create policy gallery_admin_write on public.gallery for all to authenticated using (true) with check (true);

create policy offers_public_read on public.offers for select to anon, authenticated using (active = true);
create policy offers_admin_write on public.offers for all to authenticated using (true) with check (true);

create policy messages_public_insert on public.messages for insert to anon, authenticated with check (true);
create policy messages_admin_read    on public.messages for select to authenticated using (true);
create policy messages_admin_update  on public.messages for update to authenticated using (true) with check (true);
create policy messages_admin_delete  on public.messages for delete to authenticated using (true);

insert into public.reviews (name, rating, text, approved, featured) values
('Mariam A.', 5, 'Best haircut I''ve had in years — Ayesha really listened. The whole place is so calm and clean.', true, true),
('Zara K.',   5, 'Got my bridal makeup done here and I felt stunning all day. Highly recommend Lumière!', true, true),
('Hira S.',   4, 'Lovely facial and such a relaxing experience. Booking online was super easy too.', true, true),
('Nida R.',   5, 'My go-to for mani-pedis now. Sara is so detailed and friendly.', true, false);

insert into public.gallery (title, image_url, sort) values
('Balayage',    '/img/gal-1.jpg', 1),
('Bridal look', '/img/gal-2.jpg', 2),
('Nail art',    '/img/gal-3.jpg', 3),
('Glow facial', '/img/gal-4.jpg', 4),
('Soft curls',  '/img/gal-5.jpg', 5),
('Spa room',    '/img/gal-6.jpg', 6);

insert into public.offers (title, description, badge, image_url, active) values
('20% off your first visit', 'New to Lumière? Enjoy 20% off any single service on your first appointment.', 'NEW CLIENT', '/img/offer-1.jpg', true),
('Bridal package — save Rs 5,000', 'Book makeup + hair + draping together and save on the complete bridal look.', 'BRIDAL', '/img/offer-2.jpg', true);
