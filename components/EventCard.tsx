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

export default function EventCard({ event }: { event: MatchEvent }) {
  const [open, setOpen] = useState(false)
  const style = getCategoryStyle(event.category)
  const deltaLabel = event.delta_days === 0 ? 'Jour pour jour' : ('+-' + event.delta_days + ' jour' + (event.delta_days > 1 ? 's' : ''))
  const isDeltaClose = event.delta_days <= 3

  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#fff', border: '0.5px solid #e8e6e0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: style.bg, color: style.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
          {event.person_name.split(' ').slice(0,2).map((w: string) => w[0]).join('').toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1916', marginBottom: 2 }}>{event.person_name}</div>
          <div style={{ fontSize: 11, color: '#a8a79f' }}>{event.age_label}</div>
        </div>
        <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: isDeltaClose ? '#E1F5EE' : '#F1EFE8', color: isDeltaClose ? '#085041' : '#5F5E5A', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {deltaLabel}
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#1a1916', lineHeight: 1.55, marginBottom: 8 }}>{event.description_fr}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: style.bg, color: style.text }}>{style.label}</span>
        {event.period && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#F1EFE8', color: '#5F5E5A' }}>{event.period}</span>}
        <span style={{ fontSize: 11, color: '#a8a79f', marginLeft: 'auto' }}>{formatDate(event.event_date_raw)}</span>
      </div>
      {open && event.bio_fr && <div style={{ marginTop: 12, paddingTop: 12, borderTop: '0.5px solid #e8e6e0', fontSize: 13, color: '#6b6a65', lineHeight: 1.7 }}>{event.bio_fr}</div>}
    </div>
  )
}
