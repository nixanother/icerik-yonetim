// Ajanda için tarih yardımcıları. Tüm hesaplar Türkiye saatine (Europe/Istanbul) göre yapılır.

const TZ = "Europe/Istanbul";

// Bugünün tarihi: "YYYY-AA-GG"
export function bugun() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: TZ });
}

// Şu anki saat: "SS:DD"
export function simdiSaat() {
  return new Date().toLocaleTimeString("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
}

// "YYYY-AA-GG" tarihine n gün ekler
export function gunEkle(tarih, n) {
  const d = new Date(`${tarih}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// b - a (gün olarak)
export function gunFarki(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

// "YYYY-AA-GG" -> "19 Kasım"
export function kisaTarih(tarih) {
  return new Date(`${tarih}T00:00:00Z`).toLocaleDateString("tr-TR", { timeZone: "UTC", day: "numeric", month: "long" });
}

// Veritabanındaki zaman damgası -> "19 Kasım Perşembe 14:00"
export function tarihSaat(ts) {
  return new Date(ts).toLocaleString("tr-TR", {
    timeZone: TZ, day: "numeric", month: "long", weekday: "long", hour: "2-digit", minute: "2-digit",
  });
}

// Zaman damgası -> <input type="datetime-local"> değeri ("YYYY-AA-GGTSS:DD")
export function inputDegeri(ts) {
  return new Date(ts).toLocaleString("sv-SE", { timeZone: TZ }).replace(" ", "T").slice(0, 16);
}

// Ayın belirli gününde yenilenen abonelik için bir sonraki ödeme tarihi
export function sonrakiOdeme(yenilemeGunu, bugunTarih) {
  const [y, m, d] = bugunTarih.split("-").map(Number);
  const ayinGunSayisi = (yil, ay) => new Date(Date.UTC(yil, ay, 0)).getUTCDate();

  let yil = y;
  let ay = m;
  let gun = Math.min(yenilemeGunu, ayinGunSayisi(yil, ay));
  if (d > gun) {
    ay += 1;
    if (ay > 12) { ay = 1; yil += 1; }
    gun = Math.min(yenilemeGunu, ayinGunSayisi(yil, ay));
  }
  return `${yil}-${String(ay).padStart(2, "0")}-${String(gun).padStart(2, "0")}`;
}

export function kalanGunMetni(gun) {
  if (gun < 0) return `${-gun} gün gecikti`;
  if (gun === 0) return "Bugün";
  if (gun === 1) return "Yarın";
  return `${gun} gün sonra`;
}
