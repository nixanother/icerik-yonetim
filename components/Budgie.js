// Şakir: SVG ile çizilmiş yeşil muhabbet kuşu.
// data-wing kanadı çırpmak için GSAP tarafından döndürülür.

export default function Budgie({ className = "", title = "Şakir" }) {
  return (
    <svg viewBox="0 0 140 110" className={className} role="img" aria-label={title}>
      {/* kuyruk */}
      <path d="M22 70 L-2 96 L8 98 L30 78 Z" fill="#2f6fd6" stroke="#1d1640" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M26 72 L4 104 L14 104 L34 80 Z" fill="#3f86f0" stroke="#1d1640" strokeWidth="2.5" strokeLinejoin="round" />

      {/* gövde */}
      <ellipse cx="62" cy="64" rx="38" ry="28" fill="#5fd35a" stroke="#1d1640" strokeWidth="3" />
      <ellipse cx="70" cy="74" rx="22" ry="14" fill="#8be86a" />

      {/* baş */}
      <circle cx="98" cy="42" r="22" fill="#ffe14d" stroke="#1d1640" strokeWidth="3" />
      {/* başın arkasındaki dalgalı çizgiler */}
      <path d="M80 30 q4 -4 8 0 M78 38 q4 -4 8 0 M80 46 q4 -4 8 0" fill="none" stroke="#1d1640" strokeWidth="2.2" strokeLinecap="round" />
      {/* göz ve parıltı */}
      <circle cx="104" cy="38" r="5" fill="#1d1640" />
      <circle cx="105.8" cy="36.4" r="1.6" fill="#fff" />
      {/* yanak lekesi */}
      <circle cx="108" cy="52" r="4" fill="#3f86f0" />
      {/* gaga ve burun (cere) */}
      <path d="M114 42 q12 4 4 14 q-4 -6 -8 -6 Z" fill="#ff9f43" stroke="#1d1640" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M110 38 q5 -3 8 1" fill="none" stroke="#5aa9ff" strokeWidth="4" strokeLinecap="round" />

      {/* kanat: omuzdan döner */}
      <g data-wing style={{ transformOrigin: "60px 52px", transformBox: "view-box" }}>
        <path d="M60 52 C40 40 22 48 18 66 C34 70 54 66 66 58 Z" fill="#43b83e" stroke="#1d1640" strokeWidth="3" strokeLinejoin="round" />
        <path d="M28 60 q6 -5 12 0 M38 56 q6 -5 12 0 M48 54 q6 -5 12 0" fill="none" stroke="#1d1640" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ayaklar */}
      <path d="M58 90 v8 M70 90 v8" stroke="#ff7aa8" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
