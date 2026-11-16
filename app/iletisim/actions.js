"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getLang, dict } from "@/lib/i18n";

export async function sendMessage(prevState, formData) {
  const t = dict[await getLang()];

  // Bot tuzağı: gizli alan doluysa sessizce başarılı say
  if (formData.get("website")) return { ok: true };

  const name = String(formData.get("name") || "").trim().slice(0, 100);
  const email = String(formData.get("email") || "").trim().slice(0, 150);
  const message = String(formData.get("message") || "").trim().slice(0, 3000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: t.contactInvalid };
  }

  try {
    await db.insert("messages", { name, email, message });
  } catch {
    return { error: t.contactError };
  }

  revalidatePath("/admin/mesajlar");
  return { ok: true };
}
