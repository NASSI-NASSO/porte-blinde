"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  setQuantity,
} from "@/lib/cartSlice";

function formatPrice(n) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm"
        aria-label="Fermer le panier"
        onClick={onClose}
      />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
          <h2 id="cart-title" className="text-lg font-semibold text-stone-900">
            Panier
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-stone-500 py-12">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-stone-100 bg-stone-50/80 p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-200">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900 line-clamp-2">{item.name}</p>
                    <p className="text-sm text-amber-800 font-semibold">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-stone-200 bg-white text-lg leading-none hover:bg-stone-100"
                        onClick={() =>
                          dispatch(setQuantity({ id: item.id, quantity: item.quantity - 1 }))
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-stone-200 bg-white text-lg leading-none hover:bg-stone-100"
                        onClick={() =>
                          dispatch(setQuantity({ id: item.id, quantity: item.quantity + 1 }))
                        }
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-red-600 hover:underline"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-200 p-4 space-y-3">
            <div className="flex justify-between text-stone-900">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold text-amber-800">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="w-full rounded-lg border border-stone-300 py-2 text-sm text-stone-700 hover:bg-stone-50"
            >
              Vider le panier
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
