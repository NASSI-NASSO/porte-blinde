"use client";

import { useState } from "react";
import { useI18n } from "./Shell";

export default function ContactForm({ t: propT }) {
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Use prop if provided (from Server Component), fallback to context
  const context = useI18n();
  const t = propT || context?.dict?.contact || {};

  function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setSent(true);
      setIsSending(false);
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-stone-700">
          {t.name_label || "Nom complet"}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t.name_placeholder || "Jean Dupont"}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
          {t.email_label || "Email"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t.email_placeholder || "jean@example.com"}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-stone-700">
          {t.phone_label || "Téléphone"}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder={t.phone_placeholder || "06 00 00 00 00"}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2 text-start"
          dir="ltr"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-stone-700">
          {t.message_label || "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2"
          placeholder={t.message_placeholder || "Décrivez votre projet ou votre question..."}
        />
      </div>
      <button
        type="submit"
        disabled={isSending || sent}
        className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
      >
        {isSending ? (t.sending || "Envoi en cours...") : (t.submit_btn || "Envoyer")}
      </button>
      {sent && (
        <p className="text-center text-sm font-medium text-green-700" role="status">
          {t.success || "Message envoyé avec succès."}
        </p>
      )}
    </form>
  );
}
