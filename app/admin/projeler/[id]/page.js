import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const rows = await db.select("projects", `select=*&id=eq.${numericId}&limit=1`);
  const project = rows[0];
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Projeyi Düzenle</h1>
      <ProjectForm project={project} imageUrl={project.image_path ? publicUrl(project.image_path) : null} />
    </div>
  );
}
