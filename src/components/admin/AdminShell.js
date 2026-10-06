"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";

function ConfigNotice() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="font-serif text-3xl text-ink">Admin is not connected yet</h1>
      <p className="mt-3 text-muted">
        Add your Supabase URL and anon key to <code>.env.local</code>, run the SQL in{" "}
        <code>supabase/schema.sql</code>, create a user in Supabase → Authentication, then reload.
        The README has step-by-step instructions.
      </p>
    </div>
  );
}

export default function AdminShell({ children }) {
  const router = useRouter();
  const path = usePathname();
  const [state, setState] = useState("loading"); // loading | in

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = createClient();
    sb.auth
      .getUser()
      .then(({ data }) => {
        if (data?.user) setState("in");
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/admin/login");
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, [router]);

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
  }

  if (!isSupabaseConfigured) return <ConfigNotice />;
  if (state === "loading") return <div className="p-20 text-center text-muted">Loading…</div>;

  const nav = [
    ["/admin", "Appointments"],
    ["/admin/services", "Services"],
    ["/admin/staff", "Staff"],
    ["/admin/reviews", "Reviews"],
    ["/admin/gallery", "Gallery"],
    ["/admin/offers", "Offers"],
    ["/admin/messages", "Messages"],
  ];
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex gap-6 text-sm">
          <span className="font-serif text-lg text-ink">Lumière Admin</span>
          {nav.map(([h, l]) => (
            <Link key={h} href={h} className={path === h ? "font-semibold text-ink" : "text-muted hover:text-ink"}>
              {l}
            </Link>
          ))}
        </div>
        <button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm text-ink">
          Sign out
        </button>
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
