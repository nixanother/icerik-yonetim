"use client";

// Galeri ızgarası + tam ekran görüntüleyici (lightbox).
// Fotoğrafa tıklayınca açılır; oklar, klavye (← → Esc) ve parmakla kaydırma ile gezilir.

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-[0.5deg]", "-rotate-[0.5deg]"];
const SOFTS = [
  "bg-[color-mix(in_srgb,var(--pink)_16%,white)]",
  "bg-[color-mix(in_srgb,var(--mint)_16%,white)]",
  "bg-[color-mix(in_srgb,var(--amber)_30%,white)]",
  "bg-[color-mix(in_srgb,var(--sky)_16%,white)]",
  "bg-[color-mix(in_srgb,var(--orange)_16%,white)]",
  "bg-[color-mix(in_srgb,var(--cobalt)_13%,white)]",
];

export default function GalleryLightbox({ images, labels }) {
  const [index, setIndex] = useState(-1); // -1: kapalı
  const overlayRef = useRef(null);
  const frameRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const touchX = useRef(null);
  const open = index >= 0;
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (i) => {
    lastFocus.current = document.activeElement;
    setIndex(i);
  };

  const close = useCallback(() => {
    const done = () => {
      setIndex(-1);
      lastFocus.current?.focus?.();
    };
    if (reduce() || !overlayRef.current) return done();
    gsap.to(frameRef.current, { scale: 0.9, rotate: 2, autoAlpha: 0, duration: 0.25, ease: "power2.in" });
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, delay: 0.05, onComplete: done });
  }, []);

  const go = useCallback(
    (dir) => {
      if (images.length < 2) return;
      const next = (index + dir + images.length) % images.length;
      if (reduce() || !frameRef.current) return setIndex(next);
      gsap.to(frameRef.current, {
        x: -dir * 80,
        autoAlpha: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setIndex(next);
          gsap.fromTo(
            frameRef.current,
            { x: dir * 80, autoAlpha: 0, rotate: dir * 3 },
            { x: 0, autoAlpha: 1, rotate: 0, duration: 0.4, ease: "back.out(1.6)" }
          );
        },
      });
    },
    [index, images.length]
  );

  // Açılış animasyonu, kaydırmayı kilitleme ve odak
  useEffect(() => {
    if (!open) return;
    const lenis = window.__lenis;
    lenis?.stop?.();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    if (!reduce()) {
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
      gsap.fromTo(
        frameRef.current,
        { scale: 0.8, rotate: -4, autoAlpha: 0 },
        { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
    return () => {
      lenis?.start?.();
      document.documentElement.style.overflow = "";
    };
    // sadece açılıp kapanınca çalışsın
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Klavye
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, go]);

  const current = open ? images[index] : null;

  return (
    <>
      <div className="mt-16 columns-2 gap-3 md:columns-3 md:gap-5">
        {images.map((img, i) => (
          <figure
            key={img.id}
            data-reveal
            className={`tilt ${TILTS[i % TILTS.length]} mb-5 break-inside-avoid rounded-2xl border-2 border-ink bg-paper-2 p-2 shadow-[4px_4px_0_var(--ink)] md:mb-7`}
          >
            <button
              type="button"
              onClick={() => show(i)}
              aria-label={`${labels.open}: ${img.caption || labels.photo}`}
              className={`group block w-full cursor-zoom-in overflow-hidden rounded-xl ${SOFTS[i % SOFTS.length]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.caption || labels.photo}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </button>
            {img.caption && <figcaption className="px-1 pt-2 pb-1 text-sm font-semibold">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {/* Görüntüleyici sayfanın en üstüne (body'ye) taşınır; böylece menünün arkasında kalmaz */}
      {open && createPortal(
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || labels.photo}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm md:p-10"
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <figure
            ref={frameRef}
            className="relative max-h-full max-w-5xl rounded-[1.75rem] border-2 border-ink bg-paper-2 p-3 shadow-[8px_8px_0_var(--pink)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.caption || labels.photo}
              className="max-h-[72vh] w-auto rounded-[1.25rem] object-contain"
            />
            <figcaption className="flex items-center justify-between gap-4 px-2 pt-3">
              <span className="font-semibold">{current.caption}</span>
              <span className="tc shrink-0 text-sm text-slate">
                {index + 1} / {images.length}
              </span>
            </figcaption>
          </figure>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="wiggle absolute top-4 right-4 grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-amber text-2xl font-bold text-ink shadow-[3px_3px_0_var(--ink)]"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.prev}
                className="wiggle absolute top-1/2 left-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-mint text-2xl font-bold text-white shadow-[3px_3px_0_var(--ink)] md:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="wiggle absolute top-1/2 right-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-pink text-2xl font-bold text-white shadow-[3px_3px_0_var(--ink)] md:right-6"
              >
                ›
              </button>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
