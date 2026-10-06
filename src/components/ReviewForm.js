"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [state, setState] = useState("idle"); // idle | saving | done | error
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!name || !text) return setErr("Please add your name and a short review.");
    setState("saving");
    if (isSupabaseConfigured) {
      const { error } = await createClient().from("reviews").insert({ name, rating, text });
      if (error) {
        setState("error");
        setErr("Could not submit right now. Please try again later.");
        return;
      }
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center text-muted">
        Thank you! Your review has been submitted and will appear after approval. 💛
      </div>
    );
  }

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none focus:border-accent";
  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="font-serif text-xl text-ink">Leave a review</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <select className={field} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
          ))}
        </select>
        <textarea rows={3} className={`${field} sm:col-span-2`} placeholder="How was your visit?" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      {err && <p className="mt-3 text-sm text-accent">{err}</p>}
      <button type="submit" disabled={state === "saving"} className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-60">
        {state === "saving" ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
