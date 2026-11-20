import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Yönetici Girişi" };

export default async function LoginPage() {
  // Zaten giriş yapılmışsa panele yönlendir
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="mx-5 mt-16 max-w-md rounded-2xl border border-line bg-white p-8 sm:mx-auto">
      <h1 className="mb-6 text-center text-2xl font-bold text-indigo-900">Yönetici Girişi</h1>
      <LoginForm />
    </div>
  );
}
