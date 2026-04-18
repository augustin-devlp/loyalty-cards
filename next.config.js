/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Ne JAMAIS cacher les pages /dashboard (sinon on sert du HTML perimé
  // au gérant après un nouveau déploiement — sidebar manquante, page
  // blanche, etc.) et pas les routes d'auth.
  buildExcludes: [/dashboard\/.*/],
  runtimeCaching: [
    {
      // /dashboard/* et /api/* : toujours réseau, pas de cache
      urlPattern: ({ url }) =>
        url.origin === self.location.origin &&
        (url.pathname.startsWith("/dashboard") ||
          url.pathname.startsWith("/api/")),
      handler: "NetworkOnly",
    },
    // Fallback : tout le reste reste en NetworkFirst (comportement par
    // défaut géré par next-pwa pour les autres routes).
  ],
});

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async headers() {
    return [
      // Static demo HTML files — pas de X-Frame-Options pour l'embedding
      {
        source: "/:file*.html",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      // Toutes les autres routes
      {
        source: "/((?!.*\\.html$).*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
