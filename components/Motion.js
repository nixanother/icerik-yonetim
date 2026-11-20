"use client";

// Sitenin tüm hareketi burada: Lenis yumuşak kaydırma + GSAP ScrollTrigger.
// Sayfalar sadece data-* özellikleri koyar, bu bileşen her sayfa değişiminde onları bulup canlandırır.
//
//   data-reveal            → aşağıdan yukarı belirir
//   data-chars             → içindeki .c harfleri sırayla yükselir (sayfa açılışı)
//   data-words             → içindeki .w kelimeleri kaydırdıkça tek tek aydınlanır
//   data-parallax="0.15"   → kaydırırken farklı hızda kayar
//   data-clip              → görsel perde gibi aşağıdan açılır
//   data-bar="80"          → beceri çubuğu %80'e dolar
//   data-progress          → okuma ilerleme çubuğu
//   data-float             → dekoratif şekil yavaşça süzülür
//   data-squiggle          → başlık altındaki dalgalı çizgi çizilir
//
// Sabitlenen (pin) sahneler (anasayfa timeline'ı ve proje şeridi) PinScenes bileşenindedir.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/giris");

    if (reduce || isAdmin) {
      html.classList.remove("anim");
      return;
    }

    // Yumuşak kaydırma
    const lenis = new Lenis({ lerp: 0.11, anchors: true });
    window.__lenis = lenis; // lightbox açılınca kaydırmayı durdurmak için
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Sayfa açılışı: başlık harfleri
      gsap.utils.toArray("[data-chars]").forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll(".c"),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.025, delay: 0.15 }
        );
      });

      // Beliren öğeler
      const reveals = gsap.utils.toArray("[data-reveal]");
      gsap.set(reveals, { autoAlpha: 0, y: 36 });
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09 }),
      });

      // Süzülen dekoratif şekiller
      gsap.utils.toArray("[data-float]").forEach((el) => {
        gsap.to(el, {
          y: "random(-16, 16)",
          rotation: "random(-25, 25)",
          duration: "random(2.6, 4.6)",
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Başlık altı dalgalı çizgiler kaydırınca çizilir
      gsap.utils.toArray("[data-squiggle]").forEach((el) => {
        gsap.fromTo(
          el,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      // Kelime kelime aydınlanan paragraf
      gsap.utils.toArray("[data-words]").forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll(".w"),
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
          }
        );
      });

      // Paralaks
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { yPercent: speed * 100 },
          {
            yPercent: -speed * 100,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // Perde gibi açılan görseller
      gsap.utils.toArray("[data-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      // Beceri çubukları
      gsap.utils.toArray("[data-bar]").forEach((el) => {
        gsap.fromTo(
          el,
          { width: "0%" },
          {
            width: `${el.dataset.bar}%`,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      });

      // Okuma ilerlemesi
      gsap.utils.toArray("[data-progress]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
          }
        );
      });

      // Eğitim zaman çizelgesi çizgisi
      gsap.utils.toArray("[data-draw]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top 75%", end: "bottom 60%", scrub: true },
          }
        );
      });

    });

    html.classList.remove("anim");

    // Görseller yüklendikçe ölçüleri yenile
    const refresh = () => ScrollTrigger.refresh();
    const imgs = Array.from(document.images).filter((img) => !img.complete);
    imgs.forEach((img) => img.addEventListener("load", refresh, { once: true }));
    const t = setTimeout(refresh, 400);

    return () => {
      clearTimeout(t);
      imgs.forEach((img) => img.removeEventListener("load", refresh));
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = null;
    };
  }, [pathname]);

  return null;
}
