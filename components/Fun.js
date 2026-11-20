"use client";

// Sitenin eğlenceli küçük sürprizleri:
//  - LogoLink / LogoMark: logo; tıklanınca Şakir'i uçurur
//  - SakirFlight: muhabbet kuşu Şakir ekranın bir ucundan öbürüne kanat çırparak uçar
//  - PageCurtain: sayfa değişirken renkli şeritler perde gibi kapanıp açılır

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

const STRIPS = ["bg-pink", "bg-amber", "bg-mint", "bg-sky", "bg-cobalt"];
const SKIP = /^\/(admin|giris)/;

export function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef(null);
  const covered = useRef(false);
  const safety = useRef(null);

  const strips = () => rootRef.current?.querySelectorAll("[data-strip]") || [];

  // Sayfa değişince perde açılır
  useEffect(() => {
    if (!covered.current) return;
    clearTimeout(safety.current);
    gsap.to(strips(), {
      yPercent: -100,
      duration: 0.55,
      ease: "power3.inOut",
      stagger: 0.06,
      delay: 0.1,
      onComplete: () => {
        gsap.set(strips(), { y: 0, yPercent: 100 });
        covered.current = false;
      },
    });
  }, [pathname]);

  // İç bağlantılara tıklanınca önce perde kapanır, sonra sayfaya geçilir
  useEffect(() => {
    gsap.set(strips(), { y: 0, yPercent: 100 });

    const onClick = (e) => {
      if (reduceMotion() || covered.current) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.hasAttribute("download") || (a.target && a.target !== "_self")) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // aynı sayfa (filtre, #bölüm)
      if (SKIP.test(url.pathname) || SKIP.test(location.pathname)) return;

      e.preventDefault();
      e.stopPropagation();
      covered.current = true;
      gsap.to(strips(), {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.inOut",
        stagger: 0.05,
        onComplete: () => router.push(url.pathname + url.search + url.hash),
      });
      // Bir sorun olursa perde ekranda takılı kalmasın
      safety.current = setTimeout(() => {
        gsap.to(strips(), { yPercent: 100, duration: 0.3 });
        covered.current = false;
      }, 6000);
    };

    // Yakalama aşaması: Next.js'in Link'inden önce çalışır
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] flex">
      {STRIPS.map((c) => (
        <span key={c} data-strip className={`h-full flex-1 ${c}`} style={{ transform: "translateY(100%)" }} />
      ))}
    </div>
  );
}
