function Stars({ n = 5 }) {
  return (
    <span className="text-accent" aria-label={`${n} out of 5`}>
      {"★".repeat(n)}
      <span className="text-border">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function Reviews({ reviews = [] }) {
  if (!reviews.length) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <figure key={r.id} className="reveal rounded-2xl border border-border bg-background p-6">
          <Stars n={r.rating} />
          <blockquote className="mt-3 text-muted">“{r.text}”</blockquote>
          <figcaption className="mt-4 font-semibold text-ink">— {r.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
