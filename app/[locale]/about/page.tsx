'use client'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Nav from '@/components/Nav'

const CONTENT = {
  fr: {
    tag: 'Le projet',
    title: 'Comment ça marche',
    intro: "ChronoHeroes est une façon nouvelle et personnelle de découvrir l'Histoire. Non pas comme une suite de dates et d'événements abstraits, mais comme une série de vies humaines qui ont toutes traversé l'âge que vous avez aujourd'hui.",
    sections: [
      { t: "L'âge comme mesure universelle", p: "On apprend l'Histoire par années : 1789, 1945, 1969. Ces chiffres situent les événements dans le temps, mais ils ne disent rien de l'humain qui les a vécus. Quel âge avait-il ? Était-il jeune, expérimenté, vieux ? ChronoHeroes répond à cette question en ramenant chaque événement à l'échelle d'une vie humaine — la vôtre." },
      { t: "Le calcul au jour près", p: "Chaque personnage de notre base possède sa date de naissance exacte. Chaque événement historique est daté précisément. On calcule l'âge du personnage ce jour-là en nombre de jours, et on le compare au vôtre. L'écart s'affiche sur chaque carte — parfois zéro. Quand l'écart est zéro, c'est jour pour jour : vous avez aujourd'hui l'âge exact auquel ce personnage a changé le cours de l'Histoire." },
      { t: "Apprendre l'Histoire autrement", p: "Savoir que Napoléon avait 36 ans à Austerlitz, que Marie Curie avait 36 ans quand elle a reçu son premier Nobel, que Martin Luther King avait 34 ans lors du discours I Have a Dream — ce n'est pas de l'anecdote. C'est une façon de se situer dans le temps, de comprendre que l'Histoire n'est pas un passé lointain mais une suite de destins humains qui ont tous connu votre âge." },
      { t: "Se repositionner, pas se comparer", p: "L'objectif n'est pas de créer de l'anxiété. Personne n'attend de vous que vous marchiez sur la Lune ou gagniez Austerlitz. L'idée est contemplative : prendre conscience que l'Histoire est faite de vies humaines ordinaires qui, un jour, ont fait quelque chose d'extraordinaire — souvent à l'âge que vous avez maintenant." },
      { t: "Ceux qui font vraiment l'Histoire sont anonymes", p: "Les grands noms de l'Histoire ne sont que la partie visible d'un iceberg. Derrière chaque événement célèbre, des millions de vies ordinaires ont été traversées, bousculées, transformées. Chacun est le héros de sa propre histoire, avec ses propres événements marquants, ses propres tournants, ses propres exploits silencieux. ChronoHeroes vous invite à regarder les grands destins avec les yeux de votre propre vie." },
      { t: "Une perspective personnelle", p: "Chaque utilisateur vit une expérience unique. La même base de données, les mêmes événements — mais le miroir change chaque jour, et il est différent pour chacun. C'est l'Histoire vue à travers votre prisme personnel, au jour le jour." },
    ],
    quote: "Quand l'Histoire devient personnelle.",
    quoteLabel: "Principe fondateur de ChronoHeroes",
    cta: "Découvrir mes héros du jour",
    stats: "Statistiques",
  },
  en: {
    tag: 'The project',
    title: 'How it works',
    intro: "ChronoHeroes is a new and personal way to discover History. Not as a sequence of abstract dates and events, but as a series of human lives that all passed through the age you are today.",
    sections: [
      { t: "Age as a universal measure", p: "We learn History by years: 1789, 1945, 1969. These numbers place events in time, but they say nothing about the human who lived them. How old were they? Were they young, experienced, old? ChronoHeroes answers this question by bringing each event to the scale of a human life — yours." },
      { t: "Calculated to the day", p: "Every person in our database has their exact date of birth. Every historical event is precisely dated. We calculate the person's age on that day in number of days, and compare it to yours. The difference is shown on each card — sometimes zero. When the difference is zero, it's day for day: you are today the exact age at which that person changed the course of History." },
      { t: "Learning History differently", p: "Knowing that Napoleon was 36 at Austerlitz, that Marie Curie was 36 when she received her first Nobel, that Martin Luther King was 34 during the I Have a Dream speech — this is not trivia. It's a way of situating yourself in time, of understanding that History is not a distant past but a series of human destinies that all knew your age." },
      { t: "Reposition, not compare", p: "The goal is not to create anxiety. Nobody expects you to walk on the Moon or win Austerlitz. The idea is contemplative: to realize that History is made of ordinary human lives that, one day, did something extraordinary — often at the age you are now." },
      { t: "Those who truly make History are anonymous", p: "The great names of History are only the visible part of an iceberg. Behind every famous event, millions of ordinary lives were crossed, shaken, transformed. Everyone is the hero of their own story, with their own defining moments, their own turning points, their own silent exploits. ChronoHeroes invites you to look at great destinies through the eyes of your own life." },
      { t: "A personal perspective", p: "Every user lives a unique experience. The same database, the same events — but the mirror changes every day, and it is different for each person. It's History seen through your personal prism, day by day." },
    ],
    quote: "When History becomes personal.",
    quoteLabel: "Founding principle of ChronoHeroes",
    cta: "Discover my heroes of the day",
    stats: "Statistics",
  }
}
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const isEn = params.locale === 'en'
  return {
    title: isEn ? 'ChronoHeroes — How it works' : 'ChronoHeroes — Comment ça marche',
    description: isEn
      ? 'ChronoHeroes calculates your exact age in days and finds historical figures who lived something remarkable at the same age.'
      : 'ChronoHeroes calcule votre âge exact en jours et trouve les personnages historiques qui ont vécu quelque chose de remarquable au même âge.',
    openGraph: {
      title: isEn ? 'ChronoHeroes — How it works' : 'ChronoHeroes — Comment ça marche',
      description: isEn
        ? 'Discover history through your own age, down to the day.'
        : 'Découvrez l\'histoire à travers votre propre âge, au jour près.',
      url: isEn ? 'https://chronoheroes.com/en/about' : 'https://chronoheroes.com/fr/about',
      siteName: 'ChronoHeroes',
      type: 'website',
    },
  }
}
export default function AboutPage() {
  const router = useRouter()
  const locale = useLocale() as 'fr' | 'en'
  const c = CONTENT[locale] || CONTENT.fr

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif' }}>
      <Nav />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'inline-block', fontSize: 12, letterSpacing: '.08em', color: '#b8860b', marginBottom: 20, padding: '5px 16px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
          {c.tag}
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1916', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>
          {c.title}
        </h1>

        <p style={{ fontSize: 16, color: '#6b6a65', lineHeight: 1.8, marginBottom: 48 }}>
          {c.intro}
        </p>

        {c.sections.map((s, i, arr) => (
          <div key={i} style={{ paddingBottom: 36, borderBottom: i < arr.length - 1 ? '0.5px solid #e8e6e0' : 'none', marginBottom: 36 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 12 }}>{s.t}</div>
            <div style={{ fontSize: 15, color: '#6b6a65', lineHeight: 1.85 }}>{s.p}</div>
          </div>
        ))}

        <div style={{ background: '#f5f3ee', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '28px 32px', marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
            "{c.quote}"
          </div>
          <div style={{ fontSize: 13, color: '#a8a79f', marginTop: 12 }}>{c.quoteLabel}</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => router.push(`/${locale}`)} style={{ padding: '13px 32px', background: '#1a1916', color: '#ffffff', border: 'none', borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}>
            {c.cta}
          </button>
        </div>
      </div>

      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>ChronoHeroes</span>
        <span onClick={() => router.push(`/${locale}/stats`)} style={{ cursor: 'pointer', color: '#6b6a65' }}>{c.stats}</span>
        <span>2026 - <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
      </footer>
    </main>
  )
}
