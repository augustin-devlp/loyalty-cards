"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";

interface AffiliateData {
  affiliate_code: string;
  referrals: number;
  earnings: number;
}

export default function AffiliationPage() {
  const router = useRouter();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const response = await fetch("/api/affiliates", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données d'affiliation");
      }

      const data = await response.json();
      setAffiliateData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = affiliateData
    ? `https://stampify.ch/signup?ref=${affiliateData.affiliate_code}`
    : "";

  const copyToClipboard = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Programme d'affiliation</h1>
          <p className="text-gray-500 mt-2">
            Parrainez des commerçants et gagnez des avantages
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Chargement des données...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchAffiliateData}
              className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Réessayer
            </button>
          </div>
        ) : affiliateData ? (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Parrainez un commerçant via votre lien unique. Dès qu'il s'inscrit et crée un
                abonnement, vous recevez{" "}
                <span className="font-bold text-indigo-600">1 mois gratuit</span> ajouté à votre compte.
              </p>
            </div>

            {/* Referral Link Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Votre lien de parrainage
              </h2>
              <div className="flex gap-3 items-stretch">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-mono text-sm focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copié
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copier
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Partagez ce lien avec d'autres commerçants
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Referrals Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Commerçants parrainés</p>
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{affiliateData.referrals}</p>
              </div>

              {/* Earnings Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Mois offerts gagnés</p>
                  <div className="bg-green-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{affiliateData.earnings}</p>
              </div>
            </div>

            {/* Code Display Card */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Code d'affiliation</h3>
              <p className="text-2xl font-bold font-mono text-indigo-600">
                {affiliateData.affiliate_code}
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
