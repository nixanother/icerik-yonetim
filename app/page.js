import Link from "next/link";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage";
import { getSettings } from "@/lib/settings";
import { getLang, pick, dict, dateLocale } from "@/lib/i18n";
import { Chars, Words } from "@/components/Split";
import { plainText } from "@/components/Prose";
import PinScenes from "@/components/PinScenes";
import Budgie from "@/components/Budgie";
import Shapes, { Squiggle, Marquee } from "@/components/Shapes";
import { fun, tilt } from "@/lib/fun";

export const dynamic = "force-dynamic";

function cut(text, n) {
  const s = plainText(text);
  return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s;
}

export default async function Home() {
  const lang = await getLang();
  const t = dict[lang];

  const [posts, images, projects, settings] = await Promise.all([
    db.select("posts", "select=*&published=eq.true&order=created_at.desc"),
    db.select("gallery", "select=*&order=created_at.desc"),
    db.select("projects", "select=*&order=created_at.desc"),
    getSettings(),
  ]);

  const name = pick(settings, "about_title", lang) || t.siteName;
  const tagline = pick(settings, "tagline", lang) || t.heroText;
  const aboutText = plainText(pick(settings, "about_text", lang));
  const aboutShort = aboutText.length > 480 ? cut(aboutText, 480) : aboutText;
  const photo = settings.hero_photo_path || settings.photo_path;

  // Öne çıkan yazılar anasayfada önce gelir
  const latestPosts = [...posts].sort((a, b) => Number(b.featured === true) - Number(a.featured === true)).slice(0, 4);
  const galleryPicks = images.slice(0, 9);
  const columns = [0, 1, 2].map((c) => galleryPicks.filter((_, i) => i % 3 === c));

  // Kurgu timeline'ındaki klipler: her biri sayfadaki bir bölüme gider
  const clips = [
    {
      id: "hakkimda",
      label: t.clipAbout,
      title: name,
      text: cut(aboutText, 150) || tagline,
    },
    {
      id: "projeler",
      label: t.clipProjects,
      title: `${projects.length} ${t.projectCount}`,
      text: projects[0] ? `${t.latest}: ${pick(projects[0], "title", lang)}` : t.noProjects,
    },
    {
      id: "galeri",
      label: t.clipGallery,
      title: `${images.length} ${t.photoCount}`,
      text: t.galleryIntro,
    },
    {
      id: "yazilar",
      label: t.clipArticles,
      title: `${posts.length} ${t.postCount}`,
      text: posts[0] ? `${t.latest}: ${pick(posts[0], "title", lang)}` : t.noPosts,
    },
  ];

  // Sabitlenen sahneler PinScenes içinde kurulur ve sayfadan çıkarken güvenle geri alınır
  return (
    <PinScenes>
      {/* 1. Kurgu timeline'ı: sayfa sabitlenir, kaydırdıkça playhead ilerler */}
      <section
        data-hero
        data-duration="96"
        className="relative isolate mx-auto flex max-w-6xl flex-col justify-between gap-10 px-5 pt-10 pb-10 md:h-[calc(100svh-61px)] md:pt-14"
      >
        <Shapes set="hero" />
        <div className="grid items-start gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="display text-[clamp(3.4rem,10.5vw,9.5rem)]">
              <Chars text={name} />
            </h1>
            <p data-reveal className="mt-6 max-w-md font-serif text-xl leading-relaxed text-slate md:text-2xl">
              {tagline}
            </p>
          </div>
          {photo && (
            <div data-hero-visual className="order-first w-36 origin-top-right md:order-none md:w-60">
              <div className="rotate-3 rounded-[1.75rem] border-2 border-ink bg-amber p-2.5 shadow-[6px_6px_0_var(--ink)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(photo)}
                  alt={name}
                  className="aspect-[3/4] w-full rounded-[1.25rem] object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div data-reveal>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <span data-tc className="tc text-3xl font-bold tracking-tight md:text-4xl">
              00:00:00:00
            </span>
            <span className="text-sm text-slate">{t.scrollHint}</span>
          </div>

          <div className="relative mb-5 hidden h-24 md:block">
            {clips.map((c, i) => (
              <div
                key={c.id}
                data-cap
                aria-hidden={i === 0 ? "false" : "true"}
                className="absolute inset-0 max-w-2xl"
              >
                <p className="display text-3xl" style={{ color: fun(i).hex }}>
                  {c.title}
                </p>
                <p className="mt-2 text-slate">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="track relative rounded-2xl border-2 border-ink bg-paper-2 px-2 py-2.5 shadow-[5px_5px_0_var(--ink)]">
            <span aria-hidden="true" className="absolute -top-1.5 left-0 h-3 w-1.5 rounded-sm bg-amber" />
            <span aria-hidden="true" className="absolute right-0 -bottom-1.5 h-3 w-1.5 rounded-sm bg-amber" />
            <div className="grid grid-cols-4 gap-1">
              {clips.map((c, i) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  data-clip-i={i}
                  data-active={i === 0 ? "true" : "false"}
                  style={{ "--clip": fun(i).hex }}
                  className="clip flex h-12 items-center truncate rounded-xl border-2 px-3 text-sm font-bold"
                >
                  {c.label}
                </a>
              ))}
            </div>
            <span
              data-playhead
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 -bottom-4 left-0 w-1 rounded-full bg-ink"
            >
              <span className="absolute -top-2 -left-[8px] h-5 w-5 rounded-full border-[3px] border-ink bg-pink" />
              {/* Şakir playhead'in tepesine tünemiş, timeline boyunca onunla gider */}
              <Budgie className="lost-bob absolute bottom-[calc(100%+4px)] -left-[26px] w-14 md:w-16" />
            </span>
          </div>
        </div>
      </section>

      <div className="py-10 md:py-16">
        <Marquee words={t.marquee} />
      </div>

      {/* 2. Hakkımda özeti: kelimeler kaydırdıkça aydınlanır */}
      <section id="hakkimda" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 data-reveal className="display text-4xl">
              {t.aboutMe}
            </h2>
            <Squiggle color="var(--pink)" className="mt-2" />
            <Link href="/hakkinda" data-reveal className="link-line mt-4 inline-block font-semibold text-cobalt">
              {t.readMore}
            </Link>
          </div>
          <div className="md:col-span-8">
            {aboutShort ? (
              <Words
                text={aboutShort}
                className="font-serif text-[clamp(1.5rem,3vw,2.35rem)] leading-[1.35]"
              />
            ) : (
              <p className="text-slate">{t.aboutEmpty}</p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Projeler: masaüstünde yatay kayan şerit */}
      <section
        id="projeler"
        data-rail
        className="flex scroll-mt-20 flex-col justify-center overflow-hidden border-t border-line py-20 md:h-[100svh] md:py-0"
      >
        <div className="mx-auto mb-10 flex w-full max-w-6xl items-end justify-between gap-4 px-5">
          <div>
            <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">{t.selectedWork}</h2>
            <Squiggle color="var(--mint)" className="mt-1" />
          </div>
          <Link href="/projeler" className="link-line shrink-0 font-semibold text-cobalt">
            {t.all}
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="mx-auto w-full max-w-6xl px-5 text-slate">{t.noProjects}</p>
        ) : (
          <div
            data-rail-track
            className="flex flex-col gap-10 px-5 md:w-max md:flex-row md:gap-8 md:pr-[10vw] md:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]"
          >
            {projects.map((p, i) => (
              <article
                key={p.id}
                className={`tilt ${tilt(i)} rounded-[1.75rem] border-2 border-ink bg-paper-2 p-3 pb-6 shadow-[6px_6px_0_var(--ink)] md:w-[min(34rem,68vw)] md:shrink-0`}
              >
                <div className={`aspect-[16/10] overflow-hidden rounded-[1.25rem] ${fun(i).soft}`}>
                  {p.image_path && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={publicUrl(p.image_path)}
                      alt={pick(p, "title", lang)}
                      className="h-full w-full object-contain p-3"
                    />
                  )}
                </div>
                <h3 className="mt-5 px-2 text-2xl font-bold tracking-tight">{pick(p, "title", lang)}</h3>
                <p className="mt-2 line-clamp-3 max-w-prose px-2 text-slate">{pick(p, "description", lang)}</p>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`wiggle mx-2 mt-4 inline-flex rounded-full px-4 py-1.5 text-sm font-bold text-white ${fun(i).bg}`}
                  >
                    {t.visit}
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. Galeriden seçmeler: orta sütun farklı hızda kayar */}
      <section id="galeri" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:py-32">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 data-reveal className="display text-[clamp(2.6rem,6vw,5rem)]">
              {t.fromGallery}
            </h2>
            <Squiggle color="var(--orange)" className="mt-1" />
          </div>
          <Link href="/galeri" className="link-line shrink-0 font-semibold text-cobalt">
            {t.all}
          </Link>
        </div>
        {galleryPicks.length === 0 ? (
          <p className="text-slate">{t.noImages}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {columns.map((col, ci) => (
              <div
                key={ci}
                data-parallax={ci === 1 ? "0.08" : undefined}
                className={`flex flex-col gap-3 md:gap-5 ${ci === 1 ? "md:pt-16" : ""}`}
              >
                {col.map((img, k) => (
                  <figure
                    key={img.id}
                    className={`tilt ${tilt(ci + k * 3 + 1)} rounded-2xl border-2 border-ink bg-paper-2 p-2 pb-5 shadow-[4px_4px_0_var(--ink)]`}
                  >
                    <div data-clip className={`overflow-hidden rounded-xl ${fun(ci + k).soft}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicUrl(img.image_path)}
                        alt={pick(img, "title", lang) || t.gallery}
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Son yazılar: liste satırları */}
      <section id="yazilar" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 data-reveal className="display text-[clamp(2.6rem,6vw,5rem)]">
              {t.latestArticles}
            </h2>
            <Squiggle color="var(--sky)" className="mt-1" />
          </div>
          <Link href="/makaleler" className="link-line shrink-0 font-semibold text-cobalt">
            {t.all}
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-slate">{t.noPosts}</p>
        ) : (
          <ul className="space-y-4">
            {latestPosts.map((post, i) => (
              <li
                key={post.id}
                data-reveal
                className="rounded-[1.5rem] border-2 border-ink bg-paper-2 px-5 shadow-[5px_5px_0_var(--ink)] transition-transform hover:-translate-y-1 md:px-7"
              >
                <Link
                  href={`/yazi/${post.slug}`}
                  className="group grid gap-2 py-7 md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-8"
                >
                  <time className="tc text-sm text-slate" dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleDateString(dateLocale(lang))}
                  </time>
                  <span>
                    <span
                      className="block text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--hover)] md:text-3xl"
                      style={{ "--hover": fun(i).hex }}
                    >
                      {pick(post, "title", lang)}
                    </span>
                    <span className="mt-2 block max-w-2xl text-slate">{cut(pick(post, "content", lang), 140)}</span>
                    {post.featured === true && (
                      <span className="mt-3 inline-block rounded-full border-2 border-ink bg-amber px-3 py-0.5 text-xs font-bold">
                        ★ {t.featured}
                      </span>
                    )}
                  </span>
                  {pick(post, "category", lang) && (
                    <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${fun(i).soft}`}>
                      {pick(post, "category", lang)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PinScenes>
  );
}
