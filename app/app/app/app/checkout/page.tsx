"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { formatHTG, waLink, WA_SALES } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    const orderNumber = `JME-${Date.now()}`;

    try {
      // 1. Créer la commande
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || null,
          total_amount: total,
          payment_method: "payoneer",
          payment_status: "pending",
          order_status: "pending",
          shipping_address: form.address,
          notes: form.notes || null,
        })
        .select()
        .single();

      if (orderError || !order) throw orderError;

      // 2. Créer les articles de la commande
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.qty,
        unit_price: item.price,
        subtotal: item.price * item.qty,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Construire le message WhatsApp récapitulatif
      const lines = items
        .map((i) => `- ${i.name} x${i.qty} — ${formatHTG(i.price * i.qty)}`)
        .join("\n");
      const message = `Nouvelle commande ${orderNumber}\n\nClient: ${form.name}\nTéléphone: ${form.phone}\nAdresse: ${form.address}\n\n${lines}\n\nTotal: ${formatHTG(total)}\n\nPaiement prévu via Payoneer.`;

      clearCart();
      window.location.href = waLink(WA_SALES, message);
    } catch (err) {
      console.error(err);
      setError(
        "Une erreur est survenue. Vérifie ta connexion et réessaie, ou contacte-nous directement via WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="font-display font-black uppercase text-2xl mb-3">
          Ton panier est vide
        </h1>
        <p className="opacity-70 mb-6">Ajoute des produits avant de passer commande.</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-full border-2 border-ink bg-ink text-paper font-bold uppercase text-sm"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-display font-black uppercase text-3xl mb-2">Finaliser la commande</h1>
      <p className="opacity-70 mb-8 text-sm">
        Confirme tes infos — on te redirige vers WhatsApp avec le récapitulatif, puis on
        t'envoie les infos de paiement Payoneer.
      </p>

      <div className="bg-white border-2 border-ink rounded-2xl p-5 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm py-1.5">
            <span>{item.name} × {item.qty}</span>
            <span className="font-bold">{formatHTG(item.price * item.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between font-extrabold pt-3 mt-2 border-t border-ink/20">
          <span>Total</span>
          <span>{formatHTG(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Nom complet"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-3 bg-transparent"
        />
        <input
          required
          placeholder="Numéro WhatsApp"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-3 bg-transparent"
        />
        <input
          type="email"
          placeholder="Email (optionnel)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-3 bg-transparent"
        />
        <textarea
          required
          placeholder="Adresse de livraison"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-3 bg-transparent"
          rows={2}
        />
        <textarea
          placeholder="Notes (optionnel)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="border-2 border-ink rounded-xl px-4 py-3 bg-transparent"
          rows={2}
        />

        {error && <p className="text-coral text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-full border-2 border-ink bg-ink text-paper font-bold uppercase text-sm disabled:opacity-50"
        >
          {submitting ? "Envoi en cours…" : "Confirmer et envoyer sur WhatsApp"}
        </button>
      </form>
    </div>
  );
          }
