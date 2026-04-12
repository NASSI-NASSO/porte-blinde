"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCartCount } from "@/lib/cartSlice";

export default function Header({ onOpenCart }) {
  const count = useSelector(selectCartCount);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-stone-900">
          Portes <span className="text-amber-700">Pliantes</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Accueil
          </Link>
          <Link href="/produits" className="hover:text-stone-900 transition-colors">
            Produits
          </Link>
          <Link href="/contact" className="hover:text-stone-900 transition-colors">
            Contact
          </Link>
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
            Panier
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
