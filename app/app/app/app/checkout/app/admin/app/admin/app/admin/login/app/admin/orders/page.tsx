"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import { Order } from "@/types";
import { formatHTG } from "@/lib/whatsapp";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  async function markPaid(orderId: string) {
    await supabase.from("orders").update({ payment_status: "paid" }).eq("id", orderId);
    loadOrders();
  }

  const filtered = orders.filter((o) =>
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.order_number.toLowerCase().includes(search.toLowerCase())
  );

  const totalOrders = orders.length;
  const revenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pending = orders.filter((o) => o.order_status === "pending").length;
  const delivered = orders.filter((o) => o.order_status === "delivered").length;

  function exportCSV() {
    const csv = Papa.unparse(
      orders.map((o) => ({
        Numero: o.order_number,
        Client: o.customer_name,
        Telephone: o.customer_phone,
        Total: o.total_amount,
        Paiement: o.payment_status,
        Statut: o.order_status,
        Date: new Date(o.created_at).toLocaleDateString("fr-FR"),
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes-jme-${Date.now()}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="font-display font-black uppercase text-3xl">Commandes</h1>
        <button
          onClick={exportCSV}
          className="px-5 py-2.5 rounded-full border-2 border-ink text-sm font-bold uppercase hover:bg-ink hover:text-paper transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total commandes" value={totalOrders} />
        <StatCard label="Revenu (payé)" value={formatHTG(revenue)} />
        <StatCard label="En attente" value={pending} />
        <StatCard label="Livrées" value={delivered} />
      </div>

      <input
        placeholder="Rechercher un client ou un numéro de commande…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border-2 border-ink rounded-xl px-4 py-2.5 mb-6"
      />

      {loading ? (
        <p className="opacity-60 text-sm">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="opacity-60 text-sm">Aucune commande pour le moment.</p>
      ) : (
        <div className="overflow-x-auto border-2 border-ink rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="text-left p-3">N°</th>
                <th className="text-left p-3">Client</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Paiement</th>
                <th className="text-left p-3">Statut</th>
                <th className="text-left p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-ink/10">
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-bold hover:text-cobalt">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3 font-bold">{formatHTG(order.total_amount)}</td>
                  <td className="p-3">
                    {order.payment_status === "paid" ? (
                      <span className="text-emerald font-bold text-xs uppercase">Payé</span>
                    ) : (
                      <button
                        onClick={() => markPaid(order.id)}
                        className="text-xs font-bold uppercase border-2 border-ink rounded-full px-3 py-1 hover:bg-ink hover:text-paper"
                      >
                        Marquer payé
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    <OrderStatusSelect orderId={order.id} status={order.order_status} />
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs underline">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-2 border-ink rounded-2xl p-5 bg-white">
      <div className="text-xs uppercase opacity-60 font-bold mb-1">{label}</div>
      <div className="font-display font-black text-2xl">{value}</div>
    </div>
  );
                    }
