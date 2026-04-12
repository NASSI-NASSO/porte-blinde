"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/cartSlice";

function formatPrice(n, currency = "MAD") {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="border-b border-stone-100 bg-gradient-to-br from-amber-50 to-stone-50 px-4 py-3 text-center">
        <p className="text-2xl font-bold tracking-tight text-amber-900">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
      <div className="relative aspect-[4/3] w-full bg-stone-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-stone-900">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-stone-600 line-clamp-2">{product.description}</p>
        <button
          type="button"
          onClick={() =>
            dispatch(
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            )
          }
          className="mt-4 w-full rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
