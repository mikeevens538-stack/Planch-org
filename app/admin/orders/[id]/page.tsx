"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Order } from "@/types";
import { formatHTG, waLink, WA_SALES } from "@/lib/whatsapp";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadOrder() {
    const { data } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("id", id)
      .single();
    setOrder(data as Order);
    setLoading(false);
  }

  async function markPaid() {
    await supabase.from("orders").update({ payment_status: "paid" }).eq("id", id);
    loadOrder();
  }

  if (loading) return <p className="opacity-60 text-sm">Chargement…</p>;
  if (!order) return <p className="opacity-60 text-sm">Commande introuvable.</p>;

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.push("/admin/orders")} className="text-sm mb-6 opacity-70 hover:opacity-100">
        ← Retour aux commandes
      </button>

      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black uppercase text-3xl">{order.order_number}</h1>
          <p className="opacity-60 text-sm">
            {new Date(order.created_at).toLocaleString("fr-FR")}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.order_status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-ink rounded-2xl p-5 bg-white">
          <h3 className="font-bold text-xs uppercase opacity-60 mb-2">Client</h3>
          <p className="font-bold">{order.customer_name}</p>
          <p className="text-sm">{order.customer_phone}</p>
          {order.customer_email && <p className="text-sm">{order.customer_email}</p>}
          <a
            href={waLink(WA_SALES, `Bonjour ${order.customer_name}, concernant votre commande ${order.order_number}...`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-bold uppercase border-2 border-ink rounded-full px-3 py-1.5 hover:bg-ink hover:text-paper"
          >
            Contacter sur WhatsApp
          </a>
        </div>

        <div className="border-2 border-ink rounded-2xl p-5 bg-white">
          <h3 className="font-bold text-xs uppercase opacity-60 mb-2">Livraison</h3>
          <p className="text-sm">{order.shipping_address}</p>
          {order.notes && (
            <>
              <h3 className="font-bold text-xs uppercase opacity-60 mt-3 mb-1">Notes</h3>
              <p className="text-sm">{order.notes}</p>
            </>
          )}
        </div>
      </div>

      <div className="border-2 border-ink rounded-2xl p-5 bg-white mb-6">
        <h3 className="font-bold text-xs uppercase opacity-60 mb-3">Articles</h3>
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-ink/10">
            <span>{item.product_name} × {item.quantity}</span>
            <span className="font-bold">{formatHTG(item.subtotal)}</span>
          </div>
        ))}
        <div className="flex justify-between font-extrabold pt-3 mt-2">
          <span>Total</span>
          <span>{formatHTG(order.total_amount)}</span>
        </div>
      </div>

      <div className="border-2 border-ink rounded-2xl p-5 bg-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-xs uppercase opacity-60 mb-1">Paiement (Payoneer)</h3>
          <p className="text-sm">
            Statut :{" "}
            <span className={order.payment_status === "paid" ? "text-emerald font-bold" : "font-bold"}>
              {order.payment_status === "paid" ? "Payé" : "En attente"}
            </span>
          </p>
        </div>
        {order.payment_status !== "paid" && (
          <button
            onClick={markPaid}
            className="text-xs font-bold uppercase border-2 border-ink rounded-full px-4 py-2 hover:bg-ink hover:text-paper"
          >
            Marquer comme payé
          </button>
        )}
      </div>
    </div>
  );
}
