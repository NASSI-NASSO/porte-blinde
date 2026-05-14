"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCartCount } from "@/lib/cartSlice";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "./Shell";

export default function Header({ onOpenCart }) {
  const count = useSelector(selectCartCount);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { dict, lang } = useI18n();
  const t = dict.navigation || {};

  useEffect(() => {
    fetch("/api/auth/check")
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.authenticated))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    router.push(`/${lang}`);
    router.refresh();
  };

  const switchLanguage = () => {
    const newLang = lang === "fr" ? "ar" : "fr";
    // Redirect to the same path but with the new language
    // We strip the current language prefix if it exists
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${lang}`} className="font-bold tracking-tight text-stone-900 text-xl">
          {t.brand || "Portes"} <span className="text-amber-700">{t.brand_highlight || "Blindées"}</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link href={`/${lang}`} className="hover:text-stone-900 transition-colors">
            {t.home || "Accueil"}
          </Link>
          <Link href={`/${lang}/produits`} className="hover:text-stone-900 transition-colors">
            {t.products || "Produits"}
          </Link>
          <Link href={`/${lang}/contact`} className="hover:text-stone-900 transition-colors">
            {t.contact || "Contact"}
          </Link>
          <div className="h-4 w-px bg-stone-300 mx-2 hidden sm:block"></div>
          
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:text-red-600 transition-colors hidden sm:block font-bold"
            >
              {t.logout || "Déconnexion"}
            </button>
          ) : (
            <>
              <Link href={`/${lang}/login`} className="hover:text-stone-900 transition-colors hidden sm:block">
                {t.login || "Connexion"}
              </Link>
              <Link href={`/${lang}/register`} className="hover:text-stone-900 transition-colors hidden sm:block">
                {t.register || "Inscription"}
              </Link>
            </>
          )}

          {/* Language Switcher */}
          <button 
            onClick={switchLanguage}
            className="font-bold px-2 py-1 bg-stone-100 rounded hover:bg-stone-200 transition-colors text-stone-700"
          >
            {lang === "fr" ? "العربية" : "Français"}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-stone-800 transition hover:bg-stone-100"
            aria-label="Ouvrir le panier"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {t.cart || "Panier"}
            {count > 0 && (
              <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
