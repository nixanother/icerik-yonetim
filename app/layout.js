import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { isAdmin } from "@/lib/auth";
import { getLang, dict } from "@/lib/i18n";
import { setLang } from "@/lib/lang-actions";
import { logout } from "./giris/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "İçerik Yönetim Sistemi",
  description: "Kendi yazdığım içerik yönetim paneli, makaleler, galeri, projeler ve kişisel ajanda.",
};

export default async function RootLayout({ children }) {
  const admin = await isAdmin();
  const lang = await getLang();
  const t = dict[lang];

  const links = [
    { href: "/", label: t.home },
    { href: "/hakkinda", label: t.about },
    { href: "/projeler", label: t.projects },
    { href: "/galeri", label: t.gallery },
    { href: "/makaleler", label: t.articles },
    { href: "/iletisim", label: t.contact },
  ];

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <Link href="/" className="text-lg font-bold">
              📝 {t.siteName}
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="hover:underline">
                  {l.label}
                </Link>
              ))}

              <form action={setLang} className="flex overflow-hidden rounded-lg bg-white/20 text-xs font-semibold">
                <button
                  type="submit"
                  name="lang"
                  value="tr"
                  className={`px-2 py-1 ${lang === "tr" ? "bg-white text-indigo-700" : "hover:bg-white/30"}`}
                >
                  TR
                </button>
                <button
                  type="submit"
                  name="lang"
                  value="en"
                  className={`px-2 py-1 ${lang === "en" ? "bg-white text-indigo-700" : "hover:bg-white/30"}`}
                >
                  EN
                </button>
              </form>

              {admin ? (
                <>
                  <Link href="/admin" className="hover:underline">
                    {t.panel}
                  </Link>
                  <form action={logout}>
                    <button type="submit" className="rounded-lg bg-white/20 px-3 py-1 hover:bg-white/30">
                      {t.logout}
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/giris" className="rounded-lg bg-white/20 px-3 py-1 hover:bg-white/30">
                  {t.login}
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

        <footer className="py-6 text-center text-sm text-gray-500">© 2026 {t.siteName}</footer>
      </body>
    </html>
  );
}
