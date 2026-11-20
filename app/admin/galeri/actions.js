"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { removeFromStorage, uploadToStorage } from "@/lib/storage";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export async function addImage(prevState, formData) {
  await requireAdmin();

  const file = formData.get("image");
  const title = String(formData.get("title") || "").trim();
  const title_en = String(formData.get("title_en") || "").trim();

  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Bir resim seç." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Sadece resim dosyaları yüklenebilir." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Resim 4 MB'tan büyük olamaz." };
  }

  try {
    const path = await uploadToStorage(file);
    await db.insert("gallery", { title, title_en, image_path: path });
  } catch (err) {
    return { error: `Yükleme başarısız: ${err.message}` };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteImage(formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const path = String(formData.get("path") || "");

  if (path) await removeFromStorage(path);
  await db.remove("gallery", `id=eq.${id}`);

  revalidatePath("/", "layout");
}

// Açıklamaları günceller; yeni resim seçilirse eskisinin yerine koyar
export async function updateImage(prevState, formData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const oldPath = String(formData.get("old_path") || "");
  const row = {
    title: String(formData.get("title") || "").trim(),
    title_en: String(formData.get("title_en") || "").trim(),
  };

  const file = formData.get("image");
  if (file && typeof file !== "string" && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Sadece resim dosyaları yüklenebilir." };
    if (file.size > MAX_SIZE) return { error: "Resim 4 MB'tan büyük olamaz." };
    try {
      row.image_path = await uploadToStorage(file);
    } catch (err) {
      return { error: `Yükleme başarısız: ${err.message}` };
    }
  }

  try {
    await db.update("gallery", `id=eq.${id}`, row);
  } catch {
    return { error: "Kaydedilemedi." };
  }
  if (row.image_path && oldPath) await removeFromStorage(oldPath);

  revalidatePath("/", "layout");
  redirect("/admin/galeri");
}
