"use client";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-ink outline-none focus:border-accent";

function ReviewsAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return setLoading(false);
    const { data } = await createClient().from("reviews").select("*").order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggle(id, key, val) {
    await createClient().from("reviews").update({ [key]: !val }).eq("id", id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: !val } : x)));
  }
  async function remove(id) {
    if (!confirm("Delete this review?")) return;
    await createClient().from("reviews").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }
  async function add(e) {
    e.preventDefault();
    setErr("");
    if (!form.name || !form.text) return setErr("Name and review text are required.");
    const { error } = await createClient().from("reviews").insert({
      name: form.name, rating: Number(form.rating), text: form.text, approved: true, featured: false,
    });
    if (error) return setErr(error.message);
    setForm({ name: "", rating: 5, text: "" });
    load();
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-ink">Add a review</h2>
      <form onSubmit={add} className="mb-10 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <input className={field} placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <select className={field} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
        </select>
        <textarea rows={2} className={`${field} sm:col-span-2`} placeholder="Review text" value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
        {err && <p className="text-sm text-accent sm:col-span-2">{err}</p>}
        <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground sm:col-span-2 sm:w-max">Add review</button>
      </form>

      <h2 className="mb-4 font-serif text-2xl text-ink">All reviews</h2>
      {loading ? <p className="text-muted">Loading…</p> : rows.length === 0 ? (
        <p className="text-muted">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-ink">{r.name}</span>
                  <span className="ml-2 text-accent">{"★".repeat(r.rating)}</span>
                  {!r.approved && <span className="ml-2 rounded-full bg-[#efe3cf] px-2 py-0.5 text-xs text-[#7a5a1e]">pending</span>}
                  {r.featured && <span className="ml-2 rounded-full bg-[#dce7d6] px-2 py-0.5 text-xs text-[#3c5a30]">featured</span>}
                </div>
                <div className="flex gap-3 text-xs">
                  <button onClick={() => toggle(r.id, "approved", r.approved)} className="text-ink hover:underline">{r.approved ? "Unapprove" : "Approve"}</button>
                  <button onClick={() => toggle(r.id, "featured", r.featured)} className="text-ink hover:underline">{r.featured ? "Unfeature" : "Feature"}</button>
                  <button onClick={() => remove(r.id)} className="text-accent hover:underline">Delete</button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">“{r.text}”</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <AdminShell><ReviewsAdmin /></AdminShell>;
}
