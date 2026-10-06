import { FEATURES } from "@/lib/config";

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Why Lumière</p>
        <h2 className="reveal mt-2 font-serif text-4xl text-ink">Why clients keep coming back</h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="reveal rounded-2xl border border-border bg-surface p-6 text-center">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-3 font-serif text-xl text-ink">{f.title}</h3>
            <p className="mt-2 text-sm text-muted">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
