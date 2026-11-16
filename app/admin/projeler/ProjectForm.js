"use client";

import { useActionState, useEffect, useRef } from "react";
import { addProject } from "./actions";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";

export default function ProjectForm() {
  const [state, formAction, pending] = useActionState(addProject, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mb-6 space-y-3 rounded-2xl bg-white p-5 shadow">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">Proje eklendi.</div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <input name="title" required placeholder="Proje adı (Türkçe)" className={inputClass} />
        <input name="title_en" placeholder="Project name (English)" className={inputClass} />
        <textarea name="description" rows={3} placeholder="Kısa açıklama (Türkçe)" className={inputClass} />
        <textarea name="description_en" rows={3} placeholder="Short description (English)" className={inputClass} />
        <input name="link" placeholder="Bağlantı (isteğe bağlı) https://..." className={inputClass} />
        <input name="image" type="file" accept="image/*" className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Ekleniyor..." : "Proje Ekle"}
      </button>
    </form>
  );
}
