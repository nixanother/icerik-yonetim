import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getSettings } from "@/lib/settings";
import { getLang, pick, dict } from "@/lib/i18n";
import { youtubeEmbed } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hakkımda" };

export default async function AboutPage() {
  const lang = await getLang();
  const t = dict[lang];
  const [settings, skills] = await Promise.all([
    getSettings(),
    db.select("skills", "select=*&order=sort.asc,id.asc"),
  ]);

  const embed = youtubeEmbed(settings.video_url);
  const toLines = (v) => String(v || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const education = toLines(pick(settings, "education", lang));
  const interests = toLines(pick(settings, "interests", lang));

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow md:flex-row">
        {settings.photo_path && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicUrl(settings.photo_path)}
            alt={pick(settings, "about_title", lang) || "Profil"}
            className="h-52 w-44 shrink-0 rounded-2xl object-cover shadow"
          />
        )}
        <div>
          <h1 className="mb-4 text-3xl font-bold text-indigo-900">
            {pick(settings, "about_title", lang) || t.about}
          </h1>
          <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
            {pick(settings, "about_text", lang) || t.aboutEmpty}
          </div>
        </div>
      </section>

      {(education.length > 0 || interests.length > 0) && (
        <section className="grid gap-4 md:grid-cols-2">
          {education.length > 0 && (
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-3 text-xl font-bold text-indigo-900">{t.education}</h2>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                {education.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          {interests.length > 0 && (
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-3 text-xl font-bold text-indigo-900">{t.interests}</h2>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                {interests.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {skills.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-indigo-900">{t.skills}</h2>
          <div className="space-y-4">
            {skills.map((s) => (
              <div key={s.id}>
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>{s.name}</span>
                  <span>%{s.level}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{ width: `${Math.min(100, Math.max(0, s.level))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {embed && (
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-indigo-900">{t.video}</h2>
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={embed}
              title={t.video}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}
    </div>
  );
}
