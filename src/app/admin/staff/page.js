"use client";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

const BLANK = { name: "", role: "", bio: "", image_url: "" };
const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-ink outline-none focus:border-accent";

function StaffAdmin() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return setLoading(false);
    const { data } = await createClient().from("staff").select("*").order("name");
    setRows(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  function edit(r) { setEditId(r.id); setForm({ name: r.name || "", role: r.role || "", bio: r.bio || "", image_url: r.image_url || "" }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function reset() { setForm(BLANK); setEditId(null); setErr(""); }

  async function save(e) {
    e.preventDefault();
    setErr("");
    if (!form.name) return setErr("Name is required.");
    const sb = createClient();
    const { error } = editId
      ? await sb.from("staff").update(form).eq("id", editId)
      : await sb.from("staff").insert(form);
    if (error) return setErr(error.message);
    reset(); load();
  }
  async function remove(id) {
    if (!confirm("Delete this team member?")) return;
    await createClient().from("staff").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-ink">{editId ? "Edit team member" : "Add a team member"}</h2>
      <form onSubmit={save} className="mb-10 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div><label className="text-xs text-muted">Name</label><input className={field} value={form.name} onChange={set("name")} /></div>
        <div><label className="text-xs text-muted">Role</label><input className={field} value={form.role} onChange={set("role")} placeholder="Senior Stylist…" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted">Image URL</label><input className={field} value={form.image_url} onChange={set("image_url")} placeholder="https://…" /></div>
        <div className="sm:col-span-2"><label className="text-xs text-muted">Bio</label><textarea rows={2} className={field} value={form.bio} onChange={set("bio")} /></div>
        {err && <p className="text-sm text-accent sm:col-span-2">{err}</p>}
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground">{editId ? "Save changes" : "Add member"}</button>
          {editId && <button type="button" onClick={reset} className="rounded-full border border-border px-6 py-2.5 text-sm">Cancel</button>}
        </div>
      </form>

      <h2 className="mb-4 font-serif text-2xl text-ink">The team</h2>
      {loading ? <p className="text-muted">Loading…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="aspect-[4/3] overflow-hidden">
                {r.image_url ? /* eslint-disable-next-line @next/next/no-img-element */ (
                  <img src={r.image_url} alt={r.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-ink">{r.name}</h3>
                <p className="text-xs uppercase tracking-wide text-accent">{r.role}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{r.bio}</p>
                <div className="mt-3 text-right">
                  <button onClick={() => edit(r)} className="mr-3 text-xs text-ink hover:underline">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-xs text-accent hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <AdminShell><StaffAdmin /></AdminShell>;
}
