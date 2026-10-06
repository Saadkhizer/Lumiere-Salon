"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, waLink, formatPKR } from "@/lib/config";

const TIME_SLOTS = (() => {
  const out = [];
  for (let h = 10; h <= 20; h++) {
    for (const m of [0, 30]) out.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
  }
  return out; // 10:00 .. 20:30
})();

export default function BookingForm({ services = [], staff = [], preselect = "" }) {
  const [form, setForm] = useState({
    service_id: preselect || (services[0]?.id ?? ""),
    staff_id: "",
    appointment_date: "",
    appointment_time: "",
    customer_name: "",
    customer_phone: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [errMsg, setErrMsg] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const service = services.find((s) => String(s.id) === String(form.service_id));
  const today = new Date().toISOString().split("T")[0];

  const summary = () => {
    const staffName = staff.find((s) => String(s.id) === String(form.staff_id))?.name || "any available artist";
    return `Hi Lumière! I'd like to book:\n• ${service?.name ?? "Service"}${service ? ` (${formatPKR(service.price)})` : ""}\n• With: ${staffName}\n• Date: ${form.appointment_date} at ${form.appointment_time}\n• Name: ${form.customer_name}\n• Phone: ${form.customer_phone}${form.notes ? `\n• Note: ${form.notes}` : ""}`;
  };

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    if (!form.service_id || !form.appointment_date || !form.appointment_time || !form.customer_name || !form.customer_phone) {
      setErrMsg("Please fill service, date, time, name and phone.");
      return;
    }
    setStatus("saving");

    if (isSupabaseConfigured) {
      try {
        const sb = createClient();
        const { error } = await sb.from("appointments").insert({
          service_id: form.service_id,
          staff_id: form.staff_id || null,
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          notes: form.notes || null,
          status: "pending",
        });
        if (error) throw error;
      } catch (err) {
        setStatus("error");
        setErrMsg("Could not save the booking. You can still confirm on WhatsApp below.");
        return;
      }
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-border bg-surface p-10 text-center">
        <div className="text-4xl">✓</div>
        <h2 className="mt-3 font-serif text-3xl text-ink">Booking received</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Thank you, {form.customer_name.split(" ")[0] || "there"}! We&apos;ll confirm your{" "}
          {service?.name} on {form.appointment_date} at {form.appointment_time}. For instant
          confirmation, send us the details on WhatsApp.
        </p>
        <a
          href={waLink(summary())}
          target="_blank"
          rel="noopener"
          className="mt-6 inline-block rounded-full bg-sage px-6 py-3 text-sm font-semibold text-accent-foreground"
        >
          Confirm on WhatsApp
        </a>
      </div>
    );
  }

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none focus:border-accent";
  const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted";

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Service</label>
          <select className={field} value={form.service_id} onChange={set("service_id")}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {formatPKR(s.price)} · {s.duration_min} min
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Artist (optional)</label>
          <select className={field} value={form.staff_id} onChange={set("staff_id")}>
            <option value="">Any available</option>
            {staff.map((m) => (
              <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Date</label>
          <input type="date" min={today} className={field} value={form.appointment_date} onChange={set("appointment_date")} />
        </div>

        <div>
          <label className={label}>Time</label>
          <select className={field} value={form.appointment_time} onChange={set("appointment_time")}>
            <option value="">Select a time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Your name</label>
          <input className={field} value={form.customer_name} onChange={set("customer_name")} placeholder="Full name" />
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Phone / WhatsApp</label>
          <input className={field} value={form.customer_phone} onChange={set("customer_phone")} placeholder="03xx xxxxxxx" />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Notes (optional)</label>
          <textarea rows={3} className={field} value={form.notes} onChange={set("notes")} placeholder="Anything we should know?" />
        </div>
      </div>

      {errMsg && <p className="mt-4 text-sm text-accent">{errMsg}</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-6 w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "saving" ? "Booking…" : "Confirm booking"}
      </button>

      {status === "error" && (
        <a href={waLink(summary())} target="_blank" rel="noopener" className="mt-3 block rounded-full bg-sage px-6 py-3 text-center text-sm font-semibold text-accent-foreground">
          Book on WhatsApp instead
        </a>
      )}
      {!isSupabaseConfigured && (
        <p className="mt-3 text-center text-xs text-muted">
          Demo mode — connect Supabase to store bookings in your database.
        </p>
      )}
    </form>
  );
}
