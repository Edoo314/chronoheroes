'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  bio_fr: string | null
  bio_en: string | null
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
  const [onlyMissingBio, setOnlyMissingBio] = useState(false)
  const [stats, setStats] = useState({ total_persons: 0, total_events: 0 })

  // Éditeur de bios
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftFr, setDraftFr] = useState('')
  const [draftEn, setDraftEn] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      const res = await fetch('/api/admin/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ action: 'verify' }),
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion au serveur')
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

    // Tous les personnages, du plus récent au plus ancien
    const { data: personsData } = await supabase
      .from('persons')
      .select('*')
      .order('created_at', { ascending: false })

    if (!personsData) { setLoading(false); return }

    let eventsData: any[] = []
    let from = 0
    const step = 1000
    while (true) {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('event_date_raw', { ascending: true })
        .range(from, from + step - 1)
      if (!data || data.length === 0) break
      eventsData = [...eventsData, ...data]
      if (data.length < step) break
      from += step
    }

    const enriched = personsData.map(p => ({
      ...p,
      events: (eventsData ?? []).filter(e => e.person_id === p.id)
    }))

    setPersons(enriched)
    setLoading(false)
  }

  function openEditor(person: Person) {
    setEditingId(person.id)
    setDraftFr(person.bio_fr ?? '')
    setDraftEn(person.bio_en ?? '')
    setSaveMsg('')
  }

  function closeEditor() {
    setEditingId(null)
    setSaveMsg('')
  }

  async function saveBios() {
    if (!editingId) return
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/admin/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({
          action: 'save_bio',
          person_id: editingId,
          bio_fr: draftFr,
          bio_en: draftEn,
        }),
      })
      if (res.ok) {
        setPersons(prev => prev.map(p =>
          p.id === editingId
            ? { ...p, bio_fr: draftFr.trim() || null, bio_en: draftEn.trim() || null }
            : p
        ))
        setSaveMsg('✅ Enregistré')
      } else {
        const data = await res.json().catch(() => ({}))
        setSaveMsg('❌ ' + (data.error ?? 'Erreur lors de la sauvegarde'))
      }
    } catch {
      setSaveMsg('❌ Erreur de connexion au serveur')
    }
    setSaving(false)
  }

  const bioFrCount = persons.filter(p => p.bio_fr).length
  const bioEnCount = persons.filter(p => p.bio_en).length

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
    && (!onlyMissingBio || !p.bio_fr || !p.bio_en)
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1916' }}>Administration</div>
            <div style={{ fontSize: 13, color: '#a8a79f' }}>ChronoHeroes — tous les personnages</div>
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
            <div style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#b8860b' }}>{bioFrCount}<span style={{ fontSize: 13, color: '#a8a79f' }}> / {persons.length}</span></div>
              <div style={{ fontSize: 11, color: '#a8a79f' }}>bios FR ({bioEnCount} EN)</div>
            </div>
          </div>
        </div>

        {/* Recherche + filtre */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Rechercher un personnage..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', border: '1px solid #e8e6e0', borderRadius: 10, fontSize: 14, boxSizing: 'border-box', background: '#fff', outline: 'none' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b6a65', cursor: 'pointer', whiteSpace: 'nowrap', background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 10, padding: '10px 14px' }}>
            <input
              type="checkbox"
              checked={onlyMissingBio}
              onChange={e => setOnlyMissingBio(e.target.checked)}
            />
            Bios manquantes
          </label>
        </div>

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
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {person.image_url
                  ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#EAF3DE', color: '#27500A' }}>📸 image</span>
                  : <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#fdecea', color: '#c0392b' }}>pas d'image</span>
                }
                {person.bio_fr
                  ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#EAF3DE', color: '#27500A' }}>bio FR ✓</span>
                  : <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#fdecea', color: '#c0392b' }}>bio FR ✗</span>
                }
                {person.bio_en
                  ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#EAF3DE', color: '#27500A' }}>bio EN ✓</span>
                  : <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#fdecea', color: '#c0392b' }}>bio EN ✗</span>
                }
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#F5F3EE', color: '#6b6a65' }}>{person.events.length} événement{person.events.length > 1 ? 's' : ''}</span>
                <button
                  onClick={() => editingId === person.id ? closeEditor() : openEditor(person)}
                  style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: editingId === person.id ? '#1a1916' : '#fff', color: editingId === person.id ? '#fff' : '#b8860b', border: '0.5px solid #b8860b66', cursor: 'pointer' }}
                >
                  {editingId === person.id ? 'Fermer' : '✏️ Bios'}
                </button>
              </div>
            </div>

            {/* Éditeur de bios */}
            {editingId === person.id && (
              <div style={{ borderTop: '0.5px solid #f0ede8', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6a65', marginBottom: 6 }}>
                      Bio FR <span style={{ fontWeight: 400, color: '#a8a79f' }}>({draftFr.length} car.)</span>
                    </div>
                    <textarea
                      value={draftFr}
                      onChange={e => setDraftFr(e.target.value)}
                      rows={12}
                      placeholder="Trois paragraphes séparés par une ligne vide…"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e6e0', borderRadius: 8, fontSize: 13, lineHeight: 1.6, boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#6b6a65', marginBottom: 6 }}>
                      Bio EN <span style={{ fontWeight: 400, color: '#a8a79f' }}>({draftEn.length} car.)</span>
                    </div>
                    <textarea
                      value={draftEn}
                      onChange={e => setDraftEn(e.target.value)}
                      rows={12}
                      placeholder="Three paragraphs separated by a blank line…"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e6e0', borderRadius: 8, fontSize: 13, lineHeight: 1.6, boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                  <button
                    onClick={saveBios}
                    disabled={saving}
                    style={{ padding: '8px 22px', background: '#1a1916', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  {saveMsg && <span style={{ fontSize: 13, color: saveMsg.startsWith('✅') ? '#27500A' : '#c0392b' }}>{saveMsg}</span>}
                </div>
              </div>
            )}

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
                      {ev.subcategory && <div style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#F5F3EE', color: '#6b6a65', whiteSpace: 'nowrap' }}>{ev.subcategory}</div>}
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
