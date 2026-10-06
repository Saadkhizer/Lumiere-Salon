import Link from "next/link";
import { SALON } from "@/lib/config";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Our story</p>
        <h1 className="reveal mt-2 font-serif text-5xl text-ink">A calm place to feel your best</h1>
      </div>

      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div className="reveal overflow-hidden rounded-3xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/about.jpg" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="reveal space-y-4 text-muted">
          <p>
            {SALON.name} started with a simple idea — a salon that feels unhurried, where you're
            looked after by people who genuinely care about the craft.
          </p>
          <p>
            Our team brings years of experience in hair, skin, nails and bridal. We use premium,
            skin-friendly products and keep the space spotless and relaxing.
          </p>
          <p>
            Whether it's a quick trim or your wedding day, you're in good hands at {SALON.name}.
          </p>
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 text-center text-ink">
            <div><div className="font-serif text-3xl text-accent">12+</div><div className="text-xs text-muted">Years experience</div></div>
            <div><div className="font-serif text-3xl text-accent">5k+</div><div className="text-xs text-muted">Happy clients</div></div>
            <div><div className="font-serif text-3xl text-accent">20+</div><div className="text-xs text-muted">Services</div></div>
          </div>
        </div>
      </div>

      <div className="reveal mt-14 rounded-3xl bg-surface p-10 text-center">
        <h2 className="font-serif text-3xl text-ink">Find us</h2>
        <p className="mt-2 text-muted">{SALON.address}</p>
        <p className="text-muted">{SALON.hours}</p>
        <p className="text-muted">{SALON.phone}</p>
        <Link href="/book" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">
          Book an appointment
        </Link>
      </div>
    </div>
  );
}
