import Link from "next/link";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { deleteProject } from "./actions";
import ProjectForm from "./ProjectForm";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await db.select("projects", "select=*&order=created_at.desc");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Projeler</h1>
      <ProjectForm />

      {projects.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">Henüz proje yok.</div>
      )}

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow">
            {p.image_path && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={publicUrl(p.image_path)} alt={p.title} className="h-16 w-24 rounded-lg bg-gray-50 object-contain" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.title}</p>
              <p className="truncate text-sm text-gray-500">{p.description}</p>
            </div>
            <Link
              href={`/admin/projeler/${p.id}`}
              className="rounded-lg bg-amber-400 px-3 py-1 text-sm hover:bg-amber-500"
            >
              Düzenle
            </Link>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="path" value={p.image_path || ""} />
              <button type="submit" className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
                Sil
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
