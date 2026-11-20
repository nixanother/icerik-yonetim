"use client";

// Ekranda sabitlenen (pin) sahneler: anasayfa kurgu timeline'ı ve yatay proje şeridi.
//
// Neden ayrı bileşen? GSAP sabitlediği bölümü bir "pin-spacer" kutusuna taşır. Bu taşıma
// React sayfayı kaldırmadan ÖNCE geri alınmazsa "removeChild" hatası çıkar.
// useLayoutEffect'in temizliği, React DOM'u sökmeden önce çalıştığı için sorun ortadan kalkar.

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { setupHero, setupRail } from "./scenes";

export default function PinScenes({ children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();
    root.querySelectorAll("[data-hero]").forEach((el) => setupHero(el, mm));
    root.querySelectorAll("[data-rail]").forEach((el) => setupRail(el, mm));

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
