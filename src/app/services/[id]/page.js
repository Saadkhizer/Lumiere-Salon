import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices } from "@/lib/data";
import { formatPKR, waLink } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = await getService(id);
  return { title: service ? service.name : "Service" };
}

export default async function ServiceDetailPage({ params }) {
  const { id } = await params; // Next 16: params is async
  const service = await getService(id);
  if (!service) notFound();

  const all = await getServices();
  const related = all.filter((s) => s.id !== service.id && s.category === service.category).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Link href="/services" className="text-sm text-muted hover:text-ink">← All services</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="reveal overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="aspect-[4/3] overflow-hidden">
            {service.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.image_url} alt={service.name} className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>

        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">{service.category}</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">{service.name}</h1>
          <div className="mt-4 flex items-center gap-5 text-sm text-muted">
            <span className="text-2xl font-semibold text-accent">{formatPKR(service.price)}</span>
            <span>· {service.duration_min} minutes</span>
          </div>
          <p className="mt-5 leading-relaxed text-muted">{service.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/book?service=${service.id}`}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Book this service
            </Link>
            <a
              href={waLink(`Hi Lumière! I'd like to book: ${service.name} (${formatPKR(service.price)}).`)}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink"
            >
              Ask on WhatsApp
            </a>
          </div>

          <ul className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted">
            <li>✦ Performed by our trained specialists</li>
            <li>✦ Premium, skin-friendly products</li>
            <li>✦ Free reschedule up to 2 hours before</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl text-ink">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((s) => (
              <Link key={s.id} href={`/services/${s.id}`} className="reveal overflow-hidden rounded-2xl border border-border bg-surface transition-transform hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  {s.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.image_url} alt={s.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-ink">{s.name}</h3>
                  <p className="text-sm text-accent">{formatPKR(s.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
