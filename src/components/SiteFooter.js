import Link from "next/link";
import { SALON, waLink } from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl font-semibold text-ink">{SALON.name}</div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            {SALON.tagline} in {SALON.address}. Haircuts, colour, skin, nails and bridal —
            booked online in a minute.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg text-ink">Visit</h4>
          <p className="mt-3 text-sm text-muted">{SALON.address}</p>
          <p className="mt-1 text-sm text-muted">{SALON.hours}</p>
        </div>
        <div>
          <h4 className="font-serif text-lg text-ink">Contact</h4>
          <p className="mt-3 text-sm text-muted">{SALON.phone}</p>
          <p className="mt-1 text-sm text-muted">{SALON.email}</p>
          <a
            href={waLink("Hi Lumière! I'd like to book an appointment.")}
            target="_blank"
            rel="noopener"
            className="mt-3 inline-block rounded-full bg-sage px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SALON.name} {SALON.tagline} ·{" "}
        <Link href="/admin" className="hover:text-ink">Staff login</Link>
      </div>
    </footer>
  );
}
