'use client'
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()
  return (
    <main style={{ minHeight: '100vh', background: '#0f0e0c', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '0.5px solid #2a2926' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#b8860b" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="3" fill="#b8860b"/>
            <line x1="14" y1="2" x2="14" y2="8" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="20" x2="14" y2="26" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="8" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="26" y2="14" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#f0ede6' }}>ChronoHeroes</span>
        </div>
        <button onClick={() => router.push('/')} style={{ fontSize: 12, color: '#6b6a65', background: 'transparent', border: '0.5px solid #2a2926', borderRadius: 99, padding: '6px 14px', cursor: 'pointer', fontFamily: 'sans-serif' }}>
          Retour
        </button>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px 80px' }}>

        <div style={{ display: 'inline-block', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 20, padding: '4px 14px', border: '0.5px solid #b8860b33', borderRadius: 99 }}>
          Le projet
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#f0ede6', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>
          Comment ca marche
        </h1>

        <p style={{ fontSize: 17, color: '#6b6a65', lineHeight: 1.8, marginBottom: 56 }}>
          ChronoHeroes est une facon nouvelle et personnelle de decouvrir l Histoire. Non pas comme une suite de dates et d evenements abstraits, mais comme une serie de vies humaines qui ont toutes traverse l age que vous avez aujourd hui.
        </p>

        {[
          {
            n: '01',
            t: "L'age comme mesure universelle",
            p: "On apprend l'Histoire par annees : 1789, 1945, 1969. Ces chiffres situent les evenements dans le temps, mais ils ne disent rien de l'humain qui les a vecus. Quel age avait-il ? Etait-il jeune, experimente, vieux ? ChronoHeroes repond a cette question en ramenant chaque evenement a l'echelle d'une vie humaine — la votre."
          },
          {
            n: '02',
            t: "Le calcul au jour pres",
            p: "Chaque personnage de notre base possede sa date de naissance exacte. Chaque evenement historique est date precisement. On calcule l'age du personnage ce jour-la en nombre de jours, et on le compare au votre. L'ecart s'affiche sur chaque carte — parfois zero. Quand l'ecart est zero, c'est jour pour jour : vous avez aujourd'hui l'age exact auquel ce personnage a change le cours de l'Histoire."
          },
          {
            n: '03',
            t: "Apprendre l'Histoire autrement",
            p: "Savoir que Napoleon avait 36 ans a Austerlitz, que Marie Curie avait 36 ans quand elle a recu son premier Nobel, que Martin Luther King avait 34 ans lors du discours I Have a Dream — ce n'est pas de l'anecdote. C'est une facon de se situer dans le temps, de comprendre que l'Histoire n'est pas un passe lointain mais une suite de destins humains qui ont tous connu votre age."
          },
          {
            n: '04',
            t: "Se repositionner, pas se comparer",
            p: "L'objectif n'est pas de creer de l'anxiete. Personne n'attend de vous que vous marchiez sur la Lune ou gagniez Austerlitz. L'idee est contemplative : prendre conscience que l'Histoire est faite de vies humaines ordinaires qui, un jour, ont fait quelque chose d'extraordinaire — souvent a l'age que vous avez maintenant. Alexandre le Grand avait conquis l'Empire perse a 30 ans. Mais Montaigne a commence a ecrire ses Essais a 38 ans, apres une vie d'echecs et de deuils."
          },
          {
            n: '05',
            t: "Une perspective personnelle",
            p: "Chaque utilisateur vit une experience unique. La meme base de donnees, les memes 537 evenements — mais le miroir change chaque jour, et il est different pour chacun. C'est l'Histoire vue a travers votre prisme personnel, au jour le jour."
          },
        ].map((s, i, arr) => (
          <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: 36, borderBottom: i < arr.length - 1 ? '0.5px solid #2a2926' : 'none', marginBottom: 36 }}>
            <div style={{ fontSize: 11, color: '#444441', width: 28, paddingTop: 5, flexShrink: 0, fontWeight: 500 }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#f0ede6', marginBottom: 12 }}>{s.t}</div>
              <div style={{ fontSize: 15, color: '#6b6a65', lineHeight: 1.85 }}>{s.p}</div>
            </div>
          </div>
        ))}

        <div style={{ background: '#1a1916', border: '0.5px solid #2e2d29', borderRadius: 14, padding: '28px 32px', marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#f0ede6', marginBottom: 8, fontStyle: 'italic' }}>
            "L'Histoire n'est pas ce qui s'est passe. C'est ce qui s'est passe a l'age qu'on a."
          </div>
          <div style={{ fontSize: 13, color: '#444441' }}>Principe fondateur de ChronoHeroes</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => router.push('/')} style={{ padding: '13px 32px', background: '#b8860b', color: '#0f0e0c', border: 'none', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Decouvrir mes heros du jour
          </button>
        </div>

      </div>
    </main>
  )
}
