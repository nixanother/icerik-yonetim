"use client";

import { useActionState, useEffect, useRef } from "react";
import { addImage } from "./actions";

const inputClass =
  "min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";

export default function UploadForm() {
  const [state, formAction, pending] = useActionState(addImage, null);
  const formRef = useRef(null);

  // Yükleme başarılı olunca formu temizle
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mb-6 space-y-3 rounded-2xl bg-white p-5 shadow">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">Resim eklendi.</div>
      )}

      <div className="flex flex-wrap gap-3">
        <input name="title" placeholder="Açıklama (Türkçe)" className={inputClass} />
        <input name="title_en" placeholder="Caption (English)" className={inputClass} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          name="image"
          type="file"
          accept="image/*"
          required
          className="rounded-lg border border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Yükleniyor..." : "Yükle"}
        </button>
      </div>
      <p className="text-xs text-gray-400">En fazla 4 MB, JPG/PNG/WebP gibi resim dosyaları.</p>
    </form>
  );
}
