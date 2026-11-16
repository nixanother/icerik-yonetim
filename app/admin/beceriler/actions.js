"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function addSkill(formData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const level = Math.min(100, Math.max(0, Number(formData.get("level")) || 0));
  if (!name) return;
  await db.insert("skills", { name, level });
  revalidatePath("/", "layout");
}

export async function deleteSkill(formData) {
  await requireAdmin();
  await db.remove("skills", `id=eq.${Number(formData.get("id"))}`);
  revalidatePath("/", "layout");
}
