import Link from "next/link";

export default function ConditionsUtilisation() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="font-black text-lg text-gray-900">Stampify</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Conditions d&apos;utilisation</h1>
        <p className="text-gray-500 text-sm mb-8">Dernière mise à jour : mars 2026</p>
        <div className="prose text-gray-600 text-sm leading-relaxed space-y-4">
          <p>Cette page sera complétée prochainement avec les conditions d&apos;utilisation de Stampify.</p>
        </div>
      </main>
    </div>
  );
}
