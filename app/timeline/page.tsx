'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MatchEvent, getCategoryStyle } from '@/lib/supabase'
import EventCard from '@/components/EventCard'
const CATEGORIES = [
  { slug: null, label: 'Tous' },
  { slug: 'arts', label: 'Arts' },
  { slug: 'science', label: 'Sciences' },
  { slug: 'sport', label: 'Sport' },
  { slug: 'pouvoir', label: 'Politique' },
  { slug: 'exploration', label: 'Exploration' },
  { slug: 'guerre', label: 'Guerre' },
]
export default function TimelinePage() {
  const router = useRouter()
  const [prenom, setPrenom] = useState('')
  const [userDays, setUserDays] = useState(0)
  const [ageLabel, setAgeLabel] = useState('')
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState<string | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const p = localStorage.getItem('ch_prenom')
    const bd = localStorage.getItem('ch_birthdate')
    const ud = localStorage.getItem('ch_userdays')
    if (!p || !bd || !ud) { router.push('/'); return }
    setPrenom(p)
    setUserDays(Number(ud))
    const birth = new Date(bd)
    const today = new Date()
    let y = today.getFullYear() - birth.getFullYear()
    let m = today.getMonth() - birth.getMonth()
    let d = today.getDate() - birth.getDate()
    if (d < 0) { m -= 1; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
    if (m < 0) { y -= 1; m += 12 }
    setAgeLabel(`${y} ans, ${m} mois et ${d} jour${d > 1 ? 's' : ''}`)
  }, [])
  useEffect(() => {
    if (!userDays) return
    setLoading(true)
    setError('')
    const url = `/api/match?days=${userDays}&window=60${cat ? `&category=${cat}` : ''}&limit=20`
    fetch(url).then(r => r.json()).then(d => {
      if (d.error) { setError(d.error); setLoading(false); return }
      setEvents(d.events ?? [])
      setLoading(false)
    }).catch(() => { setError('Erreur de connexion'); setLoading(false) })
  }, [userDays, cat])
  return (
    <main style={{ minHeight: '100vh', background: '#f5f3ee', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '0.5px solid #e8e6e0', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b8860b' }} />
          <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1916' }}>ChronoHeroes</span>
        </div>
        <button onClick={() => router.push('/')} style={{ fontSize: 12, color: '#6b6a65', background: 'transparent', border: '0.5px solid #e8e6e0', borderRadius: 99, padding: '5px 12px', cursor: 'pointer', fontFamily: 'sans-serif' }}>
          Retour
        </button>
      </nav>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '20px 22px', margin: '24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 4 }}>{prenom}</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: '#1a1916', letterSpacing: '-.5px' }}>{userDays.toLocaleString('fr-FR')} jours</div>
          <div style={{ fontSize: 13, color: '#a8a79f', marginTop: 4 }}>{ageLabel} de vie</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {CATEGORIES.map(c => (
            <button key={String(c.slug)} onClick={() => setCat(c.slug)} style={{ padding: '5px 12px', fontSize: 12, borderRadius: 99, cursor: 'pointer', fontFamily: 'sans-serif', background: cat === c.slug ? '#1a1916' : 'transparent', color: cat === c.slug ? '#fff' : '#6b6a65', border: cat === c.slug ? '0.5px solid #1a1916' : '0.5px solid #e8e6e0' }}>
              {c.label}
            </button>
          ))}
        </div>
        {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: '#a8a79f', fontSize: 13 }}>Recherche de vos heros...</div>}
        {error && <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#A32D2D' }}>{error}</div>}
        {!loading && !error && events.length === 0 && (
          <div style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#6b6a65', marginBottom: 8 }}>Aucun heros trouve.</div>
            <button onClick={() => setCat(null)} style={{ fontSize: 12, padding: '6px 14px', border: '0.5px solid #e8e6e0', borderRadius: 99, background: 'transparent', cursor: 'pointer', color: '#1a1916', fontFamily: 'sans-serif' }}>Voir tout</button>
          </div>
        )}
        {!loading && events.map(event => <EventCard key={event.event_id} event={event} />)}
        {!loading && events.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button onClick={() => { const url = `/api/match?days=${userDays}&window=120${cat ? `&category=${cat}` : ''}&limit=40`; setLoading(true); fetch(url).then(r => r.json()).then(d => { setEvents(d.events ?? []); setLoading(false) }) }} style={{ fontSize: 13, padding: '8px 20px', border: '0.5px solid #e8e6e0', borderRadius: 99, background: 'transparent', cursor: 'pointer', color: '#1a1916', fontFamily: 'sans-serif' }}>
              Voir plus de heros
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
