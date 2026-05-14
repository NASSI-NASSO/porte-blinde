"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Header from "./Header";
import CartDrawer from "./CartDrawer";
import WhatsAppButton from "./WhatsAppButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, loadLocalCart, selectCartItems } from "@/lib/cartSlice";

export const I18nContext = createContext({
  dict: {},
  lang: "fr"
});

export const useI18n = () => useContext(I18nContext);

export default function Shell({ children, dict, lang }) {
  const [cartOpen, setCartOpen] = useState(false);
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  
  useEffect(() => {
    dispatch(loadLocalCart());
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <I18nContext.Provider value={{ dict, lang }}>
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WhatsAppButton />
    </I18nContext.Provider>
  );
}
