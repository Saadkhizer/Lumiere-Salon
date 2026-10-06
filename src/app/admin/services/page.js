"use client";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, formatPKR } from "@/lib/config";

const BLANK = { name: "", category: "Hair", description: "", price: "", duration_min: "", image_url: "", featured: false };
const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-ink outline-none focus:border-accent";

function ServicesAdmin() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return setLoading(false);
    const { data } = await createClient().from("services").select("*").order("name");
    setRows(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  function edit(row) {
    setEditId(row.id);
    setForm({ name: row.name || "", category: row.category || "", description: row.description || "",
      price: row.price ?? "", duration_min: row.duration_min ?? "", image_url: row.image_url || "", featured: !!row.featured });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() { setForm(BLANK); setEditId(null); setErr(""); }

  async function save(e) {
    e.preventDefault();
    setErr("");
    if (!form.name) return setErr("Name is required.");
    const payload = {
      name: form.name, category: form.category, description: form.description,
      price: Number(form.price) || 0, duration_min: Number(form.duration_min) || 30,
      image_url: form.image_url || null, featured: !!form.featured,
    };
    const sb = createClient();
    const { error } = editId
      ? await sb.from("services").update(payload).eq("id", editId)
      : await sb.from("services").insert(payload);
    if (error) return setErr(error.message);
    reset();
    load();
  }
  async function remove(id) {
    if (!confirm("Delete this service?")) return;
    await createClient().from("services").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-ink">{editId ? "Edit service" : "Add a service"}</h2>
      <form onSubmit={save} className="mb-10 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div><label className="text-xs text-muted">Name</label><input className={field} value={form.name} onChange={set("name")} /></div>
        <div><label className="text-xs text-muted">Category</label><input className={field} value={form.category} onChange={set("category")} placeholder="Hair / Skin / Nails…" /></div>
        <div><label className="text-xs text-muted">Price (PKR)</label><input type="number" className={field} value={form.price} onChange={set("price")} /></div>
        <div><label className="text-xs text-muted">Duration (min)</label><input type="number" className={field} value={form.duration_min} onChange={set("duration_min")} /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted">Image URL</label><input className={field} value={form.image_url} onChange={set("image_url")} placeholder="https://…" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted">Description</label><textarea rows={2} className={field} value={form.description} onChange={set("description")} /></div>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={form.featured} onChange={set("featured")} /> Featured on homepage</label>
        {err && <p className="text-sm text-accent sm:col-span-2">{err}</p>}
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground">{editId ? "Save changes" : "Add service"}</button>
          {editId && <button type="button" onClick={reset} className="rounded-full border border-border px-6 py-2.5 text-sm">Cancel</button>}
        </div>
      </form>

      <h2 className="mb-4 font-serif text-2xl text-ink">All services</h2>
      {loading ? <p className="text-muted">Loading…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted"><tr>
              <th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Duration</th><th className="p-3"></th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 text-ink">{r.name}{r.featured && <span className="ml-2 rounded-full bg-[#efe3cf] px-2 py-0.5 text-xs text-[#7a5a1e]">featured</span>}</td>
                  <td className="p-3 text-muted">{r.category}</td>
                  <td className="p-3 text-accent">{formatPKR(r.price)}</td>
                  <td className="p-3 text-muted">{r.duration_min} min</td>
                  <td className="p-3 text-right"><button onClick={() => edit(r)} className="mr-3 text-xs text-ink hover:underline">Edit</button><button onClick={() => remove(r.id)} className="text-xs text-accent hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <AdminShell><ServicesAdmin /></AdminShell>;
}
