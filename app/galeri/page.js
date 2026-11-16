import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getLang, pick, dict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "Galeri" };

export default async function GalleryPage() {
  const lang = await getLang();
  const t = dict[lang];
  const images = await db.select("gallery", "select=*&order=created_at.desc");

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-indigo-900">{t.gallery}</h1>
      <p className="mb-8 text-gray-600">{t.galleryIntro}</p>

      {images.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">{t.noImages}</div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((img) => (
          <figure key={img.id} className="overflow-hidden rounded-2xl bg-white shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicUrl(img.image_path)}
              alt={pick(img, "title", lang) || "Galeri"}
              className="aspect-square w-full object-cover"
            />
            {pick(img, "title", lang) && (
              <figcaption className="p-3 text-sm text-gray-600">{pick(img, "title", lang)}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
