"use client";
import { useEffect, useRef } from "react";

/**
 * Subtle three.js backdrop for the hero — soft warm specks of light drifting
 * slowly upward, like dust caught in sun. Each point uses a round, feathered
 * sprite (not a hard square) with additive blending so it reads as glow, not
 * noise. Purely decorative: if WebGL/three isn't available it renders nothing
 * and the hero's photo + gradient still look complete. Skipped for reduced motion.
 */
export default function HeroCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let renderer, raf, geo, tex, mat, disposed = false, cleanup;

    (async () => {
      try {
        const THREE = await import("three");
        if (disposed) return;
        const w = el.clientWidth || window.innerWidth;
        const h = el.clientHeight || 600;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h);
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
        camera.position.z = 18;

        // Round, soft-edged sprite so points glow instead of looking like squares.
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d");
        const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grd.addColorStop(0, "rgba(255,244,226,1)");
        grd.addColorStop(0.35, "rgba(240,210,170,0.65)");
        grd.addColorStop(1, "rgba(240,210,170,0)");
        g.fillStyle = grd;
        g.fillRect(0, 0, 64, 64);
        tex = new THREE.CanvasTexture(c);

        const N = 70;
        geo = new THREE.BufferGeometry();
        const pos = new Float32Array(N * 3);
        const siz = new Float32Array(N);
        const spd = new Float32Array(N);
        for (let i = 0; i < N; i++) {
          pos[i * 3] = (Math.random() - 0.5) * 46;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
          siz[i] = 0.25 + Math.random() * 0.9;      // varied depth of field
          spd[i] = 0.003 + Math.random() * 0.006;   // gentle, uneven drift
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

        mat = new THREE.PointsMaterial({
          map: tex,
          size: 0.9,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geo, mat);
        scene.add(points);

        let t = 0;
        const loop = () => {
          if (disposed) return;
          t += 0.0008;
          points.rotation.y = Math.sin(t) * 0.15;
          const p = geo.attributes.position.array;
          for (let i = 0; i < N; i++) {
            p[i * 3 + 1] += spd[i];
            p[i * 3] += Math.sin(t * 2 + i) * 0.004; // faint sway
            if (p[i * 3 + 1] > 14) p[i * 3 + 1] = -14;
          }
          geo.attributes.position.needsUpdate = true;
          renderer.render(scene, camera);
          raf = requestAnimationFrame(loop);
        };
        loop();

        const onResize = () => {
          const nw = el.clientWidth, nh = el.clientHeight;
          if (!nw || !nh) return;
          renderer.setSize(nw, nh);
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);
        cleanup = () => window.removeEventListener("resize", onResize);
      } catch (e) {
        /* no WebGL / three — hero photo + gradient stand on their own. */
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (cleanup) cleanup();
      try {
        if (geo) geo.dispose();
        if (tex) tex.dispose();
        if (mat) mat.dispose();
        if (renderer) { renderer.dispose(); renderer.domElement?.remove(); }
      } catch (e) {}
    };
  }, []);

  return <div ref={ref} className="pointer-events-none absolute inset-0 -z-[15]" aria-hidden />;
}
