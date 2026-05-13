'use client'
import { useRouter } from 'next/navigation'

const STATS = {
  categories: [
    { label: 'Arts et culture', nb: 470, color: '#72243E' },
    { label: 'Politique', nb: 283, color: '#633806' },
    { label: 'Sciences', nb: 209, color: '#0C447C' },
    { label: 'Sport', nb: 207, color: '#27500A' },
    { label: 'Exploration', nb: 85, color: '#b8860b' },
    { label: 'Guerre', nb: 65, color: '#444441' },
    { label: 'Spirituel', nb: 33, color: '#085041' },
    { label: 'Philosophie', nb: 28, color: '#3C3489' },
  ],
  periodes: [
    { label: 'XXe siecle', nb: 96 },
    { label: 'Contemporain', nb: 86 },
    { label: 'XIXe siecle', nb: 65 },
    { label: 'XVIIe-XVIIIe', nb: 31 },
    { label: 'Renaissance', nb: 21 },
    { label: 'Antiquite', nb: 11 },
    { label: 'Moyen-Age', nb: 7 },
  ],
  top10: [
    { name: 'Wolfgang Amadeus Mozart', nb: 18, cat: 'Musique' },
    { name: 'Napoleon Bonaparte', nb: 16, cat: 'Politique' },
    { name: 'Bob Marley', nb: 10, cat: 'Musique' },
    { name: 'Albert Einstein', nb: 10, cat: 'Science' },
    { name: 'Charles Darwin', nb: 10, cat: 'Science' },
    { name: 'Vincent van Gogh', nb: 10, cat: 'Art' },
    { name: 'Frida Kahlo', nb: 9, cat: 'Art' },
    { name: 'Ludwig van Beethoven', nb: 9, cat: 'Musique' },
    { name: 'Nikola Tesla', nb: 9, cat: 'Science' },
    { name: 'Roger Federer', nb: 9, cat: 'Sport' },
  ],
  plusJeune: { name: 'Tiger Woods', age: '2 ans', desc: 'Joue au golf a la television — prodige annonce' },
  plusAge: { name: 'Katherine Johnson', age: '97 ans', desc: 'Recoit la Medaille presidentielle de la Liberte d\'Obama' },
}

const MAX_CAT = Math.max(...STATS.categories.map(c => c.nb))
const MAX_PER = Math.max(...STATS.periodes.map(p => p.nb))

export default function StatsPage() {
  const router = useRouter()
  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid #e8e6e0', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1916' }}>ChronoHeroes</span>
        </div>
        <button onClick={() => router.push('/')} style={{ fontSize: 12, color: '#6b6a65', background: 'transparent', border: '0.5px solid #e8e6e0', borderRadius: 99, padding: '6px 14px', cursor: 'pointer', fontFamily: 'sans-serif' }}>
          Retour
        </button>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'inline-block', fontSize: 12, letterSpacing: '.08em', color: '#b8860b', marginBottom: 20, padding: '5px 16px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
          En chiffres
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1916', letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.15 }}>
          ChronoHeroes en chiffres
        </h1>

        <p style={{ fontSize: 15, color: '#6b6a65', lineHeight: 1.75, marginBottom: 40 }}>
          Une base construite evenement par evenement pour couvrir l'Histoire de l'Antiquite a nos jours.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 48 }}>
          {[
            { n: '1 403', l: 'evenements dates au jour' },
            { n: '317', l: 'personnages historiques' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#f5f3ee', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#6b6a65' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 48 }}>
          <div style={{ background: '#f5f3ee', borderRadius: 12, padding: '20px 16px' }}>
            <div style={{ fontSize: 11, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8, fontWeight: 600 }}>Le plus jeune</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{STATS.plusJeune.age}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 4 }}>{STATS.plusJeune.name}</div>
            <div style={{ fontSize: 12, color: '#6b6a65', lineHeight: 1.5 }}>{STATS.plusJeune.desc}</div>
          </div>
          <div style={{ background: '#f5f3ee', borderRadius: 12, padding: '20px 16px' }}>
            <div style={{ fontSize: 11, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8, fontWeight: 600 }}>Le plus age</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{STATS.plusAge.age}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 4 }}>{STATS.plusAge.name}</div>
            <div style={{ fontSize: 12, color: '#6b6a65', lineHeight: 1.5 }}>{STATS.plusAge.desc}</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>Par theme</h2>
          {STATS.categories.map((c, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: '#1a1916', fontWeight: 500 }}>{c.label}</span>
                <span style={{ fontSize: 13, color: '#6b6a65' }}>{c.nb}</span>
              </div>
              <div style={{ background: '#f5f3ee', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ background: c.color, borderRadius: 99, height: '100%', width: Math.round(c.nb / MAX_CAT * 100) + '%' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>Par epoque</h2>
          {STATS.periodes.map((p, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: '#1a1916', fontWeight: 500 }}>{p.label}</span>
                <span style={{ fontSize: 13, color: '#6b6a65' }}>{p.nb}</span>
              </div>
              <div style={{ background: '#f5f3ee', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ background: '#b8860b', borderRadius: 99, height: '100%', width: Math.round(p.nb / MAX_PER * 100) + '%' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>Top 10 des personnages</h2>
          {STATS.top10.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '0.5px solid #e8e6e0' }}>
              <div style={{ fontSize: 13, color: i === 0 ? '#b8860b' : '#a8a79f', width: 20, textAlign: 'right', flexShrink: 0, fontWeight: i === 0 ? 700 : 400 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: i < 3 ? 600 : 400, color: '#1a1916' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#a8a79f' }}>{p.cat}</div>
              <div style={{ fontSize: 13, color: i === 0 ? '#b8860b' : '#6b6a65', fontWeight: i === 0 ? 700 : 400 }}>{p.nb} ev.</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f5f3ee', borderRadius: 14, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 8 }}>La base grandit chaque semaine</div>
          <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 16, lineHeight: 1.7 }}>
            Vous ne trouvez pas votre personnage prefere ? Ecrivez-nous.
          </div>
          <a href="mailto:hero@chronoheroes.com" style={{ display: 'inline-block', padding: '10px 24px', background: '#1a1916', color: '#ffffff', borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Suggerer un personnage
          </a>
        </div>
      </div>

      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>ChronoHeroes</span>
        <span onClick={() => router.push('/about')} style={{ cursor: 'pointer', color: '#6b6a65' }}>Comment ca marche</span>
        <span>2026 - <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
      </footer>
    </main>
  )
}
