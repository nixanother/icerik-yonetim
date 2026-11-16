"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { uploadToStorage } from "@/lib/storage";

const KEYS = [
  "about_title",
  "about_title_en",
  "about_text",
  "about_text_en",
  "education",
  "education_en",
  "interests",
  "interests_en",
  "video_url",
  "address",
  "address_en",
  "phone",
  "email",
];

export async function saveAbout(prevState, formData) {
  await requireAdmin();

  const rows = KEYS.map((key) => ({ key, value: String(formData.get(key) || "").trim() }));

  // Vesikalık fotoğraf (isteğe bağlı)
  const photo = formData.get("photo");
  if (photo && typeof photo !== "string" && photo.size > 0) {
    if (!photo.type.startsWith("image/")) return { error: "Fotoğraf bir resim dosyası olmalı." };
    if (photo.size > 4 * 1024 * 1024) return { error: "Fotoğraf 4 MB'tan büyük olamaz." };
    try {
      rows.push({ key: "photo_path", value: await uploadToStorage(photo) });
    } catch (err) {
      return { error: `Fotoğraf yüklenemedi: ${err.message}` };
    }
  }

  try {
    await db.upsert("site_settings", rows, "key");
  } catch {
    return { error: "Kaydedilirken bir hata oluştu." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
