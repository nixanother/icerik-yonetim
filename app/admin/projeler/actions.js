"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { removeFromStorage, uploadToStorage } from "@/lib/storage";

const text = (formData, key) => String(formData.get(key) || "").trim();

// Proje ekler (id yoksa) ya da günceller (id varsa).
// Düzenlemede yeni resim seçilmezse eski resim korunur; seçilirse eskisi silinir.
export async function saveProject(prevState, formData) {
  await requireAdmin();

  const id = Number(formData.get("id")) || null;
  const oldPath = text(formData, "old_path");
  const title = text(formData, "title");
  if (!title) return { error: "Proje adı zorunludur." };

  const link = text(formData, "link");
  if (link && !/^https?:\/\//i.test(link)) {
    return { error: "Bağlantı http:// veya https:// ile başlamalı." };
  }

  let image_path = oldPath;
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
  if (formData.get("remove_image") === "on" && image_path === oldPath) image_path = "";

  const row = {
    title,
    title_en: text(formData, "title_en"),
    description: text(formData, "description"),
    description_en: text(formData, "description_en"),
    link,
    image_path,
  };

  try {
    if (id) await db.update("projects", `id=eq.${id}`, row);
    else await db.insert("projects", row);
  } catch {
    return { error: "Kaydedilemedi. Güncelleme SQL'ini çalıştırdın mı?" };
  }

  // Resim değiştiyse ya da kaldırıldıysa eskisini depodan sil
  if (id && oldPath && image_path !== oldPath) await removeFromStorage(oldPath);

  revalidatePath("/", "layout");
  if (id) redirect("/admin/projeler");
  return { ok: true };
}

export async function deleteProject(formData) {
  await requireAdmin();
  const path = String(formData.get("path") || "");
  if (path) await removeFromStorage(path);
  await db.remove("projects", `id=eq.${Number(formData.get("id"))}`);
  revalidatePath("/", "layout");
}
