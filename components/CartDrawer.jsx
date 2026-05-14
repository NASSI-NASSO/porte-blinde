"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  placeOrder,
  fetchCart,
  removeFromCartAsync,
  updateQuantityAsync,
  selectCartItems,
  selectCartTotal,
} from "@/lib/cartSlice";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./Shell";

function formatPrice(n) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { loading, error, orderSuccess } = useSelector((state) => state.cart);

  const [isCheckout, setIsCheckout] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (open) {
      fetch("/api/auth/check")
        .then(res => res.json())
        .then(data => setHasToken(data.authenticated))
        .catch(() => setHasToken(false));
    }
  }, [open]);

  // Reset checkout step when closing drawer
  useEffect(() => {
    if (!open) {
      setTimeout(() => setIsCheckout(false), 300);
    }
  }, [open]);

  const { lang, dict } = useI18n();

  const t = dict.cart || {};
  const tCheckout = dict.checkout || {
    title: "Finaliser la commande",
    phone_label: "Numéro de téléphone",
    address_label: "Adresse de livraison / installation",
    recap: "Récapitulatif",
    items: "Articles",
    total: "Total",
    confirm_btn: "Confirmer la commande",
    processing: "Traitement..."
  };

  const handleGoToCheckout = () => {
    if (!hasToken) {
      router.push(`/${lang}/login`);
      onClose();
      return;
    }
    setIsCheckout(true);
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    console.log("Placing order with:", { phone, address });
    dispatch(placeOrder({ phone, address }));
  };

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
          <div className="flex items-center gap-3">
            {isCheckout && !orderSuccess && (
              <button onClick={() => setIsCheckout(false)} className="text-stone-500 hover:text-stone-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <h2 id="cart-title" className="text-lg font-semibold text-stone-900">
              {isCheckout && !orderSuccess ? tCheckout.title : (t.title || "Panier")}
            </h2>
          </div>
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

        <div className="flex-1 overflow-y-auto p-4 text-start">
          {orderSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{t.success_title || "Commande réussie !"}</h3>
              <p className="mt-2 text-stone-600">
                {t.success_msg || "Votre commande a été enregistrée."} #{String(orderSuccess || "").slice(0, 8)}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-lg bg-stone-900 px-6 py-2 text-white hover:bg-stone-800"
              >
                {t.continue_btn || "Continuer mes achats"}
              </button>
            </div>
          ) : loading && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
              <p className="mt-4 text-stone-500">{t.loading || "Chargement..."}</p>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-stone-500 py-12">{t.empty || "Votre panier est vide."}</p>
          ) : isCheckout ? (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
               <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-stone-700">
                    {tCheckout.phone_label}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 00 00 00 00"
                    dir="ltr"
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2 text-start"
                  />
               </div>
               <div>
                  <label htmlFor="address" className="mb-1 block text-sm font-medium text-stone-700">
                    {tCheckout.address_label}
                  </label>
                  <textarea
                    id="address"
                    required
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rue, Ville..."
                    className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 outline-none ring-amber-600/20 focus:border-amber-600 focus:ring-2"
                  />
               </div>
               <div className="rounded-xl bg-stone-50 p-4 mt-6">
                 <h4 className="font-semibold text-stone-900 mb-2">{tCheckout.recap}</h4>
                 <div className="flex justify-between text-sm text-stone-600">
                   <span>{tCheckout.items} ({items.length})</span>
                   <span dir="ltr">{formatPrice(total)}</span>
                 </div>
                 <div className="flex justify-between font-bold text-stone-900 mt-2 pt-2 border-t border-stone-200">
                   <span>{tCheckout.total}</span>
                   <span dir="ltr">{formatPrice(total)}</span>
                 </div>
               </div>
            </form>
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
                    <p className="text-sm text-amber-800 font-semibold" dir="ltr">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2" dir="ltr">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-stone-200 bg-white text-lg leading-none hover:bg-stone-100"
                        onClick={() =>
                          dispatch(updateQuantityAsync({ id: item.id, quantity: item.quantity - 1 }))
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-stone-200 bg-white text-lg leading-none hover:bg-stone-100"
                        onClick={() =>
                          dispatch(updateQuantityAsync({ id: item.id, quantity: item.quantity + 1 }))
                        }
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-red-600 hover:underline"
                        onClick={() => dispatch(removeFromCartAsync(item.id))}
                      >
                        {t.remove || "Retirer"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && !orderSuccess && (
          <div className="border-t border-stone-200 p-4 space-y-3">
            {!isCheckout && (
              <div className="flex justify-between text-stone-900">
                <span className="font-medium">{tCheckout.total}</span>
                <span className="text-lg font-bold text-amber-800" dir="ltr">{formatPrice(total)}</span>
              </div>
            )}

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            {isCheckout ? (
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full rounded-lg bg-amber-600 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-amber-700 disabled:opacity-70"
              >
                {loading ? tCheckout.processing : tCheckout.confirm_btn}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoToCheckout}
                disabled={loading}
                className="w-full rounded-lg bg-stone-900 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-stone-800 disabled:opacity-70"
              >
                {t.checkout_btn || "Passer la commande"}
              </button>
            )}

            {!isCheckout && (
              <button
                type="button"
                onClick={() => dispatch(clearCart())}
                disabled={loading}
                className="w-full rounded-lg border border-stone-300 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
              >
                {t.clear_btn || "Vider le panier"}
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
