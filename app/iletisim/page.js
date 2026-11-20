import { getSettings } from "@/lib/settings";
import { getLang, pick, dict } from "@/lib/i18n";
import { Chars } from "@/components/Split";
import { fun } from "@/lib/fun";
import Shapes, { Squiggle } from "@/components/Shapes";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "İletişim" };

export default async function ContactPage() {
  const lang = await getLang();
  const t = dict[lang];
  const settings = await getSettings();

  const address = pick(settings, "address", lang);
  const mapQuery = settings.address || address;
  const phone = settings.phone || "";
  const email = settings.email || "";

  const info = [
    { label: t.address, value: address },
    { label: t.phone, value: phone, href: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null },
    { label: t.email, value: email, href: email ? `mailto:${email}` : null },
  ];

  return (
    <div className="relative isolate mx-auto max-w-6xl px-5 pt-12 md:pt-20">
      <Shapes set="page" />
      <h1 className="display text-[clamp(3.2rem,10vw,8rem)]">
        <Chars text={t.reachMe} />
      </h1>
      <Squiggle color="var(--pink)" className="mt-3" />
      <p data-reveal className="mt-5 max-w-xl font-serif text-xl text-slate">
        {t.contactIntro}
      </p>

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <dl className="space-y-8 md:col-span-5">
          {info.map((row, i) => (
            <div
              key={row.label}
              data-reveal
              className={`rounded-[1.5rem] border-2 border-ink p-5 shadow-[5px_5px_0_var(--ink)] ${fun(i).soft}`}
            >
              <dt className="text-sm font-bold" style={{ color: fun(i).hex }}>
                {row.label}
              </dt>
              <dd className="mt-1 text-2xl leading-snug font-semibold tracking-tight">
                {row.value ? (
                  row.href ? (
                    <a href={row.href} className="link-line">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )
                ) : (
                  "-"
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="md:col-span-7">
          <h2 data-reveal className="mb-6 text-2xl font-bold tracking-tight">
            {t.sendMessage}
          </h2>
          <div data-reveal className="rounded-[1.75rem] border-2 border-ink bg-paper-2 p-6 shadow-[7px_7px_0_var(--ink)] md:p-8">
            <ContactForm lang={lang} sentText={t.sent} />
          </div>
        </div>
      </div>

      <section data-reveal className="mt-20">
        <div className="relative h-[24rem] overflow-hidden rounded-[1.75rem] border-2 border-ink bg-paper-2 shadow-[7px_7px_0_var(--ink)] md:h-[30rem]">
          {mapQuery ? (
            <iframe
              title="Google Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="h-full w-full grayscale-[35%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-slate">Google Map</div>
          )}
        </div>
        {mapQuery && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line mt-4 inline-block font-semibold text-cobalt"
          >
            {t.openMap}
          </a>
        )}
      </section>
    </div>
  );
}
