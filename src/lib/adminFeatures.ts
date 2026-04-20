/**
 * Catalogue des features toggleables par business dans /admin.
 * Chaque feature a un slug (stocké dans businesses.enabled_features)
 * et correspond à une rubrique de la sidebar dashboard.
 */

export type FeatureCategory =
  | "Principal"
  | "Commandes"
  | "Fidélité"
  | "Marketing"
  | "Gestion";

export type FeatureDef = {
  slug: string;
  name: string;
  description: string;
  category: FeatureCategory;
  icon: string;
  /** Si true, requiert le plan Pro côté API (SMS par ex.). */
  requiresPro?: boolean;
};

export const FEATURES: FeatureDef[] = [
  { slug: "dashboard", name: "Tableau de bord", description: "Vue d'ensemble de l'activité", category: "Principal", icon: "🏠" },
  { slug: "cards", name: "Mes cartes", description: "Création et gestion des cartes de fidélité", category: "Principal", icon: "💳" },
  { slug: "scanner", name: "Scanner", description: "Scanner les QR codes clients en caisse", category: "Principal", icon: "📷" },
  { slug: "stats", name: "Statistiques", description: "Graphes et analytics du business", category: "Principal", icon: "📊" },

  { slug: "commandes", name: "Commandes", description: "Kanban commandes en direct (restaurant)", category: "Commandes", icon: "📦" },
  { slug: "commandes-menu", name: "Menu restaurant", description: "Édition des plats et prix", category: "Commandes", icon: "🍽️" },
  { slug: "commandes-livraison", name: "Zones livraison", description: "Configurer les codes postaux et frais", category: "Commandes", icon: "🚴" },
  { slug: "commandes-sms-templates", name: "Templates SMS resto", description: "Personnaliser les SMS transactionnels", category: "Commandes", icon: "💬" },

  { slug: "spin-wheel", name: "Roue de la chance", description: "Jeu de la roue gamifié", category: "Fidélité", icon: "🎰" },
  { slug: "lottery", name: "Loterie", description: "Tirages au sort récurrents", category: "Fidélité", icon: "🎁" },
  { slug: "reservations", name: "Réservations", description: "Prise de rendez-vous en ligne", category: "Fidélité", icon: "📅" },

  { slug: "sms", name: "SMS marketing", description: "Campagnes + automatisations Brevo", category: "Marketing", icon: "📱", requiresPro: true },
  { slug: "promotions", name: "Promotions", description: "Multiplicateurs temporaires de tampons", category: "Marketing", icon: "🎯" },
  { slug: "gift-cards", name: "Cartes cadeaux", description: "Vente et utilisation de gift cards", category: "Marketing", icon: "🎀" },
  { slug: "marketplace", name: "Marketplace", description: "Présence dans l'annuaire Stampify", category: "Marketing", icon: "🛒" },
  { slug: "click-collect", name: "Réservation produits", description: "Réservation de produits physiques (à retirer)", category: "Marketing", icon: "🛍️" },

  { slug: "team", name: "Équipe", description: "Inviter des scanners / employés", category: "Gestion", icon: "👥" },
  { slug: "establishments", name: "Établissements", description: "Plusieurs points de vente sur un même compte", category: "Gestion", icon: "🏢" },
  { slug: "billing", name: "Facturation", description: "Abonnement, factures, paiements", category: "Gestion", icon: "💳" },
  { slug: "appearance", name: "Apparence", description: "Couleurs et thème du dashboard", category: "Gestion", icon: "🎨" },
  { slug: "settings", name: "Paramètres", description: "Config Google Business et autres", category: "Gestion", icon: "⚙️" },
];

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  "Principal",
  "Commandes",
  "Fidélité",
  "Marketing",
  "Gestion",
];

export const FEATURE_PRESETS: Record<string, { label: string; features: string[] }> = {
  "restaurant-complet": {
    label: "Restaurant complet",
    features: [
      "dashboard", "commandes", "commandes-menu", "commandes-livraison",
      "commandes-sms-templates", "cards", "scanner", "stats",
      "spin-wheel", "lottery", "promotions", "gift-cards",
      "team", "billing", "appearance", "settings",
    ],
  },
  boulangerie: {
    label: "Boulangerie / café",
    features: [
      "dashboard", "cards", "scanner", "stats",
      "spin-wheel", "promotions", "gift-cards",
      "team", "billing", "appearance", "settings",
    ],
  },
  coiffeur: {
    label: "Coiffeur / salon",
    features: [
      "dashboard", "cards", "scanner", "stats",
      "reservations", "spin-wheel", "gift-cards",
      "team", "billing", "appearance", "settings",
    ],
  },
  minimal: {
    label: "Minimal (démo)",
    features: ["dashboard", "cards", "scanner", "settings"],
  },
};
