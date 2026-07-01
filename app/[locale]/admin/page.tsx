'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const ADMIN_PASSWORD = 'chrono2024'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function formatDate(raw: string): string {
  if (!raw) return ''
  const bce = raw.startsWith('-')
  const clean = bce ? raw.slice(1) : raw
  const parts = clean.split('-')
  if (parts.length < 3) return raw
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  const d = parseInt(parts[2])
  const m = parseInt(parts[1]) - 1
  const y = parseInt(parts[0])
  return `${d} ${months[m]} ${y}${bce ? ' av. J.-C.' : ''}`
}

type Person = {
  id: string
  name: string
  birthdate_raw: string
  deathdate_raw: string
  country: string
  period: string
  tags: string
  image_url: string | null
  importance: number
  created_at: string
  events: Event[]
}

type Event = {
  id: string
  event_date_raw: string
  age_label: string
  description_fr: string
  category: string
  subcategory: string
  importance: number
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ total_persons: 0, total_events: 0 })

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('Mot de passe incorrect')
    }
  }

  useEffect(() => {
    if (!authenticated) return
    loadData()
  }, [authenticated])

  async function loadData() {
    setLoading(true)

    // Stats globales
    const { count: pCount } = await supabase.from('persons').select('*', { count: 'exact', head: true })
    const { count: eCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
    setStats({ total_persons: pCount ?? 0, total_events: eCount ?? 0 })

    // 20 derniers personnages + leurs événements
    const { data: personsData } = await supabase
      .from('persons')
      .select('*')
      .order('created_at', { ascending: false })
    

    if (!personsData) { setLoading(false); return }

    const ids = personsData.map(p => p.id)
    const { data: eventsData } = await supabase
  .from('events')
  .select('*')
  .order('event_date_raw', { ascending: true })

    const enriched = personsData.map(p => ({
      ...p,
      events: (eventsData ?? []).filter(e => e.person_id === p.id)
    }))

    setPersons(enriched)
    setLoading(false)
  }

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // ── Login ────────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9F7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 16, padding: '40px 48px', width: 340, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🛡️</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>Administration</div>
          <div style={{ fontSize: 13, color: '#a8a79f', marginBottom: 24 }}>ChronoHeroes</div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e8e6e0', borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
          />
          {error && <div style={{ fontSize: 12, color: '#c0392b', marginBottom: 12 }}>{error}</div>}
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '10px 0', background: '#1a1916', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Entrer
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F2', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916' }}>Administration</div>
            <div style={{ fontSize: 13, color: '#a8a79f' }}>ChronoHeroes — 20 derniers ajouts</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916' }}>{stats.total_persons}</div>
              <div style={{ fontSize: 11, color: '#a8a79f' }}>personnages</div>
            </div>
            <div style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916' }}>{stats.total_events}</div>
              <div style={{ fontSize: 11, color: '#a8a79f' }}>événements</div>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher un personnage..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 16px', border: '1px solid #e8e6e0', borderRadius: 10, fontSize: 14, marginBottom: 24, boxSizing: 'border-box', background: '#fff', outline: 'none' }}
        />

        {loading && <div style={{ textAlign: 'center', color: '#a8a79f', padding: 40 }}>Chargement...</div>}

        {/* Liste des personnages */}
        {filtered.map(person => (
          <div key={person.id} style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>

            {/* En-tête personnage */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F5F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {person.image_url
                  ? <img src={person.image_url} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 13, fontWeight: 700, color: '#a8a79f' }}>{person.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1916' }}>{person.name}</div>
                <div style={{ fontSize: 12, color: '#a8a79f' }}>
                  {formatDate(person.birthdate_raw)} → {person.deathdate_raw ? formatDate(person.deathdate_raw) : 'vivant'}
                  {' · '}{person.country} · {person.period}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {person.image_url
                  ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#EAF3DE', color: '#27500A' }}>📸 image</span>
                  : <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#fdecea', color: '#c0392b' }}>pas d'image</span>
                }
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#F5F3EE', color: '#6b6a65' }}>{person.events.length} événement{person.events.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Événements */}
            {person.events.length === 0
              ? <div style={{ fontSize: 12, color: '#c0392b', paddingLeft: 66 }}>⚠️ Aucun événement</div>
              : (
                <div style={{ borderTop: '0.5px solid #f0ede8', paddingTop: 12 }}>
                  {person.events.map(ev => (
                    <div key={ev.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 10, marginBottom: 10, borderBottom: '0.5px solid #f9f7f2' }}>
                      <div style={{ minWidth: 110, fontSize: 11, color: '#a8a79f', paddingTop: 2 }}>{formatDate(ev.event_date_raw)}</div>
                      <div style={{ minWidth: 130, fontSize: 11, color: '#b8860b', paddingTop: 2 }}>{ev.age_label}</div>
                      <div style={{ flex: 1, fontSize: 13, color: '#1a1916', lineHeight: 1.5 }}>{ev.description_fr}</div>
                      <div style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#F5F3EE', color: '#6b6a65', whiteSpace: 'nowrap' }}>{ev.subcategory}</div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        ))}
      </div>
    </div>
  )
}