import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Yönetim Paneli" };

export default async function AdminLayout({ children }) {
  // Giriş yapılmamışsa /giris sayfasına yönlendirir (tüm /admin sayfalarını korur)
  await requireAdmin();

  // Menüde okunmamış mesaj sayısı rozeti
  const messages = await db.select("messages", "select=*").catch(() => []);
  const unread = messages.filter((m) => m.is_read === false).length;

  const items = [
    { href: "/admin", label: "Genel Bakış" },
    { href: "/admin/yazilar", label: "Makaleler" },
    { href: "/admin/yazilar/yeni", label: "Yeni Makale" },
    { href: "/admin/projeler", label: "Projeler" },
    { href: "/admin/galeri", label: "Galeri" },
    { href: "/admin/hakkinda", label: "Hakkımda" },
    { href: "/admin/beceriler", label: "Yetenekler" },
    { href: "/admin/mesajlar", label: "Mesajlar" },
    { href: "/admin/ajanda", label: "Ajanda" },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 md:grid-cols-[200px_1fr]">
      <aside className="h-fit rounded-2xl bg-indigo-950 p-4 text-white">
        <p className="mb-3 px-2 text-sm font-semibold uppercase tracking-wide text-indigo-300">Yönetim</p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <span className="flex items-center justify-between gap-2">
                {item.label}
                {item.href === "/admin/mesajlar" && unread > 0 && (
                  <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs font-bold text-white">{unread}</span>
                )}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
