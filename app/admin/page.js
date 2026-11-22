import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Tablo yoksa ya da bir hata olursa panel çökmesin, boş liste dönsün
const safe = (p) => p.catch(() => []);

export default async function AdminHome() {
  const [posts, projects, images, messages, tasks] = await Promise.all([
    safe(db.select("posts", "select=*")),
    safe(db.select("projects", "select=id")),
    safe(db.select("gallery", "select=id")),
    safe(db.select("messages", "select=*&order=created_at.desc")),
    safe(db.select("agenda", "select=id,done")),
  ]);

  const settings = await getSettings().catch(() => ({}));
  const firstName = String(settings.about_title || "").trim().split(/\s+/)[0] || "";
  const hour = Number(
    new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Europe/Istanbul" })
  );
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  const unread = messages.filter((m) => m.is_read === false);
  const published = posts.filter((p) => p.published).length;

  const stats = [
    { label: "Makale", value: posts.length, note: `${published} yayında · ${posts.length - published} taslak`, href: "/admin/yazilar", color: "bg-indigo-600" },
    { label: "Proje", value: projects.length, note: "sitede listelenen", href: "/admin/projeler", color: "bg-emerald-500" },
    { label: "Fotoğraf", value: images.length, note: "galeride", href: "/admin/galeri", color: "bg-amber-500" },
    { label: "Okunmamış mesaj", value: unread.length, note: `toplam ${messages.length} mesaj`, href: "/admin/mesajlar", color: "bg-pink-500" },
    { label: "Bekleyen görev", value: tasks.filter((t) => !t.done).length, note: "ajandada", href: "/admin/ajanda", color: "bg-sky-500" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1>
          {greeting}
          {firstName ? `, ${firstName}` : ""} 👋
        </h1>
        <p className="mt-1 text-slate">
          {unread.length > 0
            ? `${unread.length} okunmamış mesajın var. Şakir merak ediyor!`
            : "Her şey yolunda görünüyor. Bugün ne ekleyelim?"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className={`absolute top-0 left-0 h-1.5 w-full ${s.color}`} />
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-4xl font-bold text-indigo-950">{s.value}</p>
            <p className="mt-1 text-xs text-gray-400">{s.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-indigo-900">Son mesajlar</h2>
            <Link href="/admin/mesajlar" className="text-sm text-indigo-600 hover:underline">
              Tümü
            </Link>
          </div>
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz mesaj yok.</p>
          ) : (
            <ul className="divide-y">
              {messages.slice(0, 4).map((m) => (
                <li key={m.id} className="py-2.5">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {m.is_read === false && <span className="h-2 w-2 rounded-full bg-pink-500" />}
                    {m.name}
                    <span className="ml-auto text-xs font-normal text-gray-400">
                      {new Date(m.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </p>
                  <p className="truncate text-sm text-gray-500">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-3 font-bold text-indigo-900">Hızlı işlemler</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/yazilar/yeni" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
              Yeni makale
            </Link>
            <Link href="/admin/projeler" className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">
              Proje ekle
            </Link>
            <Link href="/admin/galeri" className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">
              Fotoğraf yükle
            </Link>
            <Link href="/admin/hakkinda" className="rounded-lg bg-white px-4 py-2 text-indigo-700 shadow hover:shadow-md">
              Hakkımda&apos;yı düzenle
            </Link>
            <Link href="/" className="rounded-lg bg-white px-4 py-2 text-indigo-700 shadow hover:shadow-md">
              Siteyi görüntüle
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
