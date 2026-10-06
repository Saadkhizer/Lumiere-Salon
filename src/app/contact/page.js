import ContactForm from "@/components/ContactForm";
import { SALON, MAPS_EMBED, waLink } from "@/lib/config";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Get in touch</p>
        <h1 className="reveal mt-2 font-serif text-5xl text-ink">Contact us</h1>
        <p className="reveal mx-auto mt-3 max-w-md text-muted">Questions, custom packages or just saying hi — we&apos;d love to hear from you.</p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div className="reveal">
          <div className="space-y-4 text-muted">
            <p><span className="font-semibold text-ink">Address</span><br />{SALON.address}</p>
            <p><span className="font-semibold text-ink">Hours</span><br />{SALON.hours}</p>
            <p><span className="font-semibold text-ink">Phone</span><br />{SALON.phone}</p>
            <p><span className="font-semibold text-ink">Email</span><br />{SALON.email}</p>
            <a href={waLink("Hi Lumière!")} target="_blank" rel="noopener" className="inline-block rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-accent-foreground">Chat on WhatsApp</a>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <iframe src={MAPS_EMBED} title="Map" className="h-64 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
        <div className="reveal"><ContactForm /></div>
      </div>
    </div>
  );
}
