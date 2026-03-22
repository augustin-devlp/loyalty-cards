import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black">S</span>
          </div>
          <span className="font-black text-2xl text-gray-900">Stampify</span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Votre demande a bien été reçue !
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Augustin vous contactera sous <strong>24h</strong> pour finaliser
            votre inscription et vous envoyer votre code d&apos;activation par
            SMS ou WhatsApp.
          </p>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-left space-y-3 mb-6">
            <p className="text-sm font-semibold text-indigo-900">
              Pour toute question :
            </p>
            <a
              href="mailto:augustin-domenget@stampify.ch"
              className="flex items-center gap-2 text-indigo-700 text-sm hover:underline"
            >
              <span>✉️</span> augustin-domenget@stampify.ch
            </a>
            <a
              href="https://wa.me/33676549599"
              className="flex items-center gap-2 text-indigo-700 text-sm hover:underline"
            >
              <span>💬</span> WhatsApp : +33 6 76 54 95 99
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Une fois votre code reçu, activez votre compte sur{" "}
            <Link
              href="/activate"
              className="text-indigo-600 font-semibold hover:underline"
            >
              stampify.ch/activate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
