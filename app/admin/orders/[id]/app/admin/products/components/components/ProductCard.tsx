"use client";

import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatHTG, waLink, WA_SALES } from "@/lib/whatsapp";

const CATEGORY_COLOR: Record<string, string> = {
  Vêtements: "bg-cobalt",
  Chaussures: "bg-coral",
  Accessoires: "bg-emerald",
  Parfums: "bg-magenta",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const color = CATEGORY_COLOR[product.category] || "bg-cobalt";

  return (
    <div className="bg-white border-2 border-ink rounded-2xl overflow-hidden flex flex-col">
      <div className={`aspect-square relative flex items-center justify-center ${color}`}>
        <span className="absolute top-3 left-3 text-[0.62rem] font-extrabold uppercase tracking-wide bg-ink text-paper px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-4xl opacity-90">◆</span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="font-display font-extrabold text-base">{product.name}</span>
        <span className="font-bold mt-auto pt-2">{formatHTG(product.price)}</span>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              category: product.category,
            })
          }
          className="flex-1 py-3 text-xs font-extrabold uppercase tracking-wide bg-ink text-paper rounded-lg hover:bg-cobalt transition-colors"
        >
          Ajouter au panier
        </button>
        <a
          href={waLink(WA_SALES, `Bonjour, je suis interesse par : ${product.name}`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Commander directement"
          className="w-10 border-2 border-ink rounded-lg flex items-center justify-center"
        >
          💬
        </a>
      </div>
    </div>
  );
}
