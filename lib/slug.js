// "Merhaba Dünya!" -> "merhaba-dunya" (Türkçe karakterleri çevirir)
export function slugify(text) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
  return String(text)
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (ch) => map[ch])
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
