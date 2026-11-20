// Yazı içeriğini basit kurallarla biçimlendirir:
//   "## Başlık"      → ara başlık
//   "- madde"        → madde işaretli liste
//   "1. adım"        → numaralı liste
//   boş satır        → yeni paragraf

function toBlocks(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const blocks = [];
  let para = [];

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }
    const ul = line.match(/^[-•]\s+(.*)$/);
    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const type = ul ? "ul" : "ol";
      const last = blocks[blocks.length - 1];
      if (last && last.type === type) last.items.push((ul || ol)[1]);
      else blocks.push({ type, items: [(ul || ol)[1]] });
      continue;
    }
    para.push(line);
  }
  flushPara();
  return blocks;
}

// Liste ve özet kartları için işaretlerden arındırılmış düz metin
export function plainText(text) {
  return String(text || "")
    .replace(/^##\s+/gm, "")
    .replace(/^[-•]\s+/gm, "")
    .replace(/^\d+[.)]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Prose({ text }) {
  const blocks = toBlocks(text);
  return (
    <div className="prose-body">
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((it, k) => (
                <li key={k}>{it}</li>
              ))}
            </ul>
          );
        if (b.type === "ol")
          return (
            <ol key={i}>
              {b.items.map((it, k) => (
                <li key={k}>{it}</li>
              ))}
            </ol>
          );
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
