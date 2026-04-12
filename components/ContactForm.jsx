"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-stone-700">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-stone-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2"
          placeholder="Dimensions souhaitées, ville, questions…"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white transition hover:bg-stone-800"
      >
        Envoyer
      </button>
      {sent && (
        <p className="text-center text-sm text-green-700" role="status">
          Merci — en production, branchez ce formulaire à votre API ou service e-mail.
        </p>
      )}
    </form>
  );
}
