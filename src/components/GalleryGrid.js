"use client";
import { useState } from "react";

export default function GalleryGrid({ items = [] }) {
  const [active, setActive] = useState(null);
  if (!items.length) return null;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g)}
            className="reveal group aspect-square overflow-hidden rounded-xl border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image_url} alt={g.title || ""} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[85vh] max-w-3xl overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.image_url} alt={active.title || ""} className="max-h-[85vh] w-full object-contain" />
            {active.title && <div className="bg-background px-4 py-3 text-center text-ink">{active.title}</div>}
          </div>
          <button onClick={() => setActive(null)} className="absolute right-5 top-5 text-3xl text-white" aria-label="Close">×</button>
        </div>
      )}
    </>
  );
}
