"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "@/lib/cartSlice";
import { useI18n } from "./Shell";

function formatPrice(n, lang, currency = "MAD") {
  const locale = lang === "ar" ? "ar-MA" : "fr-MA";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function getSafeImage(src) {
  if (!src) return '/placeholder.jpg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }
  const filename = src.split(/[\\/]/).pop();
  return filename ? `/${filename}` : '/placeholder.jpg';
}

export default function ProductCard({ product, t: propT }) {
  const dispatch = useDispatch();
  const context = useI18n();
  const lang = context?.lang || "fr";
  const t = propT || context?.dict?.produits || {};

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="border-b border-stone-100 bg-gradient-to-br from-amber-50 to-stone-50 px-4 py-3 text-center">
        <p className="text-2xl font-bold tracking-tight text-amber-900" dir="ltr">
          {formatPrice(product.price, lang, product.currency)}
        </p>
      </div>
      <div className="relative aspect-[4/3] w-full bg-stone-100">
        <Image
          src={getSafeImage(product.image)}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 text-start">
        <h3 className="font-semibold text-stone-900">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-stone-600 line-clamp-2">{product.description}</p>
        <button
          type="button"
          onClick={() =>
            dispatch(
              addToCartAsync({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            )
          }
          className="mt-4 w-full rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          {t.add_to_cart || "Ajouter au panier"}
        </button>
      </div>
    </article>
  );
}
