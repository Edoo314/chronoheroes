'use client'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export default function AboutPage() {
  const router = useRouter()
  const locale = useLocale()
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
          <span onClick={() => router.push('/stats')} style={{ fontSize: 12, color: '#6b6a65', cursor: 'pointer', whiteSpace: 'nowrap', padding: '6px 10px', border: '0.5px solid #e8e6e0', borderRadius: 99 }}>Stats</span>
          <button onClick={() => router.push('/')} style={{ fontSize: 12, color: '#b8860b', background: '#faf6ea', border: 'none', borderRadius: 99, padding: '6px 12px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Mon Histoire
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'inline-block', fontSize: 12, letterSpacing: '.08em', color: '#b8860b', marginBottom: 20, padding: '5px 16px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
          Le projet
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1916', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>
          Comment ca marche
        </h1>

        <p style={{ fontSize: 16, color: '#6b6a65', lineHeight: 1.8, marginBottom: 48 }}>
          ChronoHeroes est une facon nouvelle et personnelle de decouvrir l'Histoire. Non pas comme une suite de dates et d'evenements abstraits, mais comme une serie de vies humaines qui ont toutes traverse l'age que vous avez aujourd'hui.
        </p>

        {[
          {
            t: "L'age comme mesure universelle",
            p: "On apprend l'Histoire par annees : 1789, 1945, 1969. Ces chiffres situent les evenements dans le temps, mais ils ne disent rien de l'humain qui les a vecus. Quel age avait-il ? Etait-il jeune, experimente, vieux ? ChronoHeroes repond a cette question en ramenant chaque evenement a l'echelle d'une vie humaine — la votre."
          },
          {
            t: "Le calcul au jour pres",
            p: "Chaque personnage de notre base possede sa date de naissance exacte. Chaque evenement historique est date precisement. On calcule l'age du personnage ce jour-la en nombre de jours, et on le compare au votre. L'ecart s'affiche sur chaque carte — parfois zero. Quand l'ecart est zero, c'est jour pour jour : vous avez aujourd'hui l'age exact auquel ce personnage a change le cours de l'Histoire."
          },
          {
            t: "Apprendre l'Histoire autrement",
            p: "Savoir que Napoleon avait 36 ans a Austerlitz, que Marie Curie avait 36 ans quand elle a recu son premier Nobel, que Martin Luther King avait 34 ans lors du discours I Have a Dream — ce n'est pas de l'anecdote. C'est une facon de se situer dans le temps, de comprendre que l'Histoire n'est pas un passe lointain mais une suite de destins humains qui ont tous connu votre age."
          },
          {
            t: "Se repositionner, pas se comparer",
            p: "L'objectif n'est pas de creer de l'anxiete. Personne n'attend de vous que vous marchiez sur la Lune ou gagniez Austerlitz. L'idee est contemplative : prendre conscience que l'Histoire est faite de vies humaines ordinaires qui, un jour, ont fait quelque chose d'extraordinaire — souvent a l'age que vous avez maintenant."
          },
          {
            t: "Ceux qui font vraiment l'Histoire sont anonymes",
            p: "Les grands noms de l'Histoire ne sont que la partie visible d'un iceberg. Derriere chaque evenement celebre, des millions de vies ordinaires ont ete traversees, bousculees, transformees. Chacun est le heros de sa propre histoire, avec ses propres evenements marquants, ses propres tournants, ses propres exploits silencieux. ChronoHeroes vous invite a regarder les grands destins avec les yeux de votre propre vie."
          },
          {
            t: "Une perspective personnelle",
            p: "Chaque utilisateur vit une experience unique. La meme base de donnees, les memes evenements — mais le miroir change chaque jour, et il est different pour chacun. C'est l'Histoire vue a travers votre prisme personnel, au jour le jour."
          },
        ].map((s, i, arr) => (
          <div key={i} style={{ paddingBottom: 36, borderBottom: i < arr.length - 1 ? '0.5px solid #e8e6e0' : 'none', marginBottom: 36 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 12 }}>{s.t}</div>
            <div style={{ fontSize: 15, color: '#6b6a65', lineHeight: 1.85 }}>{s.p}</div>
          </div>
        ))}

        <div style={{ background: '#f5f3ee', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '28px 32px', marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
            "Quand l'Histoire devient personnelle."
          </div>
          <div style={{ fontSize: 13, color: '#a8a79f', marginTop: 12 }}>Principe fondateur de ChronoHeroes</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => router.push('/')} style={{ padding: '13px 32px', background: '#1a1916', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Decouvrir mes heros du jour
          </button>
        </div>
      </div>

      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>ChronoHeroes</span>
        <span onClick={() => router.push('/stats')} style={{ cursor: 'pointer', color: '#6b6a65' }}>Statistiques</span>
        <span>2026 - <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
      </footer>
    </main>
  )
}
