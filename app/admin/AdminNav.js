"use client";

// Panelin yan menüsü: bulunduğun sayfa renkli vurgulanır.
// Mobilde yatay kaydırılan renkli düğmelere dönüşür.

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Genel Bakış", icon: "📊", color: "var(--cobalt)" },
  { href: "/admin/yazilar", label: "Makaleler", icon: "📝", color: "var(--sky)" },
  { href: "/admin/yazilar/yeni", label: "Yeni Makale", icon: "✏️", color: "var(--mint)" },
  { href: "/admin/projeler", label: "Projeler", icon: "🧩", color: "var(--orange)" },
  { href: "/admin/galeri", label: "Galeri", icon: "🖼️", color: "var(--pink)" },
  { href: "/admin/hakkinda", label: "Hakkımda", icon: "🙋‍♀️", color: "var(--amber)" },
  { href: "/admin/beceriler", label: "Yetenekler", icon: "⭐", color: "var(--mint)" },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: "💌", color: "var(--pink)" },
  { href: "/admin/ajanda", label: "Ajanda", icon: "📅", color: "var(--sky)" },
];

export default function AdminNav({ unread = 0 }) {
  const pathname = usePathname();
  const isActive = (href) =>
    href === "/admin" || href === "/admin/yazilar"
      ? pathname === href || (href === "/admin/yazilar" && /^\/admin\/yazilar\/\d+/.test(pathname))
      : pathname.startsWith(href);

  return (
    <nav aria-label="Yönetim menüsü" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 md:mx-0 md:flex-col md:overflow-visible md:p-0">
      {ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            style={{ "--c": item.color }}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl border-2 px-3 py-2 font-semibold whitespace-nowrap transition-all md:whitespace-normal ${
              active
                ? "border-ink bg-[var(--c)] text-ink shadow-[3px_3px_0_var(--ink)] md:translate-x-1"
                : "border-transparent hover:border-ink/20 hover:bg-[color-mix(in_srgb,var(--c)_18%,white)]"
            }`}
          >
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-paper-2 text-base">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            {item.href === "/admin/mesajlar" && unread > 0 && (
              <span className="rounded-full border-2 border-ink bg-pink px-2 py-0.5 text-xs font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
