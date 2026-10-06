import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { seedServices, seedStaff, seedReviews, seedGallery, seedOffers } from "@/lib/seed";

// Each helper tries Supabase when it's configured, and falls back to seed data
// on any failure (no env, missing table, network) so the site never breaks.

export async function getServices() {
  if (!isSupabaseConfigured) return seedServices;
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("services")
      .select("*")
      .order("featured", { ascending: false })
      .order("name", { ascending: true });
    if (error || !data || data.length === 0) return seedServices;
    return data;
  } catch {
    return seedServices;
  }
}

export async function getService(id) {
  if (!isSupabaseConfigured)
    return seedServices.find((s) => String(s.id) === String(id)) || null;
  try {
    const sb = await createClient();
    const { data, error } = await sb.from("services").select("*").eq("id", id).maybeSingle();
    if (error || !data) return seedServices.find((s) => String(s.id) === String(id)) || null;
    return data;
  } catch {
    return seedServices.find((s) => String(s.id) === String(id)) || null;
  }
}

export async function getStaff() {
  if (!isSupabaseConfigured) return seedStaff;
  try {
    const sb = await createClient();
    const { data, error } = await sb.from("staff").select("*").order("name");
    if (error || !data || data.length === 0) return seedStaff;
    return data;
  } catch {
    return seedStaff;
  }
}

export async function getReviews({ featuredOnly = false } = {}) {
  if (!isSupabaseConfigured)
    return featuredOnly ? seedReviews.filter((r) => r.featured) : seedReviews;
  try {
    const sb = await createClient();
    let q = sb.from("reviews").select("*").eq("approved", true);
    if (featuredOnly) q = q.eq("featured", true);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error || !data || data.length === 0)
      return featuredOnly ? seedReviews.filter((r) => r.featured) : seedReviews;
    return data;
  } catch {
    return featuredOnly ? seedReviews.filter((r) => r.featured) : seedReviews;
  }
}

export async function getGallery() {
  if (!isSupabaseConfigured) return seedGallery;
  try {
    const sb = await createClient();
    const { data, error } = await sb.from("gallery").select("*").order("sort");
    if (error || !data || data.length === 0) return seedGallery;
    return data;
  } catch {
    return seedGallery;
  }
}

export async function getOffers() {
  if (!isSupabaseConfigured) return seedOffers;
  try {
    const sb = await createClient();
    const { data, error } = await sb.from("offers").select("*").eq("active", true).order("created_at");
    if (error || !data || data.length === 0) return seedOffers;
    return data;
  } catch {
    return seedOffers;
  }
}
