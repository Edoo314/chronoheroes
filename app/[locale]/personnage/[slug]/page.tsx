import { createClient } from '@supabase/supabase-js'
import Nav from '@/components/Nav'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
export const dynamic = 'force-dynamic'
export async function generateStaticParams() {
  const { data } = await supabase
    .from('persons')
    .select('wikipedia_slug')
  return (data ?? [])
    .filter(p => p.wikipedia_slug)
    .map(p => ({ slug: p.wikipedia_slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug } = await params
  const { data: person } = await supabase
    .from('persons')
    .select('name, bio_fr')
    .eq('wikipedia_slug', slug)
    .single()
  if (!person) return { title: 'ChronoHeroes' }
  return {
    title: `${person.name} — ChronoHeroes`,
    description: person.bio_fr ?? `Découvrez la vie de ${person.name} au jour près sur ChronoHeroes.`,
  }
}

export default async function PersonnagePage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params

  const { data: person } = await supabase
    .from('persons')
    .select('*')
    .eq('wikipedia_slug', slug)
    .single()

  if (!person) notFound()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('person_id', person.id)
    .order('event_date_raw', { ascending: true })

  function formatDate(raw: string) {
    if (!raw) return ''
    const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
    const parts = raw.split('-')
    return `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F9F7F2', fontFamily: 'sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

        <div style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '24px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {person.image_url && (
            <img src={person.image_url} alt={person.name}
              style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1916', margin: '0 0 6px' }}>{person.name}</h1>
            <div style={{ fontSize: 13, color: '#a8a79f', marginBottom: 10 }}>
              {formatDate(person.birthdate_raw)}
              {person.deathdate_raw ? ` → ${formatDate(person.deathdate_raw)}` : ''}
              {' · '}{person.country}{' · '}{person.period?.replace(/\b([a-z]+)\b/gi, s => s.toUpperCase()).replace(/E\b/g, 'e')}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(person.tags ?? '').split(',').map((tag: string) => (
                <span key={tag} style={{ fontSize: 11, padding: '2px 10px', borderRadius: 99, background: '#F5F3EE', color: '#6b6a65', border: '0.5px solid #e8e6e0' }}>{tag.trim()}</span>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', margin: '0 0 12px' }}>Sa vie, au jour près</h2>

        {(events ?? []).map(ev => (
          <div key={ev.id} style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '16px 20px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#b8860b' }}>{ev.age_label}</div>
                <div style={{ fontSize: 11, color: '#a8a79f' }}>{formatDate(ev.event_date_raw)}</div>
              </div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#F5F3EE', color: '#6b6a65', border: '0.5px solid #e8e6e0' }}>{ev.subcategory}</span>
            </div>
            <div style={{ fontSize: 13, color: '#1a1916', lineHeight: 1.65 }}>{ev.description_fr}</div>
          </div>
        ))}

        <div style={{ marginTop: 32, background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1916', marginBottom: 8 }}>Et vous, que faisiez-vous à cet âge ?</div>
          <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 20, lineHeight: 1.6 }}>
            Entrez votre date de naissance pour découvrir les personnages historiques qui ont vécu quelque chose de remarquable à votre âge exact.
          </div>
          <a href={`/${locale}`}
            style={{ display: 'inline-block', padding: '12px 28px', background: '#1a1916', color: '#fff', borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Découvrir mon miroir dans l'Histoire
          </a>
        </div>

      </div>
    </main>
  )
}
