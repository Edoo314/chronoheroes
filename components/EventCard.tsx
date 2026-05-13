'use client'
import { MatchEvent, getCategoryStyle } from '@/lib/supabase'
import { useState } from 'react'

function formatDate(raw: string): string {
  if (!raw) return ''
  const bce = raw.startsWith('-')
  const clean = bce ? raw.slice(1) : raw
  const parts = clean.split('-')
  if (parts.length < 3) return raw
  const months = ['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre']
  const d = parseInt(parts[2])
  const m = parseInt(parts[1]) - 1
  const y = parseInt(parts[0])
  const suffix = bce ? ' av. J.-C.' : ''
  return d + ' ' + months[m] + ' ' + y + suffix
}

function formatBirthDeath(born: string, died: string): string {
  const b = formatDate(born)
  if (!died) return 'Ne le ' + b
  return 'Ne le ' + b + ' · Mort le ' + formatDate(died)
}

function getDeltaStyle(signed: number): { label: string; bg: string; color: string } {
  if (signed === 0) return { label: 'Jour pour jour', bg: '#b8860b22', color: '#b8860b' }
  if (signed > 0) {
    const d = signed
    return { label: 'Dans ' + d + ' jour' + (d > 1 ? 's' : ''), bg: '#E6F1FB', color: '#0C447C' }
  }
  const d = Math.abs(signed)
  return { label: 'Il y a ' + d + ' jour' + (d > 1 ? 's' : ''), bg: '#EAF3DE', color: '#27500A' }
}

export default function EventCard({ event }: { event: MatchEvent }) {
  const [open, setOpen] = useState(false)
  const style = getCategoryStyle(event.category)
  const delta = getDeltaStyle(event.delta_signed)

  const wikiUrl = event.wikipedia_slug
    ? 'https://fr.wikipedia.org/wiki/' + event.wikipedia_slug
    : null

  return (
    <div style={{ background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
        <div style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0, background: style.bg, color: style.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, overflow: 'hidden' }}>
          {event.image_url ? (
            <img src={event.image_url} alt={event.person_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            event.person_name.split(' ').slice(0,2).map((w: string) => w[0]).join('').toUpperCase()
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916' }}>{event.person_name}</div>
            {wikiUrl && (
              <a href={wikiUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontSize: 11, color: '#b8860b', textDecoration: 'none', border: '0.5px solid #b8860b44', borderRadius: 99, padding: '1px 7px', whiteSpace: 'nowrap' }}>
                En savoir plus
              </a>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#a8a79f', marginBottom: 2 }}>{formatBirthDeath(event.birthdate_raw, event.deathdate_raw ?? '')}</div>
          <div style={{ fontSize: 12, color: '#6b6a65' }}>{event.age_label}</div>
        </div>
        <div style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, background: delta.bg, color: delta.color, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {delta.label}
        </div>
      </div>

      <div style={{ fontSize: 14, color: '#1a1916', lineHeight: 1.65, marginBottom: 4, paddingLeft: 70 }}>{event.description_fr}</div>

      {event.bio_fr && (
        <div style={{ paddingLeft: 70 }}>
          <button onClick={e => { e.stopPropagation(); setOpen(!open) }} style={{ fontSize: 11, color: '#b8860b', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'sans-serif' }}>
            {open ? 'Réduire ▲' : 'Lire plus ▼'}
          </button>
          {open && (
            <div style={{ fontSize: 13, color: '#6b6a65', lineHeight: 1.75, marginTop: 6, paddingBottom: 8, borderBottom: '0.5px solid #e8e6e0' }}>
              {event.bio_fr}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingLeft: 70, marginTop: 10 }}>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: style.bg, color: style.text }}>{style.label}</span>
        {event.period && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#F5F3EE', color: '#6b6a65' }}>{event.period}</span>}
        <span style={{ fontSize: 11, color: '#b8b6ae', marginLeft: 'auto' }}>{formatDate(event.event_date_raw)}</span>
      </div>
    </div>
  )
}
