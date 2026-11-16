"use client";

import Link from "next/link";
import { useActionState } from "react";
import { savePost } from "./actions";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {hint && <span className="text-gray-400">- {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export default function PostForm({ post }) {
  const [state, formAction, pending] = useActionState(savePost, null);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow">
      {post && <input type="hidden" name="id" value={post.id} />}

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Başlık (Türkçe)">
          <input name="title" required defaultValue={post?.title ?? ""} className={inputClass} />
        </Field>
        <Field label="Title (English)">
          <input name="title_en" defaultValue={post?.title_en ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Adres (slug)" hint="boş bırakırsan başlıktan üretilir">
        <input name="slug" defaultValue={post?.slug ?? ""} className={inputClass} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Kategori (Türkçe)" hint="örn. Videografi">
          <input name="category" defaultValue={post?.category ?? ""} className={inputClass} />
        </Field>
        <Field label="Category (English)" hint="e.g. Videography">
          <input name="category_en" defaultValue={post?.category_en ?? ""} className={inputClass} />
        </Field>
        <Field label="Etiketler (Türkçe)" hint="virgülle ayır: adobe, premiere, video kurgu">
          <input name="tags" defaultValue={post?.tags ?? ""} className={inputClass} />
        </Field>
        <Field label="Tags (English)" hint="comma separated: adobe, premiere, video editing">
          <input name="tags_en" defaultValue={post?.tags_en ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="İçerik (Türkçe)">
        <textarea name="content" rows={10} defaultValue={post?.content ?? ""} className={inputClass} />
      </Field>
      <Field label="Content (English)" hint="Google Translate ile çevirip yapıştırabilirsin">
        <textarea name="content_en" rows={10} defaultValue={post?.content_en ?? ""} className={inputClass} />
      </Field>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} />
        <span>Yayında (sitede görünsün)</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <Link href="/admin/yazilar" className="rounded-lg bg-gray-100 px-5 py-2 hover:bg-gray-200">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
