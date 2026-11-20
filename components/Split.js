// Metni animasyon için harf ya da kelime parçalarına böler (sunucuda çalışır).
// Ekran okuyucular tam metni aria-label üzerinden okur.

export function Chars({ text, className = "" }) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  return (
    <span data-chars className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="mask-word">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="c">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export function Words({ text, className = "", as: Tag = "p" }) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  return (
    <Tag data-words className={className}>
      {words.map((w, i) => (
        <span key={i} className="w">
          {w}
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
