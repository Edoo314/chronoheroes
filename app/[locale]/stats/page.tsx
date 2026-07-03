'use client'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Nav from '@/components/Nav'

const STATS = {
  categories: [
    { labelFr: 'Arts et culture',    labelEn: 'Arts & culture',   nb: 954, color: '#72243E' },
    { labelFr: 'Politique / Pouvoir',labelEn: 'Politics / Power', nb: 527, color: '#633806' },
    { labelFr: 'Sciences',           labelEn: 'Sciences',         nb: 413, color: '#0C447C' },
    { labelFr: 'Sport',              labelEn: 'Sport',            nb: 276, color: '#27500A' },
    { labelFr: 'Exploration',        labelEn: 'Exploration',      nb: 154, color: '#b8860b' },
    { labelFr: 'Philosophie',        labelEn: 'Philosophy',       nb: 69,  color: '#3C3489' },
    { labelFr: 'Guerre',             labelEn: 'War',              nb: 63,  color: '#8B0000' },
    { labelFr: 'Spirituel',          labelEn: 'Spiritual',        nb: 36,  color: '#085041' },
  ],
  periodes: [
    { labelFr: 'XXe siècle',    labelEn: '20th century',       nb: 146 },
    { labelFr: 'Contemporain',  labelEn: 'Contemporary',        nb: 96  },
    { labelFr: 'XIXe siècle',   labelEn: '19th century',       nb: 75  },
    { labelFr: 'XVIIe-XVIIIe', labelEn: '17th-18th century',  nb: 37  },
    { labelFr: 'Renaissance',   labelEn: 'Renaissance',         nb: 28  },
    { labelFr: 'Antiquité',     labelEn: 'Antiquity',           nb: 12  },
    { labelFr: 'Moyen-Âge',    labelEn: 'Middle Ages',         nb: 7   },
  ],
  top10: [
    { name: 'Wolfgang Amadeus Mozart', nb: 18, catFr: 'Musique',     catEn: 'Music'     },
    { name: 'Napoléon Bonaparte',      nb: 16, catFr: 'Politique',   catEn: 'Politics'  },
    { name: 'Honoré de Balzac',        nb: 13, catFr: 'Littérature', catEn: 'Literature'},
    { name: 'Francisco de Goya',       nb: 13, catFr: 'Art',         catEn: 'Art'       },
    { name: 'Winston Churchill',       nb: 13, catFr: 'Politique',   catEn: 'Politics'  },
    { name: 'Charles Darwin',          nb: 12, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Alexander Fleming',       nb: 12, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Louis Pasteur',           nb: 12, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Maximilien Robespierre',  nb: 12, catFr: 'Politique',   catEn: 'Politics'  },
    { name: 'Lionel Messi',            nb: 11, catFr: 'Sport',       catEn: 'Sport'     },
    { name: 'Albert Einstein',         nb: 11, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Charles de Gaulle',       nb: 11, catFr: 'Politique',   catEn: 'Politics'  },
    { name: 'Galilée',                 nb: 11, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Gustave Flaubert',        nb: 11, catFr: 'Littérature', catEn: 'Literature'},
    { name: 'John Lennon',             nb: 11, catFr: 'Musique',     catEn: 'Music'     },
    { name: 'Piotr Tchaïkovski',       nb: 11, catFr: 'Musique',     catEn: 'Music'     },
    { name: 'Roger Federer',           nb: 11, catFr: 'Sport',       catEn: 'Sport'     },
    { name: 'Victor Hugo',             nb: 11, catFr: 'Littérature', catEn: 'Literature'},
    { name: 'Virginia Woolf',          nb: 11, catFr: 'Littérature', catEn: 'Literature'},
    { name: 'Albert Camus',            nb: 10, catFr: 'Littérature', catEn: 'Literature'},
    { name: 'Albert Schweitzer',       nb: 10, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Bob Marley',              nb: 10, catFr: 'Musique',     catEn: 'Music'     },
    { name: 'Che Guevara',             nb: 10, catFr: 'Politique',   catEn: 'Politics'  },
    { name: 'Dostoïevski',             nb: 10, catFr: 'Littérature', catEn: 'Literature'},
    { name: 'Frida Kahlo',             nb: 10, catFr: 'Art',         catEn: 'Art'       },
    { name: 'Jean-Jacques Rousseau',   nb: 10, catFr: 'Philosophie', catEn: 'Philosophy'},
    { name: 'Johann Sebastian Bach',   nb: 10, catFr: 'Musique',     catEn: 'Music'     },
    { name: 'Léonard de Vinci',        nb: 10, catFr: 'Art',         catEn: 'Art'       },
    { name: 'Martin Luther King',      nb: 10, catFr: 'Politique',   catEn: 'Politics'  },
    { name: 'Nikola Tesla',            nb: 10, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Pablo Picasso',           nb: 10, catFr: 'Art',         catEn: 'Art'       },
    { name: 'Rosa Luxemburg',          nb: 10, catFr: 'Politique',   catEn: 'Politics'  },
    { name: 'Stendhal',                nb: 10, catFr: 'Littérature', catEn: 'Literature'},
    { name: 'Stephen Hawking',         nb: 10, catFr: 'Science',     catEn: 'Science'   },
    { name: 'Usain Bolt',              nb: 10, catFr: 'Sport',       catEn: 'Sport'     },
    { name: 'Vincent van Gogh',        nb: 10, catFr: 'Art',         catEn: 'Art'       },
  ],
  plusJeune: {
    name: 'Marie Stuart',
    ageFr: '6 jours', ageEn: '6 days',
    descFr: 'Devient reine d\'Écosse à la mort de son père',
    descEn: 'Becomes Queen of Scotland at her father\'s death',
  },
  plusAge: {
    name: 'Edgar Morin',
    ageFr: '104 ans', ageEn: '104 years',
    descFr: 'S\'éteint à Paris, figure tutélaire de la pensée complexe',
    descEn: 'Dies in Paris, guiding figure of complex thought',
  },
  genre: { hommes: 336, femmes: 65 },
  tranches: [
    { label: '0-9', nb: 17 },
    { label: '10-19', nb: 211 },
    { label: '20-29', nb: 658 },
    { label: '30-39', nb: 581 },
    { label: '40-49', nb: 419 },
    { label: '50-59', nb: 250 },
    { label: '60-69', nb: 165 },
    { label: '70-79', nb: 114 },
    { label: '80-89', nb: 70 },
    { label: '90+', nb: 25 },
  ],
}

const MAX_CAT = Math.max(...STATS.categories.map(c => c.nb))
const MAX_PER = Math.max(...STATS.periodes.map(p => p.nb))
const MAX_TR = Math.max(...STATS.tranches.map(t => t.nb))
const TOTAL_GENRE = STATS.genre.hommes + STATS.genre.femmes

const T = {
  fr: {
    tag: 'En chiffres',
    title: 'ChronoHeroes en chiffres',
    subtitle: "Une base construite événement par événement pour couvrir l'Histoire de l'Antiquité à nos jours.",
    events: 'événements datés',
    persons: 'personnages historiques',
    youngest: 'Le plus jeune',
    oldest: 'Le plus âgé',
    menWomen: 'Hommes et femmes',
    men: 'Hommes',
    women: 'Femmes',
    genderGoal: 'Objectif : atteindre 30% de femmes dans les prochaines versions',
    ageTitle: 'Âge des événements',
    agePeak: "Pic d'événements entre 20 et 40 ans — l'âge où l'Histoire se fait",
    byTheme: 'Par thème',
    byEra: 'Par époque',
    topPersons: 'Les personnages les mieux couverts',
    ev: 'év.',
    growing: 'La base grandit chaque semaine',
    suggestText: 'Vous ne trouvez pas votre personnage préféré ? Écrivez-nous.',
    suggest: 'Suggérer un personnage',
    howItWorks: 'Comment ça marche',
  },
  en: {
    tag: 'By the numbers',
    title: 'ChronoHeroes by the numbers',
    subtitle: 'A database built event by event to cover History from Antiquity to the present day.',
    events: 'dated events',
    persons: 'historical figures',
    youngest: 'The youngest',
    oldest: 'The oldest',
    menWomen: 'Men and women',
    men: 'Men',
    women: 'Women',
    genderGoal: 'Goal: reach 30% women in future versions',
    ageTitle: 'Age of events',
    agePeak: 'Peak of events between 20 and 40 — the age when History is made',
    byTheme: 'By theme',
    byEra: 'By era',
    topPersons: 'Most covered figures',
    ev: 'ev.',
    growing: 'The database grows every week',
    suggestText: "Can't find your favorite historical figure? Write to us.",
    suggest: 'Suggest a figure',
    howItWorks: 'How it works',
  }
}
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const isEn = params.locale === 'en'
  return {
    title: isEn ? 'ChronoHeroes — Statistics' : 'ChronoHeroes — Statistiques',
    description: isEn
      ? '580+ historical figures, 3000+ dated events. Explore the ChronoHeroes database by theme, era and age.'
      : '580+ personnages historiques, 3000+ événements datés. Explorez la base ChronoHeroes par thème, époque et âge.',
    openGraph: {
      title: isEn ? 'ChronoHeroes — Statistics' : 'ChronoHeroes — Statistiques',
      description: isEn
        ? '580+ historical figures, 3000+ dated events.'
        : '580+ personnages historiques, 3000+ événements datés.',
      url: isEn ? 'https://chronoheroes.com/en/stats' : 'https://chronoheroes.com/fr/stats',
      siteName: 'ChronoHeroes',
      type: 'website',
    },
  }
}
export default function StatsPage() {
  const router = useRouter()
  const locale = useLocale() as 'fr' | 'en'
  const t = T[locale] || T.fr

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'sans-serif' }}>
      <Nav />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'inline-block', fontSize: 12, letterSpacing: '.08em', color: '#b8860b', marginBottom: 20, padding: '5px 16px', border: '0.5px solid #b8860b44', borderRadius: 99, fontWeight: 500 }}>
          {t.tag}
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1916', letterSpacing: '-1px', marginBottom: 8, lineHeight: 1.15 }}>
          {t.title}
        </h1>

        <p style={{ fontSize: 15, color: '#6b6a65', lineHeight: 1.75, marginBottom: 40 }}>
          {t.subtitle}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 48 }}>
          {[
            { n: '2 500+', l: t.events },
            { n: '400+',   l: t.persons },
          ].map((s, i) => (
            <div key={i} style={{ background: '#f5f3ee', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#6b6a65' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 48 }}>
          <div style={{ background: '#f5f3ee', borderRadius: 12, padding: '20px 16px' }}>
            <div style={{ fontSize: 11, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8, fontWeight: 600 }}>{t.youngest}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{locale === 'fr' ? STATS.plusJeune.ageFr : STATS.plusJeune.ageEn}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 4 }}>{STATS.plusJeune.name}</div>
            <div style={{ fontSize: 12, color: '#6b6a65', lineHeight: 1.5 }}>{locale === 'fr' ? STATS.plusJeune.descFr : STATS.plusJeune.descEn}</div>
          </div>
          <div style={{ background: '#f5f3ee', borderRadius: 12, padding: '20px 16px' }}>
            <div style={{ fontSize: 11, color: '#b8860b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8, fontWeight: 600 }}>{t.oldest}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>{locale === 'fr' ? STATS.plusAge.ageFr : STATS.plusAge.ageEn}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 4 }}>{STATS.plusAge.name}</div>
            <div style={{ fontSize: 12, color: '#6b6a65', lineHeight: 1.5 }}>{locale === 'fr' ? STATS.plusAge.descFr : STATS.plusAge.descEn}</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>{t.menWomen}</h2>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, background: '#f5f3ee', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1916' }}>{STATS.genre.hommes}</div>
              <div style={{ fontSize: 12, color: '#6b6a65', marginTop: 4 }}>{t.men} — {Math.round(STATS.genre.hommes / TOTAL_GENRE * 100)}%</div>
            </div>
            <div style={{ flex: 1, background: '#FBEAF0', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#72243E' }}>{STATS.genre.femmes}</div>
              <div style={{ fontSize: 12, color: '#72243E', marginTop: 4 }}>{t.women} — {Math.round(STATS.genre.femmes / TOTAL_GENRE * 100)}%</div>
            </div>
          </div>
          <div style={{ background: '#f5f3ee', borderRadius: 99, height: 12, overflow: 'hidden', display: 'flex' }}>
            <div style={{ background: '#1a1916', height: '100%', width: Math.round(STATS.genre.hommes / TOTAL_GENRE * 100) + '%' }} />
            <div style={{ background: '#72243E', height: '100%', flex: 1 }} />
          </div>
          <div style={{ fontSize: 12, color: '#6b6a65', marginTop: 8, textAlign: 'center' }}>{t.genderGoal}</div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>{t.ageTitle}</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
            {STATS.tranches.map((tr, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', background: '#b8860b', borderRadius: '4px 4px 0 0', height: Math.round(tr.nb / MAX_TR * 100) + 'px', minHeight: 4 }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {STATS.tranches.map((tr, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#a8a79f', lineHeight: 1.3 }}>{tr.label}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#6b6a65', marginTop: 12, textAlign: 'center' }}>{t.agePeak}</div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>{t.byTheme}</h2>
          {STATS.categories.map((c, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: '#1a1916', fontWeight: 500 }}>{locale === 'fr' ? c.labelFr : c.labelEn}</span>
                <span style={{ fontSize: 13, color: '#6b6a65' }}>{c.nb}</span>
              </div>
              <div style={{ background: '#f5f3ee', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ background: c.color, borderRadius: 99, height: '100%', width: Math.round(c.nb / MAX_CAT * 100) + '%' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>{t.byEra}</h2>
          {STATS.periodes.map((p, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: '#1a1916', fontWeight: 500 }}>{locale === 'fr' ? p.labelFr : p.labelEn}</span>
                <span style={{ fontSize: 13, color: '#6b6a65' }}>{p.nb}</span>
              </div>
              <div style={{ background: '#f5f3ee', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ background: '#b8860b', borderRadius: 99, height: '100%', width: Math.round(p.nb / MAX_PER * 100) + '%' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1916', marginBottom: 20 }}>{t.topPersons}</h2>
          {STATS.top10.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '0.5px solid #e8e6e0' }}>
              <div style={{ fontSize: 13, color: i === 0 ? '#b8860b' : '#a8a79f', width: 20, textAlign: 'right', flexShrink: 0, fontWeight: i === 0 ? 700 : 400 }}>{p.nb > 10 ? i + 1 : '=20'}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: i < 3 ? 600 : 400, color: '#1a1916' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#a8a79f' }}>{locale === 'fr' ? p.catFr : p.catEn}</div>
              <div style={{ fontSize: 13, color: i === 0 ? '#b8860b' : '#6b6a65', fontWeight: i === 0 ? 700 : 400 }}>{p.nb} {t.ev}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f5f3ee', borderRadius: 14, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', marginBottom: 8 }}>{t.growing}</div>
          <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 16, lineHeight: 1.7 }}>{t.suggestText}</div>
          <a href="mailto:hero@chronoheroes.com" style={{ display: 'inline-block', padding: '10px 24px', background: '#1a1916', color: '#ffffff', borderRadius: 99, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            {t.suggest}
          </a>
        </div>
      </div>

      <footer style={{ borderTop: '0.5px solid #e8e6e0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#a8a79f', background: '#f5f3ee', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#1a1916', fontWeight: 600 }}>ChronoHeroes</span>
        <span onClick={() => router.push(`/${locale}/about`)} style={{ cursor: 'pointer', color: '#6b6a65' }}>{t.howItWorks}</span>
        <span>2026 - <a href="mailto:hero@chronoheroes.com" style={{ color: '#b8860b', textDecoration: 'none' }}>hero@chronoheroes.com</a></span>
      </footer>
    </main>
  )
}
