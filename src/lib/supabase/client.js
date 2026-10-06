import { createBrowserClient } from "@supabase/ssr";

// Supabase client for Client Components ("use client"). Browser-safe:
// only ever uses the public anon key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
