import Link from "next/link";
import { getServices, getStaff, getReviews, getGallery, getOffers } from "@/lib/data";
import ServiceCard from "@/components/ServiceCard";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import ReviewForm from "@/components/ReviewForm";
import FAQ from "@/components/FAQ";
import GalleryGrid from "@/components/GalleryGrid";
import HeroCanvas from "@/components/HeroCanvas";
import { SALON, waLink } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, staff, reviews, gallery, offers] = await Promise.all([
    getServices(), getStaff(), getReviews({ featuredOnly: true }), getGallery(), getOffers(),
  ]);
  const featured = services.filter((s) => s.featured);
  const list = (featured.length ? featured : services).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[86vh] items-center text-[#FBF7F2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/hero.jpg" alt="" data-parallax className="absolute left-0 top-[-8%] -z-20 h-[116%] w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(32,24,18,.72),rgba(32,24,18,.35))]" />
        <HeroCanvas />
        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="hero-anim text-xs uppercase tracking-[0.3em] text-[#E8D9C9]">{SALON.address}</p>
          <h1 className="hero-anim mt-4 max-w-2xl font-serif text-5xl font-semibold leading-[1.05] sm:text-6xl">
            Where you leave feeling like the best version of you.
          </h1>
          <p className="hero-anim mt-5 max-w-lg text-[#EADFD3]">
            Expert hair, skin, nails and bridal services in a calm, unhurried space. Book in under a minute.
          </p>
          <div className="hero-anim mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="rounded-full bg-[#FBF7F2] px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">Book an appointment</Link>
            <Link href="/services" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5">View services</Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <Features />

      {/* Offers */}
      {offers.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="text-center">
              <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Limited time</p>
              <h2 className="reveal mt-2 font-serif text-4xl text-ink">Current offers</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {offers.map((o) => (
                <div key={o.id} className="reveal relative isolate overflow-hidden rounded-3xl text-[#FBF7F2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.image_url} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                  <div className="absolute inset-0 -z-10 bg-[rgba(32,24,18,.6)]" />
                  <div className="p-8">
                    {o.badge && <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{o.badge}</span>}
                    <h3 className="mt-3 font-serif text-2xl">{o.title}</h3>
                    <p className="mt-1 max-w-sm text-sm text-[#EADFD3]">{o.description}</p>
                    <Link href="/book" className="mt-4 inline-block rounded-full bg-[#FBF7F2] px-5 py-2 text-sm font-semibold text-ink">Claim offer</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Our menu</p>
          <h2 className="reveal mt-2 font-serif text-4xl text-ink">Signature Services</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="font-semibold text-accent hover:underline">See the full menu →</Link>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div className="reveal overflow-hidden rounded-3xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/about.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Our story</p>
            <h2 className="mt-2 font-serif text-4xl text-ink">A calm place to feel your best</h2>
            <p className="mt-4 text-muted">
              {SALON.name} is an unhurried salon where you&apos;re looked after by people who genuinely
              care about the craft — from an everyday trim to your wedding day.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div><div className="font-serif text-3xl text-accent">12+</div><div className="text-xs text-muted">Years</div></div>
              <div><div className="font-serif text-3xl text-accent">5k+</div><div className="text-xs text-muted">Clients</div></div>
              <div><div className="font-serif text-3xl text-accent">20+</div><div className="text-xs text-muted">Services</div></div>
            </div>
            <Link href="/about" className="mt-6 inline-block font-semibold text-accent hover:underline">More about us →</Link>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Our work</p>
            <h2 className="reveal mt-2 font-serif text-4xl text-ink">Gallery</h2>
          </div>
          <div className="mt-10">
            <GalleryGrid items={gallery.slice(0, 6)} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/gallery" className="font-semibold text-accent hover:underline">See full gallery →</Link>
          </div>
        </section>
      )}

      {/* Team */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">The team</p>
            <h2 className="reveal mt-2 font-serif text-4xl text-ink">Meet your artists</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {staff.map((m) => (
              <div key={m.id} className="reveal overflow-hidden rounded-2xl border border-border bg-background text-center">
                <div className="aspect-[4/3] overflow-hidden">
                  {m.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ (
                    <img src={m.image_url} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-ink">{m.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-accent">{m.role}</p>
                  <p className="mt-2 text-sm text-muted">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Kind words</p>
          <h2 className="reveal mt-2 font-serif text-4xl text-ink">What our clients say</h2>
        </div>
        <div className="mt-10"><Reviews reviews={reviews} /></div>
        <div className="mx-auto mt-10 max-w-2xl"><ReviewForm /></div>
      </section>

      {/* FAQ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Good to know</p>
            <h2 className="reveal mt-2 font-serif text-4xl text-ink">Frequently asked</h2>
          </div>
          <div className="mt-10"><FAQ /></div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal relative isolate overflow-hidden rounded-3xl px-8 py-16 text-center text-[#FBF7F2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/cta.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-[rgba(32,24,18,.6)]" />
          <h2 className="font-serif text-4xl">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-md text-[#EADFD3]">Pick a service, choose a time, and we&apos;ll take care of the rest.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/book" className="rounded-full bg-[#FBF7F2] px-6 py-3 text-sm font-semibold text-ink">Book online</Link>
            <a href={waLink("Hi Lumière! I'd like to book an appointment.")} target="_blank" rel="noopener" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold">Or WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  );
}
