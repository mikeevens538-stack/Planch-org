"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { waLink, WA_SALES, WA_SUPPORT } from "@/lib/whatsapp";

const CATEGORIES = [
  { name: "Vêtements", color: "bg-cobalt", icon: "👔" },
  { name: "Chaussures", color: "bg-coral", icon: "👞" },
  { name: "Accessoires", color: "bg-emerald", icon: "⌚" },
  { name: "Parfums", color: "bg-magenta", icon: "🧴" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="absolute w-[420px] h-[420px] bg-cobalt rounded-full blur-[60px] opacity-50 -top-32 -right-24" />
        <div className="absolute w-[300px] h-[300px] bg-coral rounded-full blur-[60px] opacity-35 -bottom-20 -left-16" />
        <div className="relative max-w-[1200px] mx-auto px-6 grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-block text-xs tracking-widest uppercase font-bold border-2 border-ink rounded-full px-3.5 py-1.5 mb-4">
              J.M.E Studio — Cap-Haïtien
            </span>
            <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-[0.95] mb-6">
              Style<br />
              <span className="text-coral">sans</span>{" "}
              <span className="text-transparent" style={{ WebkitTextStroke: "2px #15130F" }}>
                filtre.
              </span>
            </h1>
            <p className="max-w-[460px] text-base mb-8">
              Vêtements, chaussures, accessoires et parfums pensés pour l'homme qui
              n'attend pas la tendance — il la crée.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-ink bg-ink text-paper font-bold text-sm uppercase hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#FF5C39] transition-all"
              >
                Voir la collection
              </a>
              <a
                href={waLink(WA_SALES, "Bonjour J.M.E Studio, je souhaite passer une commande.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-ink font-bold text-sm uppercase hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#2A3EE8] transition-all"
              >
                Commander via WhatsApp
              </a>
            </div>
          </div>
          <div className="aspect-square bg-ink rounded-3xl flex items-center justify-center text-6xl">
            🖤
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section id="univers" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-xl mb-14">
            <span className="inline-block text-xs tracking-widest uppercase font-bold border-2 border-ink rounded-full px-3.5 py-1.5 mb-4">
              Nos Univers
            </span>
            <h2 className="font-display font-black uppercase text-4xl">
              Quatre univers, un seul studio
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <div
                key={c.name}
                className={`${c.color} rounded-2xl p-8 min-h-[220px] flex flex-col justify-between text-white hover:-translate-y-1.5 transition-transform`}
              >
                <span className="text-3xl">{c.icon}</span>
                <h3 className="font-display font-bold text-xl mt-4">{c.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section id="collection" className="py-24 bg-paper2">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-xl mb-4">
            <span className="inline-block text-xs tracking-widest uppercase font-bold border-2 border-ink rounded-full px-3.5 py-1.5 mb-4">
              Sélection Studio
            </span>
            <h2 className="font-display font-black uppercase text-4xl">Pièces phares</h2>
          </div>
          {loading ? (
            <p className="opacity-60 text-sm">Chargement du catalogue…</p>
          ) : products.length === 0 ? (
            <p className="opacity-60 text-sm">
              Aucun produit pour le moment — ajoute ton catalogue depuis /admin/products.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t-[3px] border-ink py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10 text-sm">
            <div>
              <div className="font-display font-black uppercase mb-2">J.M.E STUDIO</div>
              <p className="opacity-70">Style sans filtre, pensé pour Cap-Haïtien et sa diaspora.</p>
            </div>
            <div>
              <h4 className="font-display font-bold uppercase text-xs tracking-wide mb-3">Contact</h4>
              <a
                href={waLink(WA_SALES, "Bonjour, j'ai une question sur vos produits.")}
                className="block opacity-70 hover:opacity-100 hover:text-cobalt"
              >
                WhatsApp Ventes
              </a>
              <a
                href={waLink(WA_SUPPORT, "Bonjour, j'ai besoin d'assistance.")}
                className="block opacity-70 hover:opacity-100 hover:text-cobalt"
              >
                WhatsApp Support
              </a>
            </div>
            <div>
              <h4 className="font-display font-bold uppercase text-xs tracking-wide mb-3">Suivre le studio</h4>
              <a
                href="https://www.tiktok.com/@venshub509"
                target="_blank"
                rel="noopener noreferrer"
                className="block opacity-70 hover:opacity-100 hover:text-cobalt"
              >
                TikTok — @venshub509
              </a>
            </div>
          </div>
          <div className="pt-5 border-t-2 border-ink text-xs opacity-60 flex justify-between flex-wrap gap-2">
            <span>© 2026 J.M.E Studio. Tous droits réservés.</span>
            <span>Cap-Haïtien, Haïti</span>
          </div>
        </div>
      </footer>
    </>
  );
          }
