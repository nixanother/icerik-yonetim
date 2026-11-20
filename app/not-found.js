import Link from "next/link";
import { getLang, dict } from "@/lib/i18n";
import Budgie from "@/components/Budgie";
import Shapes from "@/components/Shapes";

export const metadata = { title: "404" };

// Olmayan bir adrese gidilince görünen eğlenceli sayfa
export default async function NotFound() {
  const lang = await getLang();
  const t = dict[lang];

  return (
    <div className="relative isolate mx-auto flex min-h-[70svh] max-w-6xl flex-col items-center justify-center px-5 py-16 text-center">
      <Shapes set="hero" />

      <div className="display flex items-center justify-center gap-2 text-[clamp(7rem,26vw,16rem)] leading-none md:gap-6">
        <span className="lost-bounce inline-block text-pink">4</span>
        <span className="relative inline-block w-[0.9em]">
          <Budgie className="lost-bob w-full" />
          <span aria-hidden="true" className="lost-q absolute -top-[0.1em] -right-[0.15em] text-[0.3em] text-cobalt">
            ?
          </span>
          <span aria-hidden="true" className="lost-q lost-q2 absolute -top-[0.25em] right-[0.25em] text-[0.22em] text-orange">
            ?
          </span>
        </span>
        <span className="lost-bounce lost-delay inline-block text-mint">4</span>
      </div>

      <h1 className="display mt-6 text-[clamp(2.2rem,6vw,4rem)]">{t.lostTitle}</h1>
      <p className="mt-4 max-w-md font-serif text-xl text-slate">{t.lostText}</p>
      <Link
        href="/"
        className="wiggle mt-10 inline-flex rounded-full border-2 border-ink bg-amber px-7 py-3 font-bold text-ink shadow-[4px_4px_0_var(--ink)]"
      >
        {t.goHome}
      </Link>
    </div>
  );
}
