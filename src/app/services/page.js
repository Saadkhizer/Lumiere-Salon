import { getServices } from "@/lib/data";
import ServiceCard from "@/components/ServiceCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getServices();
  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Full menu</p>
        <h1 className="reveal mt-2 font-serif text-5xl text-ink">Our Services</h1>
        <p className="reveal mx-auto mt-3 max-w-md text-muted">
          Every service is bookable online. Prices in PKR, all taxes included.
        </p>
      </div>

      {categories.map((cat) => (
        <section key={cat} className="mt-14">
          <h2 className="reveal mb-6 font-serif text-2xl text-ink">{cat}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((s) => s.category === cat)
              .map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
