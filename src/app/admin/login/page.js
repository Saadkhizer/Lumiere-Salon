"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

// DEV CONVENIENCE: in local development only, pre-fill the form from the admin
// credentials in .env.local so you can open /admin/login and just click "Sign in".
// In a production build these fields start empty — and you must NOT set
// NEXT_PUBLIC_ADMIN_PASSWORD on a public deploy (Vercel), since NEXT_PUBLIC_* values
// are visible in the browser. Real authentication always goes through Supabase.
const DEV = process.env.NODE_ENV !== "production";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(DEV ? (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "") : "");
  const [password, setPassword] = useState(DEV ? (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "") : "");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!isSupabaseConfigured) {
      setErr("Supabase is not configured yet. See the README to connect it.");
      return;
    }
    setLoading(true);
    const sb = createClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else router.replace("/admin");
  }

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none focus:border-accent";

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-24">
      <h1 className="text-center font-serif text-4xl text-ink">Staff Login</h1>
      <p className="mt-2 text-center text-sm text-muted">Lumière admin dashboard</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-border bg-surface p-8">
        <input type="email" required placeholder="Email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="text-sm text-accent">{err}</p>}
        {DEV && email && (
          <p className="text-xs text-muted">Dev mode: credentials pre-filled from <code>.env.local</code> — just click Sign in.</p>
        )}
        <button type="submit" disabled={loading} className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Link href="/" className="mt-6 text-center text-sm text-muted hover:text-ink">← Back to site</Link>
    </div>
  );
}
