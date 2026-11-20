"use client";

// Sitenin eğlenceli küçük sürprizleri:
//  - LogoLink / LogoMark: logo; tıklanınca Şakir'i uçurur
//  - SakirFlight: muhabbet kuşu Şakir ekranın bir ucundan öbürüne kanat çırparak uçar

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import Budgie from "./Budgie";

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Logo bağlantısı: anasayfaya götürür ve Şakir'i uçurur
export function LogoLink({ children, className }) {
  return (
    <Link href="/" className={className} onClick={() => window.dispatchEvent(new CustomEvent("sakir:fly"))}>
      {children}
    </Link>
  );
}

export function LogoMark() {
  return (
    <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
      <span className="h-2 w-2 rounded-full bg-pink" />
      <span className="h-2 w-2 rounded-full bg-amber" />
      <span className="h-2 w-2 rounded-full bg-mint" />
      <span className="h-2 w-2 rounded-full bg-sky" />
    </span>
  );
}

export function SakirFlight({ say = "cik cik!" }) {
  const [flying, setFlying] = useState(false);
  const birdRef = useRef(null);
  const bubbleRef = useRef(null);

  useEffect(() => {
    const onFly = () => {
      if (!reduceMotion()) setFlying(true);
    };
    window.addEventListener("sakir:fly", onFly);
    return () => window.removeEventListener("sakir:fly", onFly);
  }, []);

  useEffect(() => {
    if (!flying || !birdRef.current) return;
    const bird = birdRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const baseY = h * gsap.utils.random(0.2, 0.45);
    const fromLeft = Math.random() > 0.35;
    const startX = fromLeft ? -160 : w + 40;
    const endX = fromLeft ? w + 40 : -160;
    const step = (endX - startX) / 5;

    const ctx = gsap.context(() => {
      gsap.set(bird, { x: startX, y: baseY, scaleX: fromLeft ? 1 : -1 });
      gsap.to("[data-wing]", { rotate: -38, duration: 0.11, yoyo: true, repeat: -1, ease: "sine.inOut" });

      const tl = gsap.timeline({ onComplete: () => setFlying(false) });
      // dalgalı bir uçuş: her adımda biraz yukarı, biraz aşağı
      for (let i = 1; i <= 5; i++) {
        tl.to(bird, {
          x: startX + step * i,
          y: baseY + (i % 2 ? -60 : 40) + gsap.utils.random(-20, 20),
          rotate: i % 2 ? -8 : 6,
          duration: 0.65,
          ease: "sine.inOut",
        });
      }
      // yolun ortasında "cik cik!" balonu
      tl.fromTo(
        bubbleRef.current,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2.5)" },
        1.1
      ).to(bubbleRef.current, { scale: 0, autoAlpha: 0, duration: 0.2 }, 2.3);
    }, bird); // seçiciler sadece bu kuşun içinde aransın
    return () => ctx.revert();
  }, [flying]);

  if (!flying) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      <div ref={birdRef} className="absolute top-0 left-0 w-28 md:w-36">
        <span
          ref={bubbleRef}
          className="absolute -top-9 left-1/2 rounded-full border-2 border-ink bg-paper-2 px-3 py-1 text-sm font-bold whitespace-nowrap text-ink shadow-[3px_3px_0_var(--ink)]"
        >
          {say}
        </span>
        <Budgie className="w-full drop-shadow-[4px_6px_0_rgba(29,22,64,0.25)]" />
      </div>
    </div>
  );
}
