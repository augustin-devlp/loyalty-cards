import Link from 'next/link';

function StampLogoWhite() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="6"  cy="6"  r="4" fill="#ffffff" />
        <circle cx="16" cy="6"  r="4" fill="#ffffff" />
        <circle cx="26" cy="6"  r="4" fill="#ffffff" />
        <circle cx="6"  cy="16" r="4" fill="#ffffff" />
        <circle cx="16" cy="16" r="4" fill="#ffffff" />
        <circle cx="26" cy="16" r="4" fill="#ffffff" />
        <circle cx="6"  cy="26" r="4" fill="#ffffff" />
        <circle cx="16" cy="26" r="4" fill="#ffffff" />
        <circle cx="26" cy="26" r="4" fill="#ffffff" />
      </svg>
      <span
        className="text-xl font-bold tracking-tight text-white"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
      >
        Stampify
      </span>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Instagram">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="LinkedIn">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Footer() {
  const linkClass = "block py-1 text-sm transition-colors duration-200 hover:text-white";
  const linkStyle = { color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" };

  return (
    <footer style={{ background: '#0f1a15' }} className="pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        {/* Top section: logo + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand column — takes 2 lg cols */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <StampLogoWhite />
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}
            >
              La fidélité, digitale et locale.
            </p>
            <p
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}
            >
              Site web + carte fidélité sur smartphone.<br />
              990 CHF, zéro abonnement.
            </p>
          </div>

          {/* Column 1: Navigation */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wide"
              style={{ color: '#1d9e75', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Navigation
            </h4>
            <ul className="flex flex-col gap-0.5">
              {[
                { label: 'Accueil', href: '#' },
                { label: 'Offre', href: '#pricing' },
                { label: 'Démos', href: '#demos' },
                { label: 'Contact', href: 'mailto:contact@stampify.ch' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass} style={linkStyle}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wide"
              style={{ color: '#1d9e75', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Contact
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="mailto:contact@stampify.ch"
                  className="block py-1 text-sm transition-colors duration-200 hover:text-white"
                  style={linkStyle}
                >
                  contact@stampify.ch
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com/stampify.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-1 text-sm transition-colors duration-200 hover:text-white"
                  style={linkStyle}
                >
                  <InstagramIcon />
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com/company/stampify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-1 text-sm transition-colors duration-200 hover:text-white"
                  style={linkStyle}
                >
                  <LinkedInIcon />
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Zones + Légal */}
          <div className="flex flex-col gap-8">
            <div>
              <h4
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
                style={{ color: '#1d9e75', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Zones
              </h4>
              <ul className="flex flex-col gap-0.5">
                {['Genève', 'Lausanne', 'Fribourg', 'Nyon', 'Annecy'].map((city) => (
                  <li key={city}>
                    <span className={linkClass} style={linkStyle}>{city}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
                style={{ color: '#1d9e75', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Légal
              </h4>
              <ul className="flex flex-col gap-0.5">
                {[
                  { label: 'CGV', href: '/conditions-utilisation' },
                  { label: 'Politique confidentialité', href: '/politique-de-confidentialite' },
                  { label: 'Mentions légales', href: '/mentions-legales' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={linkClass} style={linkStyle}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-xs text-center sm:text-left"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}
          >
            © 2025 Stampify · Fait en Suisse 🇨🇭
          </p>
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Inter', sans-serif" }}
          >
            Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
