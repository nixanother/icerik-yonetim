import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [posts, tasks] = await Promise.all([
    db.select("posts", "select=id,published"),
    db.select("agenda", "select=id,done"),
  ]);

  const stats = [
    { label: "Toplam Makale", value: posts.length },
    { label: "Yayında", value: posts.filter((p) => p.published).length },
    { label: "Taslak", value: posts.filter((p) => !p.published).length },
    { label: "Bekleyen Görev", value: tasks.filter((t) => !t.done).length },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-indigo-900">Genel Bakış</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/admin/yazilar/yeni" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Yeni Makale Ekle
        </Link>
        <Link href="/admin/ajanda" className="rounded-lg bg-white px-4 py-2 text-indigo-700 shadow hover:shadow-md">
          Ajandaya Git
        </Link>
      </div>
    </div>
  );
}
