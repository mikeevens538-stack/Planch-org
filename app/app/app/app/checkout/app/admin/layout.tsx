"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
      if (!data.session && !isLoginPage) router.push("/admin/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s && !isLoginPage) router.push("/admin/login");
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  if (!checked) {
    return <div className="p-10 text-sm opacity-60">Vérification de la session…</div>;
  }

  if (!session) return null; // redirection en cours

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r-2 border-ink p-6 hidden md:flex flex-col gap-1">
        <div className="font-display font-black uppercase mb-6">J.M.E Admin</div>
        <Link href="/admin/orders" className="py-2 text-sm font-semibold hover:text-cobalt">
          Commandes
        </Link>
        <Link href="/admin/products" className="py-2 text-sm font-semibold hover:text-cobalt">
          Produits
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/admin/login");
          }}
          className="mt-auto py-2 text-sm font-semibold text-coral text-left"
        >
          Déconnexion
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
