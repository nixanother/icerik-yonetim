"use server";

import { redirect } from "next/navigation";
import { endSession, safeEqual, startSession } from "@/lib/auth";

export async function login(prevState, formData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const expectedUser = process.env.ADMIN_USERNAME || "";
  const expectedPass = process.env.ADMIN_PASSWORD || "";

  const valid =
    expectedPass !== "" && safeEqual(username, expectedUser) && safeEqual(password, expectedPass);

  if (!valid) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/");
}
