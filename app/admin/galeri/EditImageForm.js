"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateImage } from "./actions";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";

export default function EditImageForm({ image, imageUrl }) {
  const [state, formAction, pending] = useActionState(updateImage, null);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-5 shadow">
      <input type="hidden" name="id" value={image.id} />
      <input type="hidden" name="old_path" value={image.image_path} />

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={image.title || "Galeri resmi"} className="max-h-72 rounded-xl border object-contain" />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Açıklama (Türkçe)</span>
          <input name="title" defaultValue={image.title ?? ""} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Caption (English)</span>
          <input name="title_en" defaultValue={image.title_en ?? ""} className={inputClass} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Resmi değiştir (isteğe bağlı)</span>
        <input name="image" type="file" accept="image/*" className={inputClass} />
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <Link href="/admin/galeri" className="rounded-lg bg-gray-100 px-5 py-2 hover:bg-gray-200">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
