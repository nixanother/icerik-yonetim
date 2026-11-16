"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { bugun } from "@/lib/tarih";

function yenile() {
  revalidatePath("/admin/ajanda");
  revalidatePath("/admin");
}

const id = (formData) => Number(formData.get("id"));
const metin = (formData, ad) => String(formData.get(ad) || "").trim();

// ---------- Görevler ----------

export async function addTask(formData) {
  await requireAdmin();
  const title = metin(formData, "title");
  const dueDate = metin(formData, "due_date");
  if (!title) return;
  await db.insert("agenda", { title, due_date: dueDate || null });
  yenile();
}

export async function toggleTask(formData) {
  await requireAdmin();
  const done = formData.get("done") === "true";
  await db.update("agenda", `id=eq.${id(formData)}`, { done: !done });
  yenile();
}

export async function deleteTask(formData) {
  await requireAdmin();
  await db.remove("agenda", `id=eq.${id(formData)}`);
  yenile();
}

// ---------- Bakım (Şakir vb.) ----------

export async function careDone(formData) {
  await requireAdmin();
  await db.update("care_tasks", `id=eq.${id(formData)}`, { last_done: bugun() });
  yenile();
}

export async function addCare(formData) {
  await requireAdmin();
  const title = metin(formData, "title");
  const pet = metin(formData, "pet");
  const interval = Math.max(1, Number(formData.get("interval_days")) || 1);
  if (!title) return;
  await db.insert("care_tasks", { title, pet, interval_days: interval });
  yenile();
}

export async function deleteCare(formData) {
  await requireAdmin();
  await db.remove("care_tasks", `id=eq.${id(formData)}`);
  yenile();
}

// ---------- Abonelikler ve bütçe ----------

export async function addSubscription(formData) {
  await requireAdmin();
  const name = metin(formData, "name");
  const price = Number(metin(formData, "monthly_price").replace(",", ".")) || 0;
  const day = Math.min(31, Math.max(1, Number(formData.get("renew_day")) || 1));
  if (!name) return;
  await db.insert("subscriptions", { name, monthly_price: price, renew_day: day });
  yenile();
}

export async function deleteSubscription(formData) {
  await requireAdmin();
  await db.remove("subscriptions", `id=eq.${id(formData)}`);
  yenile();
}

export async function setIncome(formData) {
  await requireAdmin();
  const income = Number(metin(formData, "income").replace(",", ".")) || 0;
  await db.upsert("site_settings", { key: "monthly_income", value: String(income) }, "key");
  yenile();
}

// ---------- Randevular ----------

export async function addAppointment(formData) {
  await requireAdmin();
  const title = metin(formData, "title") || "Randevu";
  const when = metin(formData, "starts_at"); // "YYYY-AA-GGTSS:DD" (Türkiye saati)
  if (!when) return;
  await db.insert("appointments", { title, starts_at: `${when}:00+03:00`, note: metin(formData, "note") });
  yenile();
}

export async function appointmentDone(formData) {
  await requireAdmin();
  await db.update("appointments", `id=eq.${id(formData)}`, { done: true });
  yenile();
}

export async function deleteAppointment(formData) {
  await requireAdmin();
  await db.remove("appointments", `id=eq.${id(formData)}`);
  yenile();
}

// ---------- İlaç takibi ----------

export async function medTaken(formData) {
  await requireAdmin();
  await db.upsert("med_logs", { medication_id: id(formData), taken_on: bugun() }, "medication_id,taken_on");
  yenile();
}

export async function medUndo(formData) {
  await requireAdmin();
  await db.remove("med_logs", `medication_id=eq.${id(formData)}&taken_on=eq.${bugun()}`);
  yenile();
}
