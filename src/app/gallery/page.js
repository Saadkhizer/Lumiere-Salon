import { getGallery } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const gallery = await getGallery();
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Our work</p>
        <h1 className="reveal mt-2 font-serif text-5xl text-ink">Gallery</h1>
        <p className="reveal mx-auto mt-3 max-w-md text-muted">A look at some of our recent work. Tap any image to view it larger.</p>
      </div>
      <div className="mt-10"><GalleryGrid items={gallery} /></div>
    </div>
  );
}
