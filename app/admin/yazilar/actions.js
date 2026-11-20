"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const text = (formData, key) => String(formData.get(key) || "").trim();

function refresh() {
  revalidatePath("/", "layout");
}

// Makale ekler (id yoksa) ya da günceller (id varsa)
export async function savePost(prevState, formData) {
  await requireAdmin();

  const id = formData.get("id");
  const title = text(formData, "title");
  const published = formData.get("published") === "on";
  const slug = slugify(text(formData, "slug") || title);

  if (!title) return { error: "Başlık zorunludur." };
  if (!slug) return { error: "Başlıktan geçerli bir adres (slug) üretilemedi." };

  const row = {
    title,
    title_en: text(formData, "title_en"),
    slug,
    content: text(formData, "content"),
    content_en: text(formData, "content_en"),
    category: text(formData, "category"),
    category_en: text(formData, "category_en"),
    tags: text(formData, "tags"),
    tags_en: text(formData, "tags_en"),
    published,
  };

  try {
    if (id) {
      await db.update("posts", `id=eq.${Number(id)}`, row);
    } else {
      await db.insert("posts", row);
    }
  } catch (err) {
    // 23505: benzersizlik ihlali (aynı slug zaten var)
    if (String(err.message).includes("23505")) {
      return { error: "Bu adres (slug) zaten kullanılıyor. Başlığı ya da adresi değiştir." };
    }
    return { error: "Kayıt sırasında bir hata oluştu. Güncelleme SQL'ini çalıştırdın mı?" };
  }

  refresh();
  redirect("/admin/yazilar");
}

export async function deletePost(formData) {
  await requireAdmin();
  await db.remove("posts", `id=eq.${Number(formData.get("id"))}`);
  refresh();
}

// Yayında / taslak arasında geçiş
export async function togglePublish(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";
  await db.update("posts", `id=eq.${id}`, { published: !published });
  refresh();
}

// Öne çıkan yazılar sitede en üstte ve rozetle gösterilir
export async function toggleFeatured(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const featured = formData.get("featured") === "true";
  await db.update("posts", `id=eq.${id}`, { featured: !featured });
  refresh();
}
