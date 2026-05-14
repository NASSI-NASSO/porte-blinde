"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./Shell";

export default function LoginForm({ t: propT }) {
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
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

      // Redirect to home or dashboard after successful login
      router.push(`/${lang}`);
      router.refresh(); // Refresh to update header state if needed
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
          autoComplete="current-password"
          dir="ltr"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2 text-start"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-600 py-3 font-semibold text-white transition hover:bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
      >
        {loading ? (t.login_loading || "Connexion en cours...") : (t.login_btn || "Se connecter")}
      </button>
      <p className="text-center text-sm text-stone-600">
        {t.no_account || "Pas encore de compte ?"} {" "}
        <Link href={`/${lang}/register`} className="font-semibold text-stone-900 hover:text-amber-700">
          {t.create_one || "S'inscrire"}
        </Link>
      </p>
    </form>
  );
}
