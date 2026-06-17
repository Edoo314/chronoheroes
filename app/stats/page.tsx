'use client'
import { useRouter } from 'next/navigation'

const STATS = {
  categories: [
    { label: 'Arts et culture', nb: 954, color: '#72243E' },
    { label: 'Politique / Pouvoir', nb: 527, color: '#633806' },
    { label: 'Sciences', nb: 413, color: '#0C447C' },
    { label: 'Sport', nb: 276, color: '#27500A' },
    { label: 'Exploration', nb: 154, color: '#b8860b' },
    { label: 'Philosophie', nb: 69, color: '#3C3489' },
    { label: 'Guerre', nb: 63, color: '#8B0000' },
    { label: 'Spirituel', nb: 36, color: '#085041' },
  ],
  periodes: [
    { label: 'XXe siècle', nb: 146 },
    { label: 'Contemporain', nb: 96 },
    { label: 'XIXe siècle', nb: 75 },
    { label: 'XVIIe-XVIIIe', nb: 37 },
    { label: 'Renaissance', nb: 28 },
    { label: 'Antiquité', nb: 12 },
    { label: 'Moyen-Âge', nb: 7 },
  ],
  top10: [
    { name: 'Wolfgang Amadeus Mozart', nb: 18, cat: 'Musique' },
    { name: 'Napoléon Bonaparte', nb: 16, cat: 'Politique' },
    { name: 'Honoré de Balzac', nb: 13, cat: 'Littérature' },
    { name: 'Francisco de Goya', nb: 13, cat: 'Art' },
    { name: 'Winston Churchill', nb: 13, cat: 'Politique' },
    { name: 'Maximilien Robespierre', nb: 12, cat: 'Politique' },
    { name: 'Alexander Fleming', nb: 12, cat: 'Science' },
    { name: 'Louis Pasteur', nb: 12, cat: 'Science' },
    { name: 'Charles Darwin', nb: 12, cat: 'Science' },
    { name: 'Albert Einstein', nb: 11, cat: 'Science' },
  ],
  plusJeune: { name: 'Marie Stuart', age: '6 jours', desc: 'Devient reine d\'Écosse à la mort de son père' },
  plusAge: { name: 'Edgar Morin', age: '104 ans', desc: 'S\'éteint à Paris, figure tutélaire de la pensée complexe' },
  genre: { hommes: 336, femmes: 65 },
  tranches: [
    { label: '0-9 ans', nb: 17 },
    { label: '10-19 ans', nb: 211 },
    { label: '20-29 ans', nb: 658 },
    { label: '30-39 ans', nb: 581 },
    { label: '40-49 ans', nb: 419 },
    { label: '50-59 ans', nb: 250 },
    { label: '60-69 ans', nb: 165 },
    { label: '70-79 ans', nb: 114 },
    { label: '80-89 ans', nb: 70 },
    { label: '90+', nb: 25 },
  ],
}

const MAX_CAT = Math.max(...STATS.categories.map(c => c.nb))
const MAX_PER = Math.max(...STATS.periodes.map(p => p.nb))
const MAX_TR = Math.max(...STATS.tranches.map(t => t.nb))
const TOTAL_GENRE = STATS.genre.hommes + STATS.genre.femmes

export default function StatsPage() {
  const router = useRouter()
  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid #e8e6e0', background: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1916', letterSpacing: '-.3px' }}>ChronoHeroes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span onClick={() => router.push('/about')} style={{ fontSize: 12, color: '#6b6a65', cursor: 'pointer', whiteSpace: 'nowrap', padding: '6px 10px', border: '0.5px solid #e8e6e0', borderRadius: 99 }}>Comment ça marche</span>
          <button onClick={() => router.push('/')} style={{ fontSize: 12, color: '#b8860b', background: '#faf6ea', border: 'none', borderRadius: 99, padding: '6px 12px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Mon Histoire
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'inline-block', fontSize: 12, letterSpacing: '.08em', color: '#b8860b', marginBottom: 20, padding: '5px 16px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
          En chiffres
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1916', letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.15 }}>
          ChronoHeroes en chiffres
        </h1>

        <p style={{ fontSize: 15, color: '#6b6a65', lineHeight: 1.75, marginBottom: 40 }}>
          Une base construite événement par événement pour couvrir l'Histoire de l'Antiquité à nos jours.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 48 }}>
          {[
            { n: '2 500+', l: 'événements datés' },
            { n: '394', l: 'personnages historiques' },
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
            <div style={{ fontSize: 11, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8, fontWeight: 600 }}>Le plus âgé</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{STATS.plusAge.age}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 4 }}>{STATS.plusAge.name}</div>
            <div style={{ fontSize: 12, color: '#6b6a65', lineHeight: 1.5 }}>{STATS.plusAge.desc}</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>Hommes et femmes</h2>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, background: '#f5f3ee', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1916' }}>{STATS.genre.hommes}</div>
              <div style={{ fontSize: 12, color: '#6b6a65', marginTop: 4 }}>Hommes — {Math.round(STATS.genre.hommes / TOTAL_GENRE * 100)}%</div>
            </div>
            <div style={{ flex: 1, background: '#FBEAF0', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#72243E' }}>{STATS.genre.femmes}</div>
              <div style={{ fontSize: 12, color: '#72243E', marginTop: 4 }}>Femmes — {Math.round(STATS.genre.femmes / TOTAL_GENRE * 100)}%</div>
            </div>
          </div>
          <div style={{ background: '#f5f3ee', borderRadius: 99, height: 12, overflow: 'hidden', display: 'flex' }}>
            <div style={{ background: '#1a1916', height: '100%', width: Math.round(STATS.genre.hommes / TOTAL_GENRE * 100) + '%' }} />
            <div style={{ background: '#72243E', height: '100%', flex: 1 }} />
          </div>
          <div style={{ fontSize: 12, color: '#6b6a65', marginTop: 8, textAlign: 'center' }}>
            Objectif : atteindre 30% de femmes dans les prochaines versions
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>Âge des événements</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
            {STATS.tranches.map((t, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', background: '#b8860b', borderRadius: '4px 4px 0 0', height: Math.round(t.nb / MAX_TR * 100) + 'px', minHeight: 4 }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {STATS.tranches.map((t, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#a8a79f', lineHeight: 1.3 }}>{t.label}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#6b6a65', marginTop: 12, textAlign: 'center' }}>
            Pic d'événements entre 20 et 40 ans — l'âge où l'Histoire se fait
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>Par thème</h2>
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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>Par époque</h2>
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
              <div style={{ fontSize: 13, color: i === 0 ? '#b8860b' : '#6b6a65', fontWeight: i === 0 ? 700 : 400 }}>{p.nb} év.</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f5f3ee', borderRadius: 14, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 8 }}>La base grandit chaque semaine</div>
          <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 16, lineHeight: 1.7 }}>
            Vous ne trouvez pas votre personnage préféré ? Écrivez-nous.
          </div>
          <a href="mailto:hero@chronoheroes.com" style={{ display: 'inline-block', padding: '10px 24px', background: '#1a1916', color: '#ffffff', borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Suggérer un personnage
          </a>
        </div>
      </div>

      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>ChronoHeroes</span>
        <span onClick={() => router.push('/about')} style={{ cursor: 'pointer', color: '#6b6a65' }}>Comment ça marche</span>
        <span>2026 - <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
      </footer>
    </main>
  )
}