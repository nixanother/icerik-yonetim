// Neşeli renk paleti. Tailwind sınıfları burada tam yazılı olmalı ki derlemede bulunsun.
export const FUN = [
  { name: "pink", hex: "var(--pink)", bg: "bg-pink", soft: "bg-[color-mix(in_srgb,var(--pink)_16%,white)]", text: "text-pink", border: "border-pink" },
  { name: "mint", hex: "var(--mint)", bg: "bg-mint", soft: "bg-[color-mix(in_srgb,var(--mint)_16%,white)]", text: "text-mint", border: "border-mint" },
  { name: "sun", hex: "var(--amber)", bg: "bg-amber", soft: "bg-[color-mix(in_srgb,var(--amber)_30%,white)]", text: "text-orange", border: "border-amber" },
  { name: "sky", hex: "var(--sky)", bg: "bg-sky", soft: "bg-[color-mix(in_srgb,var(--sky)_16%,white)]", text: "text-sky", border: "border-sky" },
  { name: "orange", hex: "var(--orange)", bg: "bg-orange", soft: "bg-[color-mix(in_srgb,var(--orange)_16%,white)]", text: "text-orange", border: "border-orange" },
  { name: "violet", hex: "var(--cobalt)", bg: "bg-cobalt", soft: "bg-[color-mix(in_srgb,var(--cobalt)_13%,white)]", text: "text-cobalt", border: "border-cobalt" },
];

export const fun = (i) => FUN[((i % FUN.length) + FUN.length) % FUN.length];

// Kartlara hafif, sabit (her yenilemede aynı) eğiklik
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-[0.5deg]", "-rotate-[0.5deg]"];
export const tilt = (i) => TILTS[i % TILTS.length];
