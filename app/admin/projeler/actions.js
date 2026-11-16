"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { removeFromStorage, uploadToStorage } from "@/lib/storage";

const text = (formData, key) => String(formData.get(key) || "").trim();

export async function addProject(prevState, formData) {
  await requireAdmin();

  const title = text(formData, "title");
  if (!title) return { error: "Proje adı zorunludur." };

  let image_path = "";
  const file = formData.get("image");
  if (file && typeof file !== "string" && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Sadece resim dosyası yüklenebilir." };
    if (file.size > 4 * 1024 * 1024) return { error: "Resim 4 MB'tan büyük olamaz." };
    try {
      image_path = await uploadToStorage(file);
    } catch (err) {
      return { error: `Resim yüklenemedi: ${err.message}` };
    }
  }

  const link = text(formData, "link");
  if (link && !/^https?:\/\//i.test(link)) {
    return { error: "Bağlantı http:// veya https:// ile başlamalı." };
  }

  try {
    await db.insert("projects", {
      title,
      title_en: text(formData, "title_en"),
      description: text(formData, "description"),
      description_en: text(formData, "description_en"),
      link,
      image_path,
    });
  } catch {
    return { error: "Kaydedilemedi. Güncelleme SQL'ini çalıştırdın mı?" };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteProject(formData) {
  await requireAdmin();
  const path = String(formData.get("path") || "");
  if (path) await removeFromStorage(path);
  await db.remove("projects", `id=eq.${Number(formData.get("id"))}`);
  revalidatePath("/", "layout");
}
