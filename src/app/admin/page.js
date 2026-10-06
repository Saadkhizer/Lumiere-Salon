"use client";
import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, formatPKR } from "@/lib/config";

const STATUSES = ["pending", "confirmed", "done", "cancelled"];
const badge = {
  pending: "bg-[#efe3cf] text-[#7a5a1e]",
  confirmed: "bg-[#dce7d6] text-[#3c5a30]",
  done: "bg-[#d9e2ec] text-[#2f4a63]",
  cancelled: "bg-[#eedcd6] text-[#8a3a28]",
};

function Dashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return setLoading(false);
    const sb = createClient();
    const { data } = await sb
      .from("appointments")
      .select("id, appointment_date, appointment_time, customer_name, customer_phone, status, notes, services(name), staff(name)")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    await createClient().from("appointments").update({ status }).eq("id", id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  }
  async function remove(id) {
    if (!confirm("Delete this appointment?")) return;
    await createClient().from("appointments").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  const upcoming = rows.filter((r) => r.status === "pending" || r.status === "confirmed").length;

  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total bookings" value={rows.length} />
        <Stat label="Upcoming" value={upcoming} />
        <Stat label="Completed" value={rows.filter((r) => r.status === "done").length} />
      </div>

      <h2 className="mb-4 font-serif text-2xl text-ink">Appointments</h2>
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
          No bookings yet. They&apos;ll appear here as customers book.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-3">Date / Time</th><th className="p-3">Customer</th>
                <th className="p-3">Service</th><th className="p-3">Artist</th>
                <th className="p-3">Status</th><th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="p-3 text-ink">{r.appointment_date}<div className="text-muted">{r.appointment_time}</div></td>
                  <td className="p-3 text-ink">{r.customer_name}<div className="text-muted">{r.customer_phone}</div>
                    {r.notes && <div className="mt-1 text-xs italic text-muted">“{r.notes}”</div>}</td>
                  <td className="p-3 text-ink">{r.services?.name || "—"}</td>
                  <td className="p-3 text-muted">{r.staff?.name || "Any"}</td>
                  <td className="p-3">
                    <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-xs ${badge[r.status] || ""}`}>{r.status}</span>
                    <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="block rounded-lg border border-border bg-background px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3"><button onClick={() => remove(r.id)} className="text-xs text-accent hover:underline">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="font-serif text-3xl text-accent">{value}</div>
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminShell><Dashboard /></AdminShell>;
}
