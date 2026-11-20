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
    "w-full rounded-xl border-2 border-ink/25 bg-paper px-4 py-3 text-lg transition-colors focus:border-cobalt focus:bg-white focus:outline-none";

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
          {sentText || "OK"}
        </div>
      )}

      {/* Bot tuzağı: insanlar görmez */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div>
        <label htmlFor="cf-name" className="mb-1.5 block text-sm font-semibold">{t.name}</label>
        <input id="cf-name" name="name" required maxLength={100} className={input} />
      </div>
      <div>
        <label htmlFor="cf-email" className="mb-1.5 block text-sm font-semibold">{t.email}</label>
        <input id="cf-email" name="email" type="email" required maxLength={150} className={input} />
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-semibold">{t.message}</label>
        <textarea id="cf-message" name="message" rows={5} required maxLength={3000} className={input} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="wiggle rounded-full border-2 border-ink bg-pink px-7 py-3 font-bold text-white shadow-[4px_4px_0_var(--ink)] disabled:opacity-60"
      >
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
