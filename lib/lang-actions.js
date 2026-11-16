"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLang(formData) {
  const lang = formData.get("lang") === "en" ? "en" : "tr";
  (await cookies()).set("lang", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
