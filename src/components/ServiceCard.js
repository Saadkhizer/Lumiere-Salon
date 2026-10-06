import Link from "next/link";
import { formatPKR } from "@/lib/config";

export default function ServiceCard({ service }) {
  return (
    <div className="reveal group overflow-hidden rounded-2xl border border-border bg-surface transition-transform hover:-translate-y-1">
      <Link href={`/services/${service.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-[color-mix(in_srgb,var(--surface),#000_6%)]">
          {service.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.image_url}
              alt={service.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/services/${service.id}`}>
              <h3 className="font-serif text-xl text-ink">{service.name}</h3>
            </Link>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">
              {service.category} · {service.duration_min} min
            </p>
          </div>
          <span className="whitespace-nowrap font-semibold text-accent">
            {formatPKR(service.price)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{service.description}</p>
        <Link
          href={`/book?service=${service.id}`}
          className="mt-4 inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
        >
          Book this
        </Link>
      </div>
    </div>
  );
}
