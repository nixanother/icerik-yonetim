"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function deleteMessage(formData) {
  await requireAdmin();
  await db.remove("messages", `id=eq.${Number(formData.get("id"))}`);
  revalidatePath("/admin/mesajlar");
}
