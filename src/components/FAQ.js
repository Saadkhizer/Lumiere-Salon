"use client";
import { useState } from "react";
import { FAQ as ITEMS } from "@/lib/config";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl">
      {ITEMS.map((item, i) => (
        <div key={i} className="reveal border-b border-border">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="font-serif text-lg text-ink">{item.q}</span>
            <span className="text-accent text-xl">{open === i ? "–" : "+"}</span>
          </button>
          {open === i && <p className="pb-5 text-muted">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
