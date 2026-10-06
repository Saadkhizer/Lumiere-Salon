"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * GSAP enhancement only — gentle parallax on [data-parallax] backgrounds.
 * Visibility of content does NOT depend on this (entrance animations are pure
 * CSS in globals.css), so if GSAP fails to load, nothing breaks. Re-runs on
 * every route change so parallax works after client-side navigation too.
 */
export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx;
    (async () => {
      try {
        const gsapMod = await import("gsap");
        const stMod = await import("gsap/ScrollTrigger");
        const gsap = gsapMod.gsap || gsapMod.default;
        const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.utils.toArray("[data-parallax]").forEach((el) => {
            gsap.to(el, {
              yPercent: 10, ease: "none",
              scrollTrigger: { trigger: el.closest("section") || el, start: "top top", end: "bottom top", scrub: true },
            });
          });
        });
      } catch (e) {
        /* GSAP unavailable — fine, content and CSS animations are unaffected. */
      }
    })();
    return () => { if (ctx) ctx.revert(); };
  }, [pathname]);
  return null;
}
