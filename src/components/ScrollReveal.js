"use client";
import { useEffect } from "react";

// Adds a fade-up to any element with class "reveal" as it scrolls into view.
export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return null;
}
