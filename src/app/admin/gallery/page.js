"use client";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

const BLANK = { title: "", image_url: "", sort: 0 };
const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-ink outline-none focus:border-accent";

function GalleryAdmin() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return setLoading(false);
    const { data } = await createClient().from("gallery").select("*").order("sort");
    setRows(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  function edit(r) { setEditId(r.id); setForm({ title: r.title || "", image_url: r.image_url || "", sort: r.sort ?? 0 }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function reset() { setForm(BLANK); setEditId(null); setErr(""); }

  async function save(e) {
    e.preventDefault();
    setErr("");
    if (!form.image_url) return setErr("Image URL is required.");
    const payload = { title: form.title, image_url: form.image_url, sort: Number(form.sort) || 0 };
    const sb = createClient();
    const { error } = editId ? await sb.from("gallery").update(payload).eq("id", editId) : await sb.from("gallery").insert(payload);
    if (error) return setErr(error.message);
    reset(); load();
  }
  async function remove(id) {
    if (!confirm("Delete this image?")) return;
    await createClient().from("gallery").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-ink">{editId ? "Edit image" : "Add an image"}</h2>
      <form onSubmit={save} className="mb-10 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div><label className="text-xs text-muted">Title</label><input className={field} value={form.title} onChange={set("title")} /></div>
        <div><label className="text-xs text-muted">Sort order</label><input type="number" className={field} value={form.sort} onChange={set("sort")} /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted">Image URL</label><input className={field} value={form.image_url} onChange={set("image_url")} placeholder="https://…" /></div>
        {err && <p className="text-sm text-accent sm:col-span-2">{err}</p>}
        <div className="flex gap-3 sm:col-span-2">
          <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground">{editId ? "Save" : "Add"}</button>
          {editId && <button type="button" onClick={reset} className="rounded-full border border-border px-6 py-2.5 text-sm">Cancel</button>}
        </div>
      </form>

      <h2 className="mb-4 font-serif text-2xl text-ink">Gallery</h2>
      {loading ? <p className="text-muted">Loading…</p> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image_url} alt={r.title || ""} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between p-3 text-sm">
                <span className="truncate text-ink">{r.title || "—"}</span>
                <span className="flex gap-2 text-xs">
                  <button onClick={() => edit(r)} className="text-ink hover:underline">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-accent hover:underline">Del</button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <AdminShell><GalleryAdmin /></AdminShell>;
}
