// Şakir: SVG ile çizilmiş sarı muhabbet kuşu (gerçek Şakir'e benzetildi:
// sapsarı tüyler, başın arkasında ve kanatlarda siyah çizgiler, açık mavi burun, pembe ayaklar).
// data-wing kanadı çırpmak için GSAP tarafından döndürülür.

const INK = "#1d1640";

export default function Budgie({ className = "", title = "Şakir" }) {
  return (
    <svg viewBox="0 0 140 110" className={className} role="img" aria-label={title}>
      {/* kuyruk: sarı, ucu koyu çizgili */}
      <path d="M24 70 L-2 98 L10 100 L32 78 Z" fill="#f2c62c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 72 L6 106 L16 106 L36 80 Z" fill="#ffd93b" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M6 96 l6 2 M10 101 l6 1" stroke={INK} strokeWidth="2" strokeLinecap="round" />

      {/* gövde ve açık renkli göğüs */}
      <ellipse cx="62" cy="64" rx="38" ry="28" fill="#ffe02e" stroke={INK} strokeWidth="3" />
      <ellipse cx="72" cy="74" rx="22" ry="14" fill="#fff27a" />

      {/* baş */}
      <circle cx="98" cy="42" r="22" fill="#ffe94a" stroke={INK} strokeWidth="3" />
      {/* başın arkasındaki ince siyah çizgiler */}
      <path
        d="M80 28 q4 -3 8 0 M78 35 q4 -3 8 0 M78 42 q4 -3 8 0 M80 49 q4 -3 8 0"
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* göz ve parıltı */}
      <circle cx="104" cy="38" r="4.6" fill={INK} />
      <circle cx="105.6" cy="36.6" r="1.5" fill="#fff" />
      {/* yanakta soluk mavi leke ve boğazdaki siyah benekler */}
      <ellipse cx="108" cy="54" rx="4" ry="3.2" fill="#8fa6e8" />
      <circle cx="104" cy="61" r="1.6" fill={INK} />
      <circle cx="110" cy="61.5" r="1.6" fill={INK} />
      {/* açık mavi burun (cere) ve sarımsı gaga */}
      <path d="M109 37 q6 -4 10 1 q-4 3 -10 -1 Z" fill="#9db7ff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M114 42 q12 4 4 14 q-4 -6 -8 -6 Z" fill="#f5c84b" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />

      {/* kanat: sarı, siyah pul desenli; omuzdan döner */}
      <g data-wing style={{ transformOrigin: "60px 52px", transformBox: "view-box" }}>
        <path
          d="M60 52 C40 40 22 48 18 66 C34 70 54 66 66 58 Z"
          fill="#f7d22c"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M26 62 q5 -5 10 0 M36 58 q5 -5 10 0 M46 55 q5 -5 10 0 M31 66 q5 -4 10 0 M42 63 q5 -4 10 0"
          fill="none"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>

      {/* pembe ayaklar */}
      <path d="M58 90 v8 M70 90 v8" stroke="#f4a3b4" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
