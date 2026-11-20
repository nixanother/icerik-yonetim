import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { isAdmin } from "@/lib/auth";
import { getLang, pick, dict } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { setLang } from "@/lib/lang-actions";
import { logout } from "./giris/actions";
import Motion from "@/components/Motion";
import { LogoLink, LogoMark, SakirFlight, SakirPerch } from "@/components/Fun";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
});

export const metadata = {
  title: { default: "Zeynep Hüma Esen", template: "%s | Zeynep Hüma Esen" },
  description: "Kişisel web sitem: projelerim, yazılarım ve galerim. Kendi yazdığım içerik yönetim paneliyle yönetiliyor.",
};

// Animasyonlu öğeler ilk boyamada gizli başlasın; JS hiç çalışmazsa 4 sn sonra görünür olur
const bootScript = `(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!/^\\/(admin|giris)/.test(location.pathname)){var d=document.documentElement;d.classList.add('anim');setTimeout(function(){d.classList.remove('anim')},4000)}}catch(e){}})();`;

async function safeSettings() {
  try {
    return await getSettings();
  } catch {
    return {};
  }
}

export default async function RootLayout({ children }) {
  const [admin, lang, settings] = await Promise.all([isAdmin(), getLang(), safeSettings()]);
  const t = dict[lang];
  const owner = pick(settings, "about_title", lang) || t.siteName;

  const links = [
    { href: "/hakkinda", label: t.about },
    { href: "/projeler", label: t.projects },
    { href: "/galeri", label: t.gallery },
    { href: "/makaleler", label: t.articles },
    { href: "/iletisim", label: t.contact },
  ];

  const langSwitch = (
    <form action={setLang} className="flex rounded-full border border-line p-0.5 text-xs font-semibold">
      {["tr", "en"].map((code) => (
        <button
          key={code}
          type="submit"
          name="lang"
          value={code}
          aria-pressed={lang === code}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            lang === code ? "bg-ink text-paper" : "text-slate hover:text-ink"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </form>
  );

  const adminLinks = admin ? (
    <>
      <Link href="/admin" className="link-line">
        {t.panel}
      </Link>
      <form action={logout}>
        <button type="submit" className="link-line text-slate hover:text-ink">
          {t.logout}
        </button>
      </form>
    </>
  ) : (
    <Link href="/giris" className="text-slate hover:text-ink">
      {t.login}
    </Link>
  );

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${display.variable} ${serif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#icerik"
          className="sr-only z-50 rounded-full bg-cobalt px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t.skip}
        </a>

        <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
            <LogoLink className="flex items-center gap-2.5 text-[1.05rem] font-bold tracking-tight">
              <LogoMark />
              {owner}
            </LogoLink>

            <div className="hidden items-center gap-6 text-[0.95rem] md:flex">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="link-line">
                  {l.label}
                </Link>
              ))}
              {langSwitch}
              <span className="flex items-center gap-4 text-sm">{adminLinks}</span>
            </div>

            <details className="group relative md:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-line px-4 py-1.5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">{t.menu}</span>
                <span className="hidden group-open:inline">{t.close}</span>
              </summary>
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-line bg-paper-2 p-5">
                <ul className="space-y-3 text-lg font-semibold">
                  <li>
                    <Link href="/">{t.home}</Link>
                  </li>
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
                  {langSwitch}
                  <span className="flex flex-col items-end gap-1">{adminLinks}</span>
                </div>
              </div>
            </details>
          </nav>
        </header>

        <main id="icerik" className="w-full flex-1">
          {children}
        </main>

        <footer className="relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-cobalt text-white">
          <span aria-hidden="true" className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-pink" />
          <span aria-hidden="true" className="absolute -bottom-20 left-[30%] h-44 w-44 rounded-full bg-amber/90" />
          <span aria-hidden="true" className="absolute top-10 left-[55%] h-10 w-10 rounded-full border-[6px] border-mint" />
          <div className="relative mx-auto max-w-6xl px-5 py-16">
            <p className="display max-w-3xl text-[clamp(2.2rem,6vw,4.5rem)]">{t.footerLine}</p>
            <div className="mt-8 flex items-end gap-5">
              <Link
                href="/iletisim"
                className="wiggle inline-flex items-center rounded-full border-2 border-ink bg-amber px-7 py-3 font-bold text-ink shadow-[4px_4px_0_var(--ink)]"
              >
                {t.writeMe}
              </Link>
              <SakirPerch
                className="w-20 md:w-24"
                say={lang === "en" ? "tweet tweet!" : "cik cik!"}
                label={lang === "en" ? "Şakir, my budgie (click me)" : "Şakir, muhabbet kuşum (tıkla)"}
              />
            </div>
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-sm text-white/80">
              <span>
                © 2026 {owner}
              </span>
              <span>{t.builtWith}</span>
            </div>
          </div>
        </footer>

        <Motion />
        <SakirFlight say={lang === "en" ? "tweet tweet!" : "cik cik!"} />
      </body>
    </html>
  );
}
