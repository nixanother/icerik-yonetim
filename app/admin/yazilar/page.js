import Link from "next/link";
import { db } from "@/lib/db";
import { deletePost, togglePublish } from "./actions";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await db.select("posts", "select=*&order=created_at.desc");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-900">Makaleler</h1>
        <Link href="/admin/yazilar/yeni" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Yeni Makale
        </Link>
      </div>

      {posts.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">Henüz makale yok.</div>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow">
            <div className="min-w-0">
              <p className="truncate font-semibold">{post.title}</p>
              <p className="text-sm text-gray-400">
                /yazi/{post.slug} · {new Date(post.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form action={togglePublish}>
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="published" value={String(post.published)} />
                <button
                  type="submit"
                  className={`rounded-lg px-3 py-1 text-sm text-white ${
                    post.published ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  {post.published ? "Yayında" : "Taslak"}
                </button>
              </form>
              <Link href={`/admin/yazilar/${post.id}`} className="rounded-lg bg-amber-400 px-3 py-1 text-sm hover:bg-amber-500">
                Düzenle
              </Link>
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
                  Sil
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
