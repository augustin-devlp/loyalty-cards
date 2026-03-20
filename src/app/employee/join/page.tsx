"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface InviteInfo {
  email: string;
  name: string;
  business_name: string;
}

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const supabase = createClient();
    supabase
      .rpc("get_invite_info", { p_token: token })
      .then(({ data, error: rpcError }) => {
        if (rpcError || !data || (data as InviteInfo[]).length === 0) {
          setError("Ce lien d'invitation est invalide ou déjà utilisé.");
        } else {
          setInfo((data as InviteInfo[])[0]);
        }
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: info.email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard/scan`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    // If session exists immediately (email confirmation disabled), auto-accept and redirect
    if (data.session) {
      await supabase.rpc("auto_accept_invite_by_email");
      router.push("/dashboard/scan");
      return;
    }

    setDone(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black">S</span>
          </div>
          <span className="font-black text-xl text-gray-900">Stampify</span>
        </div>

        {!token || (error && !info) ? (
          <div className="text-center space-y-3">
            <p className="text-2xl">⚠️</p>
            <p className="font-semibold text-gray-900">Lien invalide</p>
            <p className="text-sm text-gray-500">
              {error ?? "Ce lien d'invitation est invalide ou expiré."}
            </p>
          </div>
        ) : done ? (
          <div className="text-center space-y-3">
            <p className="text-4xl">✉️</p>
            <h2 className="text-xl font-bold text-gray-900">Vérifiez votre email</h2>
            <p className="text-sm text-gray-500">
              Un lien de confirmation a été envoyé à <strong>{info?.email}</strong>.
              Cliquez dessus pour activer votre compte et accéder au scanner.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Rejoindre l&apos;équipe</h1>
              {info && (
                <p className="text-gray-500 mt-1 text-sm">
                  Vous avez été invité(e) par <strong>{info.business_name}</strong>
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={info?.name ?? ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={info?.email ?? ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choisissez un mot de passe
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                {submitting ? "Création du compte…" : "Créer mon compte employé"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function EmployeeJoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}
