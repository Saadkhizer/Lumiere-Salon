"use client";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

function MessagesAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return setLoading(false);
    const { data } = await createClient().from("messages").select("*").order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggle(id, handled) {
    await createClient().from("messages").update({ handled: !handled }).eq("id", id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, handled: !handled } : x)));
  }
  async function remove(id) {
    if (!confirm("Delete this message?")) return;
    await createClient().from("messages").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-2xl text-ink">Inbox</h2>
      {loading ? <p className="text-muted">Loading…</p> : rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => (
            <div key={m.id} className={`rounded-2xl border border-border p-5 ${m.handled ? "bg-background" : "bg-surface"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-ink">{m.name}</span>
                  {!m.handled && <span className="ml-2 rounded-full bg-[#efe3cf] px-2 py-0.5 text-xs text-[#7a5a1e]">new</span>}
                  <div className="text-xs text-muted">{m.phone} {m.email ? `· ${m.email}` : ""} · {new Date(m.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-3 text-xs">
                  <button onClick={() => toggle(m.id, m.handled)} className="text-ink hover:underline">{m.handled ? "Mark new" : "Mark handled"}</button>
                  <button onClick={() => remove(m.id)} className="text-accent hover:underline">Delete</button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <AdminShell><MessagesAdmin /></AdminShell>;
}
