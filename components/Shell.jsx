"use client";

import { useState } from "react";
import Header from "./Header";
import CartDrawer from "./CartDrawer";
import WhatsAppButton from "./WhatsAppButton";

export default function Shell({ children }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WhatsAppButton />
    </>
  );
}
