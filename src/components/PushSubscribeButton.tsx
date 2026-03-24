"use client";

import { usePushSubscription } from "@/hooks/usePushSubscription";

interface Props {
  customerCardId: string;
  accentColor?: string;
}

export default function PushSubscribeButton({ customerCardId, accentColor = "#6366f1" }: Props) {
  const { subscribed, loading, supported, subscribe, unsubscribe } = usePushSubscription(customerCardId);

  if (!supported) return null;

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
      style={
        subscribed
          ? { background: "transparent", border: `2px solid ${accentColor}`, color: accentColor }
          : { background: accentColor, color: "#fff" }
      }
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : subscribed ? (
        <>🔕 Désactiver les notifications</>
      ) : (
        <>🔔 Activer les notifications</>
      )}
    </button>
  );
}
