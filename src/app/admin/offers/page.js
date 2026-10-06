"use client";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

const BLANK = { title: "", description: "", badge: "", image_url: "", active: true };
const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-ink outline-none focus:border-accent";

function OffersAdmin() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return setLoading(false);
    const { data } = await createClient().from("offers").select("*").order("created_at");
    setRows(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  function edit(r) { setEditId(r.id); setForm({ title: r.title || "", description: r.description || "", badge: r.badge || "", image_url: r.image_url || "", active: !!r.active }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function reset() { setForm(BLANK); setEditId(null); setErr(""); }

  async function save(e) {
    e.preventDefault();
    setErr("");
    if (!form.title) return setErr("Title is required.");
    const payload = { title: form.title, description: form.description, badge: form.badge || null, image_url: form.image_url || null, active: !!form.active };
    const sb = createClient();
    const { error } = editId ? await sb.from("offers").update(payload).eq("id", editId) : await sb.from("offers").insert(payload);
    if (error) return setErr(error.message);
    reset(); load();
  }
  async function remove(id) {
    if (!confirm("Delete this offer?")) return;
    await createClient().from("offers").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-ink">{editId ? "Edit offer" : "Add an offer"}</h2>
      <form onSubmit={save} className="mb-10 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div><label className="text-xs text-muted">Title</label><input className={field} value={form.title} onChange={set("title")} /></div>
        <div><label className="text-xs text-muted">Badge</label><input className={field} value={form.badge} onChange={set("badge")} placeholder="NEW CLIENT / 20% OFF" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted">Image URL</label><input className={field} value={form.image_url} onChange={set("image_url")} placeholder="https://…" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted">Description</label><textarea rows={2} className={field} value={form.description} onChange={set("description")} /></div>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={form.active} onChange={set("active")} /> Active (show on site)</label>
        {err && <p className="text-sm text-accent sm:col-span-2">{err}</p>}
        <div className="flex gap-3 sm:col-span-2">
          <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground">{editId ? "Save" : "Add"}</button>
          {editId && <button type="button" onClick={reset} className="rounded-full border border-border px-6 py-2.5 text-sm">Cancel</button>}
        </div>
      </form>

      <h2 className="mb-4 font-serif text-2xl text-ink">All offers</h2>
      {loading ? <p className="text-muted">Loading…</p> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-5">
              <div>
                {r.badge && <span className="mr-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{r.badge}</span>}
                <span className="font-semibold text-ink">{r.title}</span>
                {!r.active && <span className="ml-2 text-xs text-muted">(inactive)</span>}
                <p className="mt-1 text-sm text-muted">{r.description}</p>
              </div>
              <div className="flex gap-3 text-xs">
                <button onClick={() => edit(r)} className="text-ink hover:underline">Edit</button>
                <button onClick={() => remove(r.id)} className="text-accent hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <AdminShell><OffersAdmin /></AdminShell>;
}
