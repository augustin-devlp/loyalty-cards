"use client";

import Toggle from "@/components/ui/Toggle";
import type { PushState } from "@/hooks/useDashboardPush";

type Props = {
  pushState: PushState;
  loading: boolean;
  onSubscribe: () => void | Promise<void>;
  onUnsubscribe: () => void | Promise<void>;
  /** Taille du toggle ("md" par défaut, "sm" pour les en-têtes compacts) */
  size?: "sm" | "md";
};

/**
 * Rend UN état Push à la fois. Jamais de "rond rouge barré" silencieux :
 * chaque état a un rendu explicite avec texte descriptif.
 */
export default function PushControl({
  pushState,
  loading,
  onSubscribe,
  onUnsubscribe,
  size = "md",
}: Props) {
  if (pushState === "unknown") {
    return <Toggle checked={false} onChange={() => {}} disabled size={size} />;
  }

  if (pushState === "unsupported") {
    return (
      <span
        title="Notifications push non supportées par ce navigateur (essayez Chrome, Firefox ou Edge)"
        className="text-[11px] font-medium text-gray-400"
      >
        Non supporté
      </span>
    );
  }

  if (pushState === "denied") {
    return (
      <button
        type="button"
        title="Débloquez les notifications dans les paramètres du site (icône cadenas dans la barre d'URL → Notifications)"
        className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100"
        onClick={() => onSubscribe()}
      >
        <span>🔕</span>
        <span>Bloquées — débloquer</span>
      </button>
    );
  }

  if (pushState === "default") {
    return (
      <div className="flex items-center gap-2">
        <Toggle
          checked={false}
          size={size}
          tooltip="Cliquez pour demander l'autorisation au navigateur"
          onChange={() => onSubscribe()}
        />
        <span className="text-[11px] font-semibold text-gray-500">
          Désactivé
        </span>
      </div>
    );
  }

  if (pushState === "granted-not-subscribed") {
    return (
      <div className="flex items-center gap-2">
        <Toggle
          checked={false}
          size={size}
          disabled={loading}
          tooltip="Autorisé — cliquez pour finaliser l'abonnement"
          onChange={() => onSubscribe()}
        />
        <span className="text-[11px] font-semibold text-amber-700">
          À activer
        </span>
      </div>
    );
  }

  // active
  return (
    <div className="flex items-center gap-2">
      <Toggle
        checked
        size={size}
        disabled={loading}
        tooltip="Cliquez pour désactiver"
        onChange={() => onUnsubscribe()}
      />
      <span className="text-[11px] font-semibold text-emerald-700">Activé</span>
    </div>
  );
}
