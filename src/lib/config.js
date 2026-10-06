// Single place to brand the whole site. Change these and everything updates.
export const SALON = {
  name: "Lumière",
  tagline: "Salon & Spa",
  phone: "+92 300 0000000",
  whatsapp: "923000000000", // digits only, country code, no +, no spaces
  email: "hello@lumiere.pk",
  address: "Bahria Enclave, Islamabad",
  hours: "Open daily · 10:00 AM – 9:00 PM",
};

// True only when both Supabase env vars exist. When false, the site runs on
// built-in seed data so it works before any backend is set up.
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function waLink(text) {
  return `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function formatPKR(n) {
  return "Rs " + Number(n || 0).toLocaleString("en-PK");
}

// "Why choose us" — static content (edit freely).
export const FEATURES = [
  { icon: "✂️", title: "Expert stylists", text: "A trained team with years of hands-on experience in hair, skin and bridal." },
  { icon: "🌿", title: "Premium products", text: "Gentle, skin-friendly, salon-grade products for every service." },
  { icon: "🧼", title: "Spotless & hygienic", text: "Sanitised tools and a calm, clean space you can relax in." },
  { icon: "📅", title: "Easy online booking", text: "Pick a service and time in under a minute — confirmed on WhatsApp." },
];

// FAQ — static accordion content.
export const FAQ = [
  { q: "Do I need an appointment?", a: "Walk-ins are welcome when we're free, but booking online guarantees your slot and preferred artist." },
  { q: "Can I choose my stylist?", a: "Yes — pick your preferred artist in the booking form, or leave it on ‘Any available’." },
  { q: "How do I reschedule or cancel?", a: "Message us on WhatsApp at least 2 hours before your appointment and we'll move it, free of charge." },
  { q: "Which products do you use?", a: "We use premium, skin-friendly, salon-grade brands. Tell us about any allergies and we'll adjust." },
  { q: "Do you offer bridal packages?", a: "Yes — bridal makeup, hair and draping, by appointment. Book ‘Bridal Makeup’ or message us for a custom package." },
];

// Google Maps embed (free, no API key). Replace the query with the real address.
export const MAPS_EMBED =
  "https://www.google.com/maps?q=Bahria%20Enclave%20Islamabad&output=embed";
