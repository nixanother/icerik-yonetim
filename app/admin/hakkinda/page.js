import { getSettings } from "@/lib/settings";
import AboutForm from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Hakkımda ve İletişim Bilgileri</h1>
      <AboutForm s={settings} />
    </div>
  );
}
