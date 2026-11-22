import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import Budgie from "@/components/Budgie";
import AdminNav from "./AdminNav";

export const metadata = { title: "Yönetim Paneli" };

export default async function AdminLayout({ children }) {
  // Giriş yapılmamışsa /giris sayfasına yönlendirir (tüm /admin sayfalarını korur)
  await requireAdmin();

  // Menüde okunmamış mesaj sayısı rozeti
  const messages = await db.select("messages", "select=*").catch(() => []);
  const unread = messages.filter((m) => m.is_read === false).length;

  return (
    <div className="admin-ui mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 md:grid-cols-[230px_1fr]">
      <aside className="h-fit rounded-[1.5rem] border-2 border-ink bg-paper-2 p-3 shadow-[5px_5px_0_var(--ink)] md:sticky md:top-24">
        <div className="mb-3 flex items-center gap-2 border-b-2 border-dashed border-ink/15 px-2 pb-3">
          <Budgie className="w-12 shrink-0" />
          <div className="leading-tight">
            <p className="font-bold">Yönetim Paneli</p>
            <Link href="/" className="text-sm text-slate hover:text-cobalt">
              Siteyi gör ↗
            </Link>
          </div>
        </div>
        <AdminNav unread={unread} />
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
