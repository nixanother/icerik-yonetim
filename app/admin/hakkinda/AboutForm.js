"use client";

import { useActionState } from "react";
import { saveAbout } from "./actions";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";

function Field({ label, name, value, rows, hint }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {hint && <span className="text-gray-400">- {hint}</span>}
      </label>
      {rows ? (
        <textarea name={name} rows={rows} defaultValue={value ?? ""} className={inputClass} />
      ) : (
        <input name={name} defaultValue={value ?? ""} className={inputClass} />
      )}
    </div>
  );
}

export default function AboutForm({ s }) {
  const [state, formAction, pending] = useActionState(saveAbout, null);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">Kaydedildi.</div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Vesikalık fotoğraf</label>
        <input name="photo" type="file" accept="image/*" className="rounded-lg border border-gray-300 px-3 py-2" />
        <p className="mt-1 text-xs text-gray-400">Boş bırakırsan mevcut fotoğraf korunur (en fazla 4 MB).</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Anasayfa fotoğrafı</label>
        <input name="hero_photo" type="file" accept="image/*" className="rounded-lg border border-gray-300 px-3 py-2" />
        <p className="mt-1 text-xs text-gray-400">
          Anasayfanın en üstünde görünür. Boş bırakılırsa orada da vesikalık kullanılır (en fazla 4 MB).
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Özgeçmiş (CV) PDF</label>
        <input name="cv" type="file" accept="application/pdf" className="rounded-lg border border-gray-300 px-3 py-2" />
        <p className="mt-1 text-xs text-gray-400">
          Hakkımda sayfasında &quot;CV&apos;mi indir&quot; düğmesi çıkar. Boş bırakırsan mevcut CV korunur (en fazla 4 MB).
          {s.cv_path ? " Şu an yüklü bir CV var." : " Henüz CV yüklenmedi."}
        </p>
        {s.cv_path && (
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="remove_cv" /> CV&apos;yi kaldır
          </label>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Not: Tek seferde yüklenen dosyaların toplamı 4 MB&apos;ı geçmesin; gerekirse fotoğrafları ve CV&apos;yi ayrı ayrı kaydet.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Başlık / Ad Soyad (Türkçe)" name="about_title" value={s.about_title} />
        <Field label="Title / Name (English)" name="about_title_en" value={s.about_title_en} />
        <Field label="Anasayfa kısa tanıtım (Türkçe)" name="tagline" value={s.tagline} hint="isminin altında görünen tek cümle" />
        <Field label="Homepage tagline (English)" name="tagline_en" value={s.tagline_en} hint="one sentence under your name" />
        <Field label="Hakkımda / Özgeçmiş (Türkçe)" name="about_text" value={s.about_text} rows={8} />
        <Field label="About me / Resume (English)" name="about_text_en" value={s.about_text_en} rows={8} />
        <Field label="Eğitim (Türkçe)" name="education" value={s.education} rows={4} hint="her satıra bir madde" />
        <Field label="Education (English)" name="education_en" value={s.education_en} rows={4} hint="one item per line" />
        <Field label="İlgi alanları (Türkçe)" name="interests" value={s.interests} rows={4} hint="her satıra bir madde" />
        <Field label="Interests (English)" name="interests_en" value={s.interests_en} rows={4} hint="one item per line" />
      </div>

      <Field label="Tanıtım videosu YouTube linki" name="video_url" value={s.video_url} hint="https://www.youtube.com/watch?v=..." />

      <h2 className="pt-2 text-lg font-bold text-indigo-900">İletişim bilgileri</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Adres (Türkçe)" name="address" value={s.address} hint="haritada bu adres aranır" />
        <Field label="Address (English)" name="address_en" value={s.address_en} />
        <Field label="Telefon" name="phone" value={s.phone} />
        <Field label="E-posta" name="email" value={s.email} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
