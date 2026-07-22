"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper border-b-[3px] border-ink">
        <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border-2 border-ink flex items-center justify-center text-[0.55rem] font-extrabold leading-tight text-center animate-[spin_14s_linear_infinite]">
              J.M.E<br />STUDIO
            </div>
            <span className="font-display font-black uppercase tracking-tight text-lg">
              J.M.E STUDIO
            </span>
          </Link>

          <div
            className={`md:flex md:gap-8 text-sm font-bold uppercase tracking-wide ${
              menuOpen
                ? "flex flex-col absolute top-full left-0 right-0 bg-paper p-6 gap-5 border-b-[3px] border-ink"
                : "hidden"
            }`}
          >
            <a href="/#univers" className="hover:text-cobalt">Univers</a>
            <a href="/#collection" className="hover:text-cobalt">Collection</a>
            <a href="/#contact" className="hover:text-cobalt">Contact</a>
            <Link href="/admin/login" className="hover:text-cobalt opacity-60">Admin</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Voir le panier"
              className="relative w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center"
            >
              🛍️
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[0.65rem] font-bold rounded-full w-[19px] h-[19px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button
              className="md:hidden flex flex-col gap-1.5 w-6"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="h-0.5 bg-ink" />
              <span className="h-0.5 bg-ink" />
              <span className="h-0.5 bg-ink" />
            </button>
          </div>
        </nav>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
