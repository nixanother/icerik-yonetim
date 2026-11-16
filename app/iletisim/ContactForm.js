"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessage } from "./actions";

// Dil çerezi sunucuda okunduğu için metinler iki dilde de burada tutulur
const TEXT = {
  tr: { name: "Ad Soyad", email: "E-posta", message: "Mesaj", send: "Gönder", sending: "Gönderiliyor..." },
  en: { name: "Full name", email: "Email", message: "Message", send: "Send", sending: "Sending..." },
};

export default function ContactForm({ lang = "tr", sentText = "" }) {
  const [state, formAction, pending] = useActionState(sendMessage, null);
  const formRef = useRef(null);
  const t = TEXT[lang] || TEXT.tr;

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const input =
    "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-2xl bg-white p-6 shadow">
      {state?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {sentText || "OK"}
        </div>
      )}

      {/* Bot tuzağı: insanlar görmez */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div>
        <label className="mb-1 block text-sm font-medium">{t.name}</label>
        <input name="name" required maxLength={100} className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">{t.email}</label>
        <input name="email" type="email" required maxLength={150} className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">{t.message}</label>
        <textarea name="message" rows={5} required maxLength={3000} className={input} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
