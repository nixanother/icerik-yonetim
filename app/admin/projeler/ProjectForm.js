"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { saveProject } from "./actions";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

// project verilirse düzenleme formu, verilmezse yeni proje formu olur
export default function ProjectForm({ project, imageUrl }) {
  const [state, formAction, pending] = useActionState(saveProject, null);
  const formRef = useRef(null);
  const editing = Boolean(project);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mb-6 space-y-4 rounded-2xl bg-white p-5 shadow">
      {editing && <input type="hidden" name="id" value={project.id} />}
      {editing && <input type="hidden" name="old_path" value={project.image_path || ""} />}

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">Proje eklendi.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Proje adı (Türkçe)">
          <input name="title" required defaultValue={project?.title ?? ""} className={inputClass} />
        </Field>
        <Field label="Project name (English)">
          <input name="title_en" defaultValue={project?.title_en ?? ""} className={inputClass} />
        </Field>
        <Field label="Açıklama (Türkçe)">
          <textarea name="description" rows={5} defaultValue={project?.description ?? ""} className={inputClass} />
        </Field>
        <Field label="Description (English)">
          <textarea name="description_en" rows={5} defaultValue={project?.description_en ?? ""} className={inputClass} />
        </Field>
        <Field label="Bağlantı (isteğe bağlı)">
          <input name="link" placeholder="https://..." defaultValue={project?.link ?? ""} className={inputClass} />
        </Field>
        <Field label={editing ? "Yeni görsel (değiştirmek istersen)" : "Görsel"}>
          <input name="image" type="file" accept="image/*" className={inputClass} />
        </Field>
      </div>

      {editing && imageUrl && (
        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Mevcut görsel" className="h-24 rounded-lg border object-contain" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="remove_image" /> Mevcut görseli kaldır
          </label>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : editing ? "Kaydet" : "Proje Ekle"}
        </button>
        {editing && (
          <Link href="/admin/projeler" className="rounded-lg bg-gray-100 px-5 py-2 hover:bg-gray-200">
            Vazgeç
          </Link>
        )}
      </div>
    </form>
  );
}
