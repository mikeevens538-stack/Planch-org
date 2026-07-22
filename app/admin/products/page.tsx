"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { formatHTG } from "@/lib/whatsapp";

const CATEGORIES = ["Vêtements", "Chaussures", "Accessoires", "Parfums"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0],
    price: "",
    description: "",
    image_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("products").insert({
      name: form.name,
      category: form.category,
      price: Number(form.price),
      description: form.description || null,
      image_url: form.image_url || null,
      active: true,
    });
    setForm({ name: "", category: CATEGORIES[0], price: "", description: "", image_url: "" });
    setSaving(false);
    loadProducts();
  }

  async function toggleActive(product: Product) {
    await supabase.from("products").update({ active: !product.active }).eq("id", product.id);
    loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  return (
    <div>
      <h1 className="font-display font-black uppercase text-3xl mb-8">Produits</h1>

      <form
        onSubmit={handleSubmit}
        className="border-2 border-ink rounded-2xl p-5 bg-white mb-10 grid md:grid-cols-2 gap-3"
      >
        <input
          required
          placeholder="Nom du produit"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-2.5"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-2.5"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          required
          type="number"
          placeholder="Prix (HTG)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-2.5"
        />
        <input
          placeholder="URL image (optionnel)"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-2.5"
        />
        <textarea
          placeholder="Description (optionnel)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-2.5 md:col-span-2"
          rows={2}
        />
        <button
          type="submit"
          disabled={saving}
          className="md:col-span-2 py-3 rounded-full bg-ink text-paper font-bold uppercase text-sm disabled:opacity-50"
        >
          {saving ? "Ajout…" : "Ajouter le produit"}
        </button>
      </form>

      {loading ? (
        <p className="opacity-60 text-sm">Chargement…</p>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="border-2 border-ink rounded-xl p-4 bg-white flex justify-between items-center flex-wrap gap-3"
            >
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-xs opacity-60">{p.category} — {formatHTG(p.price)}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(p)}
                  className="text-xs font-bold uppercase border-2 border-ink rounded-full px-3 py-1.5"
                >
                  {p.active ? "Désactiver" : "Activer"}
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-xs font-bold uppercase border-2 border-coral text-coral rounded-full px-3 py-1.5"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
          }
