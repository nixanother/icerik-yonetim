import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import EditImageForm from "../EditImageForm";

export const dynamic = "force-dynamic";

export default async function EditImagePage({ params }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const rows = await db.select("gallery", `select=*&id=eq.${numericId}&limit=1`);
  const image = rows[0];
  if (!image) notFound();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Resmi Düzenle</h1>
      <EditImageForm image={image} imageUrl={publicUrl(image.image_path)} />
    </div>
  );
}
