"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Identifiants incorrects.");
      return;
    }
    router.push("/admin/orders");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white border-2 border-ink rounded-2xl p-8"
      >
        <h1 className="font-display font-black uppercase text-2xl mb-1">Admin</h1>
        <p className="opacity-60 text-sm mb-6">J.M.E Studio — accès réservé</p>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-ink rounded-xl px-4 py-3 mb-3"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-ink rounded-xl px-4 py-3 mb-4"
        />

        {error && <p className="text-coral text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-ink text-paper font-bold uppercase text-sm disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-xs opacity-50 mt-5">
          Ton compte admin se crée dans Supabase &gt; Authentication &gt; Add user.
          Voir README.md.
        </p>
      </form>
    </div>
  );
          }
