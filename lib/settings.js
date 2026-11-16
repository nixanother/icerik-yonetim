import { db } from "@/lib/db";

// site_settings tablosundaki anahtar/değer çiftlerini nesne olarak döndürür
export async function getSettings() {
  const rows = await db.select("site_settings", "select=key,value");
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
