"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function refresh() {
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(formData) {
  await requireAdmin();
  await db.remove("messages", `id=eq.${Number(formData.get("id"))}`);
  refresh();
}

// Okundu <-> okunmadı arasında geçiş
export async function toggleRead(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const isRead = formData.get("is_read") === "true";
  await db.update("messages", `id=eq.${id}`, { is_read: !isRead });
  refresh();
}

export async function markAllRead() {
  await requireAdmin();
  await db.update("messages", "is_read=eq.false", { is_read: true });
  refresh();
}
