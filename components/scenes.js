// Anasayfadaki sabitlenen sahnelerin kurulumu (PinScenes kullanır)
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FPS = 25;

function timecode(totalFrames) {
  const f = Math.floor(totalFrames % FPS);
  const s = Math.floor(totalFrames / FPS) % 60;
  const m = Math.floor(totalFrames / FPS / 60) % 60;
  const h = Math.floor(totalFrames / FPS / 3600);
  return [h, m, s, f].map((n) => String(n).padStart(2, "0")).join(":");
}

export function setupHero(root, mm) {
  const playhead = root.querySelector("[data-playhead]");
  const tc = root.querySelector("[data-tc]");
  const clips = gsap.utils.toArray(root.querySelectorAll("[data-clip-i]"));
  const caps = gsap.utils.toArray(root.querySelectorAll("[data-cap]"));
  const visual = root.querySelector("[data-hero-visual]");
  const duration = Number(root.dataset.duration || 96); // saniye
  if (!playhead || clips.length === 0) return;

  const setActive = (i) => {
    clips.forEach((c, k) => (c.dataset.active = k === i ? "true" : "false"));
    caps.forEach((c, k) => c.setAttribute("aria-hidden", k === i ? "false" : "true"));
  };
  setActive(0);

  mm.add("(min-width: 768px)", () => {
    gsap.set(caps, { autoAlpha: 0, y: 24 });
    gsap.set(caps[0], { autoAlpha: 1, y: 0 });
    let current = 0;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        // Yapışkan menünün altından sabitlensin
        start: () => `top ${document.querySelector("header")?.offsetHeight || 0}px`,
        end: "+=180%",
        pin: true,
        scrub: 0.6,
        onUpdate(self) {
          const p = self.progress;
          if (tc) tc.textContent = timecode(p * duration * FPS);
          const i = Math.min(clips.length - 1, Math.floor(p * clips.length));
          if (i !== current) {
            gsap.to(caps[current], { autoAlpha: 0, y: -24, duration: 0.35, overwrite: true });
            gsap.fromTo(caps[i], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, overwrite: true });
            current = i;
            setActive(i);
          }
        },
      },
    });
    tl.fromTo(playhead, { left: "0%" }, { left: "100%" }, 0);
    if (visual) tl.fromTo(visual, { scale: 1, rotate: 0 }, { scale: 0.82, rotate: -3 }, 0);
  });

  // Mobilde sabitleme yok: playhead sayfa kaydıkça ilerler, tüm açıklamalar alt alta görünür
  mm.add("(max-width: 767px)", () => {
    gsap.fromTo(
      playhead,
      { left: "0%" },
      {
        left: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate(self) {
            if (tc) tc.textContent = timecode(self.progress * duration * FPS);
          },
        },
      }
    );
  });
}

export function setupRail(rail, mm) {
  const track = rail.querySelector("[data-rail-track]");
  if (!track) return;
  mm.add("(min-width: 768px)", () => {
    const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: rail,
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  });
}

