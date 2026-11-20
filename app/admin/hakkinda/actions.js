"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { uploadToStorage } from "@/lib/storage";

const KEYS = [
  "about_title",
  "about_title_en",
  "tagline",
  "tagline_en",
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

  // Vesikalık, anasayfa fotoğrafı ve CV (hepsi isteğe bağlı)
  const uploads = [
    { field: "photo", key: "photo_path", isPdf: false },
    { field: "hero_photo", key: "hero_photo_path", isPdf: false },
    { field: "cv", key: "cv_path", isPdf: true },
  ];
  for (const { field, key, isPdf } of uploads) {
    const file = formData.get(field);
    if (file && typeof file !== "string" && file.size > 0) {
      if (isPdf && file.type !== "application/pdf") return { error: "CV bir PDF dosyası olmalı." };
      if (!isPdf && !file.type.startsWith("image/")) return { error: "Fotoğraf bir resim dosyası olmalı." };
      if (file.size > 4 * 1024 * 1024) return { error: "Dosya 4 MB'tan büyük olamaz." };
      try {
        rows.push({ key, value: await uploadToStorage(file) });
      } catch (err) {
        return { error: `Dosya yüklenemedi: ${err.message}` };
      }
    }
  }
  if (formData.get("remove_cv") === "on") rows.push({ key: "cv_path", value: "" });

  try {
    await db.upsert("site_settings", rows, "key");
  } catch {
    return { error: "Kaydedilirken bir hata oluştu." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
