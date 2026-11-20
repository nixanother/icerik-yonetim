// Arka planda süzülen neşeli şekiller (dekoratif; ekran okuyuculardan gizli).
// data-float: yavaşça süzülür, data-parallax: kaydırırken farklı hızda kayar.

const shapes = {
  circle: (c) => <circle cx="20" cy="20" r="18" fill={c} />,
  ring: (c) => <circle cx="20" cy="20" r="14" fill="none" stroke={c} strokeWidth="6" />,
  sparkle: (c) => <path d="M20 0 C22 13 27 18 40 20 C27 22 22 27 20 40 C18 27 13 22 0 20 C13 18 18 13 20 0Z" fill={c} />,
  triangle: (c) => <path d="M20 3 L37 35 L3 35 Z" fill={c} strokeLinejoin="round" />,
  plus: (c) => <path d="M15 2h10v13h13v10H25v13H15V25H2V15h13z" fill={c} />,
  squiggle: (c) => (
    <path d="M2 28 C8 8 14 8 20 20 S32 32 38 12" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
  ),
  half: (c) => <path d="M2 22 A18 18 0 0 1 38 22 Z" fill={c} />,
};

// [şekil, renk, konum sınıfları, boyut(px), paralaks hızı]
const SETS = {
  hero: [
    ["sparkle", "var(--amber)", "top-[6%] left-[46%]", 46, 0.3],
    ["circle", "var(--pink)", "top-[30%] -left-4 md:left-[2%]", 30, 0.5],
    ["ring", "var(--sky)", "top-[12%] right-[30%]", 54, 0.2],
    ["triangle", "var(--mint)", "bottom-[30%] right-[6%]", 40, 0.4],
    ["plus", "var(--orange)", "bottom-[38%] left-[38%]", 28, 0.6],
    ["squiggle", "var(--cobalt)", "top-[52%] right-[40%]", 60, 0.25],
    ["half", "var(--pink)", "bottom-[22%] left-[8%]", 36, 0.35],
  ],
  page: [
    ["sparkle", "var(--amber)", "top-6 right-[12%]", 42, 0.3],
    ["circle", "var(--pink)", "top-24 right-[38%]", 20, 0.5],
    ["ring", "var(--mint)", "top-2 right-[26%]", 38, 0.2],
    ["squiggle", "var(--sky)", "top-32 right-[4%]", 54, 0.35],
  ],
};

export default function Shapes({ set = "page" }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {SETS[set].map(([kind, color, pos, size, speed], i) => (
        <div key={i} className={`absolute ${pos}`} data-parallax={speed}>
          <svg data-float width={size} height={size} viewBox="0 0 40 40" className="overflow-visible">
            {shapes[kind](color)}
          </svg>
        </div>
      ))}
    </div>
  );
}

// Başlık altında kaydırınca çizilen dalgalı çizgi
export function Squiggle({ color = "var(--pink)", className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 18" className={`h-4 w-44 ${className}`} preserveAspectRatio="none">
      <path
        data-squiggle
        pathLength="1"
        d="M2 10 Q 15 0 28 10 T 54 10 T 80 10 T 106 10 T 132 10 T 158 10 T 184 10 T 210 10"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Kaydırma hızından bağımsız akan renkli yazı bandı
export function Marquee({ words }) {
  const colors = ["text-pink", "text-cobalt", "text-mint", "text-orange", "text-sky"];
  const row = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={`display px-6 text-[clamp(2.5rem,7vw,5.5rem)] ${colors[i % colors.length]}`}>{w}</span>
          <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 md:h-12 md:w-12" aria-hidden="true">
            {shapes.sparkle("var(--amber)")}
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee-wrap -rotate-2 overflow-hidden border-y-4 border-ink bg-paper-2 py-4">
      <div className="marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
