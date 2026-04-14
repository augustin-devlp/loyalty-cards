import type { MetadataRoute } from "next";

const BASE = "https://www.stampify.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const demoPaths = [
    "/demo/cafe",
    "/demo/boulangerie",
    "/demo/restaurant",
    "/demo/barbershop",
    "/demo/manucure",
    "/demo/spa",
  ];

  const blogSlugs = [
    "carte-fidelite-digitale-boulangerie-suisse",
    "site-web-cafe-lausanne-geneve",
    "fideliser-clients-restaurant-suisse-romande",
    "remplacer-carte-fidelite-papier-digital",
    "site-web-salon-coiffure-suisse",
    "seo-local-commerce-suisse-romande",
    "plaquette-nfc-commerce-local",
    "campagne-sms-fidelisation-commercants",
    "combien-coute-site-web-commercant-suisse",
    "fidelisation-clients-cafe-coffee-shop",
  ];

  const staticPages = [
    { path: "/fonctionnalites", priority: 0.9 },
    { path: "/tarif", priority: 0.9 },
    { path: "/demos", priority: 0.85 },
  ];

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...staticPages.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.priority,
    })),
    ...demoPaths.map((p) => ({
      url: `${BASE}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
