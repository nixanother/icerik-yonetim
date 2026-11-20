import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getLang, pick, dict } from "@/lib/i18n";
import { Chars } from "@/components/Split";
import Shapes, { Squiggle } from "@/components/Shapes";
import GalleryLightbox from "@/components/GalleryLightbox";

export const dynamic = "force-dynamic";
export const metadata = { title: "Galeri" };

export default async function GalleryPage() {
  const lang = await getLang();
  const t = dict[lang];
  const images = await db.select("gallery", "select=*&order=created_at.desc");

  return (
    <div className="relative isolate mx-auto max-w-6xl px-5 pt-12 md:pt-20">
      <Shapes set="page" />
      <h1 className="display text-[clamp(3.2rem,10vw,8rem)]">
        <Chars text={t.gallery} />
      </h1>
      <Squiggle color="var(--orange)" className="mt-3" />
      <p data-reveal className="mt-5 max-w-xl font-serif text-xl text-slate">
        {t.galleryIntro}
      </p>

      {images.length === 0 && <p className="mt-16 text-slate">{t.noImages}</p>}

      <GalleryLightbox
        images={images.map((img) => ({
          id: img.id,
          src: publicUrl(img.image_path),
          caption: pick(img, "title", lang),
        }))}
        labels={{ open: t.enlarge, photo: t.gallery, close: t.close, prev: t.prev, next: t.next }}
      />
    </div>
  );
}
