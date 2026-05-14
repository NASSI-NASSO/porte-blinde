"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./Shell";

export default function RegisterForm({ t: propT }) {
  const router = useRouter();
  const context = useI18n();
  const lang = context?.lang || "fr";
  const t = propT || context?.dict?.auth || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        if (typeof data === "string") {
          throw new Error(
            "Erreur serveur. Verifiez DATABASE_URL/JWT_SECRET puis redemarrez le serveur."
          );
        }
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Automatically redirect to login page after successful registration
      router.push(`/${lang}/login?registered=true`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-start">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-stone-700">
          {t.name || "Nom complet"}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2 text-start"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
          {t.email || "E-mail"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2 text-start"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
          {t.password || "Mot de passe"}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          dir="ltr"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2 text-start"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (t.register_loading || "Création en cours...") : (t.register_btn || "Créer mon compte")}
      </button>
      <p className="text-center text-sm text-stone-600">
        {t.has_account || "Vous avez déjà un compte ?"} {" "}
        <Link href={`/${lang}/login`} className="font-semibold text-stone-900 hover:text-amber-700">
          {t.login_here || "Se connecter"}
        </Link>
      </p>
    </form>
  );
}
