import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A', padding: '60px 24px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '48px', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Stampify<span style={{ color: '#1d9e75' }}>.</span>
          </div>
          <p style={{ maxWidth: '240px', lineHeight: 1.6 }}>L&apos;artisan du digital suisse. Sites vitrines et fidélité digitale pour les commerces locaux.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>Produit</div>
            <Link href="/v3" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Accueil</Link>
            <Link href="/v3/demos" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Démos</Link>
            <Link href="/v3/subscribe" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Tarif</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>Légal</div>
            <Link href="/mentions-legales" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Mentions légales</Link>
            <Link href="/politique-de-confidentialite" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Confidentialité</Link>
            <Link href="/conditions-utilisation" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>CGV</Link>
          </div>
        </div>
      </div>
      
      <div style={{ maxWidth: '900px', margin: '48px auto 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>© 2026 Stampify. Tous droits réservés.</div>
        <div>Fait en Suisse avec ❤️</div>
      </div>
    </footer>
  )
}
