"use client";

import { useCart } from "@/context/CartContext";
import { formatHTG } from "@/lib/whatsapp";
import Link from "next/link";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, changeQty, removeItem, total } = useCart();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-ink/50 z-[90] transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[92vw] bg-paper z-[100] shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b-2 border-ink">
          <span className="font-display font-black uppercase">Ton Panier</span>
          <button onClick={onClose} aria-label="Fermer" className="text-2xl">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-center opacity-60 py-10 text-sm">
              Ton panier est vide pour le moment.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 py-3.5 border-b border-ink/10 items-center"
              >
                <div className="flex-1">
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs opacity-60">{formatHTG(item.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQty(item.productId, -1)}
                    className="w-6 h-6 rounded-full border-2 border-ink"
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => changeQty(item.productId, 1)}
                    className="w-6 h-6 rounded-full border-2 border-ink"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-coral text-xs ml-2"
                >
                  Retirer
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t-2 border-ink">
          <div className="flex justify-between font-extrabold text-lg mb-4">
            <span>Total</span>
            <span>{formatHTG(total)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={onClose}
            className={`block text-center w-full py-4 rounded-full font-bold uppercase text-sm border-2 border-ink transition-colors ${
              items.length === 0
                ? "opacity-40 pointer-events-none bg-transparent"
                : "bg-ink text-paper hover:bg-cobalt"
            }`}
          >
            Passer la commande
          </Link>
        </div>
      </div>
    </>
  );
}
