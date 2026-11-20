import Link from "next/link";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { deleteImage } from "./actions";
import UploadForm from "./UploadForm";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await db.select("gallery", "select=*&order=created_at.desc");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Galeri</h1>

      <UploadForm />

      {images.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">Henüz resim yok.</div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-2xl bg-white shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicUrl(img.image_path)}
              alt={img.title || "Galeri resmi"}
              className="aspect-square w-full object-cover"
            />
            <div className="flex items-center justify-between gap-2 p-3">
              <span className="truncate text-sm text-gray-600">{img.title || "Başlıksız"}</span>
              <Link
                href={`/admin/galeri/${img.id}`}
                className="rounded-lg bg-amber-400 px-3 py-1 text-sm hover:bg-amber-500"
              >
                Düzenle
              </Link>
              <form action={deleteImage}>
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="path" value={img.image_path} />
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
