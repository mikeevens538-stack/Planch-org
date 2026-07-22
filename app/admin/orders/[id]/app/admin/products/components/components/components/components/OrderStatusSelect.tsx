"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "processing", label: "En préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  async function updateStatus(value: string) {
    setCurrent(value);
    setSaving(true);
    await supabase
      .from("orders")
      .update({ order_status: value, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    setSaving(false);
  }

  return (
    <select
      value={current}
      onChange={(e) => updateStatus(e.target.value)}
      disabled={saving}
      className="border-2 border-ink rounded-lg px-2 py-1.5 text-xs font-bold uppercase bg-white"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
