import Link from "next/link";
import { SALON } from "@/lib/config";

export default function SiteHeader() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-wide text-ink">
          {SALON.name}
          <span className="ml-2 align-middle text-[0.6rem] uppercase tracking-[0.3em] text-muted">
            {SALON.tagline}
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/book"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
