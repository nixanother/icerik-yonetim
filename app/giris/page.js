import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Yönetici Girişi" };

export default async function LoginPage() {
  // Zaten giriş yapılmışsa panele yönlendir
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold text-indigo-900">Yönetici Girişi</h1>
      <LoginForm />
    </div>
  );
}
