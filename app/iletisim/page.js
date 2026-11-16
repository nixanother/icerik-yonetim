import { getSettings } from "@/lib/settings";
import { getLang, pick, dict } from "@/lib/i18n";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "İletişim" };

export default async function ContactPage() {
  const lang = await getLang();
  const t = dict[lang];
  const settings = await getSettings();

  const address = pick(settings, "address", lang);
  const mapQuery = settings.address || address;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-indigo-900">{t.contact}</h1>
      <p className="mb-8 text-gray-600">{t.contactIntro}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow">
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">{t.address}</dt>
                <dd className="font-medium">{address || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t.phone}</dt>
                <dd className="font-medium">{settings.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t.email}</dt>
                <dd className="font-medium">{settings.email || "-"}</dd>
              </div>
            </dl>
          </div>
          <ContactForm lang={lang} sentText={t.sent} />
        </div>

        <div className="min-h-80 overflow-hidden rounded-2xl bg-white shadow">
          {mapQuery ? (
            <iframe
              title="Google Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center p-6 text-gray-400">Google Map</div>
          )}
        </div>
      </div>
    </div>
  );
}
