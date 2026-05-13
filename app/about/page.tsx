'use client'
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()
  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '0.5px solid #e8e6e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 19, fontWeight: 700, color: '#1a1916' }}>ChronoHeroes</span>
        </div>
        <button onClick={() => router.push('/')} style={{ fontSize: 12, color: '#6b6a65', background: 'transparent', border: '0.5px solid #e8e6e0', borderRadius: 99, padding: '6px 14px', cursor: 'pointer', fontFamily: 'sans-serif' }}>
          Retour
        </button>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px 80px' }}>

        <div style={{ display: 'inline-block', fontSize: 13, letterSpacing: '.06em', color: '#b8860b', marginBottom: 20, padding: '6px 18px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
          Le projet
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#1a1916', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>
          Comment ça marche
        </h1>

        <p style={{ fontSize: 17, color: '#6b6a65', lineHeight: 1.8, marginBottom: 56 }}>
          ChronoHeroes est une façon nouvelle et personnelle de découvrir l'Histoire. Non pas comme une suite de dates et d'événements abstraits, mais comme une série de vies humaines qui ont toutes traversé l'âge que vous avez aujourd'hui.
        </p>

        {[
          {
            t: "L'âge comme mesure universelle",
            p: "On apprend l'Histoire par années : 1789, 1945, 1969. Ces chiffres situent les événements dans le temps, mais ils ne disent rien de l'humain qui les a vécus. Quel âge avait-il ? Était-il jeune, expérimenté, vieux ? ChronoHeroes répond à cette question en ramenant chaque événement à l'échelle d'une vie humaine — la vôtre."
          },
          {
            t: "Le calcul au jour près",
            p: "Chaque personnage de notre base possède sa date de naissance exacte. Chaque événement historique est daté précisément. On calcule l'âge du personnage ce jour-là en nombre de jours, et on le compare au vôtre. L'écart s'affiche sur chaque carte — parfois zéro. Quand l'écart est zéro, c'est jour pour jour : vous avez aujourd'hui l'âge exact auquel ce personnage a changé le cours de l'Histoire."
          },
          {
            t: "Apprendre l'Histoire autrement",
            p: "Savoir que Napoléon avait 36 ans à Austerlitz, que Marie Curie avait 36 ans quand elle a reçu son premier Nobel, que Martin Luther King avait 34 ans lors du discours I Have a Dream — ce n'est pas de l'anecdote. C'est une façon de se situer dans le temps, de comprendre que l'Histoire n'est pas un passé lointain mais une suite de destins humains qui ont tous connu votre âge."
          },
          {
            t: "Se repositionner, pas se comparer",
            p: "L'objectif n'est pas de créer de l'anxiété. Personne n'attend de vous que vous marchiez sur la Lune ou gagniez Austerlitz. L'idée est contemplative : prendre conscience que l'Histoire est faite de vies humaines ordinaires qui, un jour, ont fait quelque chose d'extraordinaire — souvent à l'âge que vous avez maintenant."
          },
          {
            t: "Ceux qui font vraiment l'Histoire sont anonymes",
            p: "Les grands noms de l'Histoire ne sont que la partie visible d'un iceberg. Derrière chaque événement célèbre, des millions de vies ordinaires ont été traversées, bousculées, transformées. Chacun est le héros de sa propre histoire, avec ses propres événements marquants, ses propres tournants, ses propres exploits silencieux. ChronoHeroes vous invite à regarder les grands destins avec les yeux de votre propre vie."
          },
          {
            t: "Une perspective personnelle",
            p: "Chaque utilisateur vit une expérience unique. La même base de données, les mêmes événements — mais le miroir change chaque jour, et il est différent pour chacun. C'est l'Histoire vue à travers votre prisme personnel, au jour le jour."
          },
        ].map((s, i, arr) => (
          <div key={i} style={{ paddingBottom: 36, borderBottom: i < arr.length - 1 ? '0.5px solid #e8e6e0' : 'none', marginBottom: 36 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 12 }}>{s.t}</div>
            <div style={{ fontSize: 15, color: '#6b6a65', lineHeight: 1.85 }}>{s.p}</div>
          </div>
        ))}

        <div style={{ background: '#f5f3ee', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '28px 32px', marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#1a1916', marginBottom: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
            "L'Histoire n'est pas ce qui s'est passé.<br />C'est ce qui s'est passé à l'âge qu'on a."
          </div>
          <div style={{ fontSize: 13, color: '#a8a79f', marginTop: 12 }}>Principe fondateur de ChronoHeroes</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => router.push('/')} style={{ padding: '13px 32px', background: '#1a1916', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Découvrir mes héros du jour
          </button>
        </div>

      </div>

      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>ChronoHeroes</span>
        <span>© 2026 ChronoHeroes · <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
        <span onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>Accueil</span>
      </footer>
    </main>
  )
}
