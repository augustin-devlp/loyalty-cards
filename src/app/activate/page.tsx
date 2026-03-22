"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ActivatePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      router.push("/dashboard?activated=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black">S</span>
          </div>
          <span className="font-black text-2xl text-gray-900">Stampify</span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Activer votre compte
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Entrez le code à 4 chiffres reçu par SMS ou WhatsApp.
          </p>

          <form onSubmit={handleActivate} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="0000"
              className="w-full text-center text-4xl font-black tracking-widest px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900"
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 4}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition-all"
            >
              {loading ? "Activation…" : "Activer mon compte →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore reçu votre code ?{" "}
            <a
              href="mailto:augustin-domenget@stampify.ch"
              className="text-indigo-600 font-medium hover:underline"
            >
              Contactez Augustin
            </a>
            {" · "}
            <Link href="/subscribe/confirmation" className="text-gray-400 hover:text-gray-600">
              Retour
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
