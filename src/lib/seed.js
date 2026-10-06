// Fallback data so the site looks complete before Supabase is connected.
// Once the backend is live, these are ignored and real rows are used.
// Images are bundled locally in /public/img (*.jpg) so they always load with
// no internet needed. To use real photos: replace those files (keep the same
// names), or set a real Image URL per item in the admin.
const SLUG = {
  301: "svc-haircut", 302: "svc-color", 303: "svc-facial", 304: "svc-manicure",
  305: "svc-pedicure", 306: "svc-massage", 307: "svc-bridal", 308: "svc-threading",
  311: "staff-ayesha", 312: "staff-hina", 313: "staff-sara",
  341: "gal-1", 342: "gal-2", 343: "gal-3", 344: "gal-4", 345: "gal-5", 346: "gal-6",
  351: "offer-1", 352: "offer-2",
};
const img = (kw, seed) => `/img/${SLUG[seed] || "spa"}.jpg`;

export const seedServices = [
  { id: "haircut-style", name: "Haircut & Style", category: "Hair", price: 1800, duration_min: 45, featured: true,
    description: "A precision cut tailored to your face shape, finished with a blow-dry and style.",
    image_url: img("haircut,salon", 301) },
  { id: "hair-colour", name: "Hair Colour", category: "Hair", price: 5500, duration_min: 120, featured: true,
    description: "Full-head colour or roots touch-up using gentle, ammonia-free formulas.",
    image_url: img("hair,color,salon", 302) },
  { id: "signature-facial", name: "Signature Facial", category: "Skin", price: 3500, duration_min: 60, featured: true,
    description: "A deep-cleanse facial with steam, exfoliation, mask and a relaxing massage.",
    image_url: img("facial,spa,skincare", 303) },
  { id: "manicure", name: "Classic Manicure", category: "Nails", price: 1500, duration_min: 40, featured: false,
    description: "Shaping, cuticle care, and a flawless polish of your choice.",
    image_url: img("manicure,nails", 304) },
  { id: "pedicure", name: "Spa Pedicure", category: "Nails", price: 2000, duration_min: 50, featured: false,
    description: "A soothing soak, scrub and massage with a long-lasting polish finish.",
    image_url: img("pedicure,nails,spa", 305) },
  { id: "relax-massage", name: "Relaxation Massage", category: "Spa", price: 4500, duration_min: 60, featured: true,
    description: "Full-body massage to release tension, with warm oils and calm music.",
    image_url: img("massage,spa,relax", 306) },
  { id: "bridal-makeup", name: "Bridal Makeup", category: "Makeup", price: 25000, duration_min: 180, featured: true,
    description: "Complete bridal look — HD makeup, hair styling and draping. By appointment.",
    image_url: img("bridal,makeup", 307) },
  { id: "threading", name: "Threading & Brows", category: "Skin", price: 600, duration_min: 20, featured: false,
    description: "Clean, defined brows and face threading by expert hands.",
    image_url: img("eyebrow,threading", 308) },
];

export const seedStaff = [
  { id: "ayesha", name: "Ayesha Malik", role: "Senior Stylist", image_url: img("hairstylist,woman", 311),
    bio: "12 years in colour and cutting. Lumière's lead stylist for bridal and editorial looks." },
  { id: "hina", name: "Hina Raza", role: "Skin & Spa Therapist", image_url: img("spa,therapist", 312),
    bio: "Certified esthetician specialising in facials, massage and skin treatments." },
  { id: "sara", name: "Sara Noor", role: "Nail Artist", image_url: img("manicurist,nails", 313),
    bio: "Detail-obsessed nail artist — classic manicures to intricate nail art." },
];

export const seedReviews = [
  { id: "r1", name: "Mariam A.", rating: 5, featured: true, approved: true,
    text: "Best haircut I've had in years — Ayesha really listened. The whole place is so calm and clean." },
  { id: "r2", name: "Zara K.", rating: 5, featured: true, approved: true,
    text: "Got my bridal makeup done here and I felt stunning all day. Highly recommend Lumière!" },
  { id: "r3", name: "Hira S.", rating: 4, featured: true, approved: true,
    text: "Lovely facial and such a relaxing experience. Booking online was super easy too." },
  { id: "r4", name: "Nida R.", rating: 5, featured: false, approved: true,
    text: "My go-to for mani-pedis now. Sara is so detailed and friendly." },
];

export const seedGallery = [
  { id: "g1", title: "Balayage", image_url: img("hair,balayage", 341), sort: 1 },
  { id: "g2", title: "Bridal look", image_url: img("bridal,makeup", 342), sort: 2 },
  { id: "g3", title: "Nail art", image_url: img("nail,art", 343), sort: 3 },
  { id: "g4", title: "Glow facial", image_url: img("facial,glow", 344), sort: 4 },
  { id: "g5", title: "Soft curls", image_url: img("hairstyle,curls", 345), sort: 5 },
  { id: "g6", title: "Spa room", image_url: img("spa,room", 346), sort: 6 },
];

export const seedOffers = [
  { id: "o1", title: "20% off your first visit", badge: "NEW CLIENT", active: true,
    description: "New to Lumière? Enjoy 20% off any single service on your first appointment.",
    image_url: img("salon,offer", 351) },
  { id: "o2", title: "Bridal package — save Rs 5,000", badge: "BRIDAL", active: true,
    description: "Book makeup + hair + draping together and save on the complete bridal look.",
    image_url: img("bridal,salon", 352) },
];
