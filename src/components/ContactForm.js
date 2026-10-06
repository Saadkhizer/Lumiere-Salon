"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, waLink } from "@/lib/config";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", message: "" });
  const [state, setState] = useState("idle");
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!f.name || !f.message) return setErr("Please add your name and a message.");
    setState("saving");
    if (isSupabaseConfigured) {
      const { error } = await createClient().from("messages").insert({
        name: f.name, phone: f.phone || null, email: f.email || null, message: f.message,
      });
      if (error) {
        setState("error");
        setErr("Could not send right now — please WhatsApp us instead.");
        return;
      }
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="text-3xl">✓</div>
        <p className="mt-2 text-muted">Thanks {f.name.split(" ")[0]}! We&apos;ve got your message and will reply shortly.</p>
      </div>
    );
  }

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none focus:border-accent";
  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={field} placeholder="Your name" value={f.name} onChange={set("name")} />
        <input className={field} placeholder="Phone" value={f.phone} onChange={set("phone")} />
        <input className={`${field} sm:col-span-2`} placeholder="Email (optional)" value={f.email} onChange={set("email")} />
        <textarea rows={4} className={`${field} sm:col-span-2`} placeholder="How can we help?" value={f.message} onChange={set("message")} />
      </div>
      {err && <p className="mt-3 text-sm text-accent">{err}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="submit" disabled={state === "saving"} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60">
          {state === "saving" ? "Sending…" : "Send message"}
        </button>
        <a href={waLink("Hi Lumière! I have a question.")} target="_blank" rel="noopener" className="rounded-full bg-sage px-6 py-3 text-sm font-semibold text-accent-foreground">
          WhatsApp us
        </a>
      </div>
    </form>
  );
}
