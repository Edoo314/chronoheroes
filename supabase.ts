// lib/supabase.ts
// ─────────────────────────────────────────────────────────
// Client Supabase partagé — côté serveur (service role)
// et côté client (anon key pour les requêtes publiques)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client public (browser) — lecture seule sur persons + events
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// Client serveur — opérations admin
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE)


// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type MatchEvent = {
  event_id:        string
  person_id:       string
  person_name:     string
  wikipedia_slug:  string | null
  image_url:       string | null
  bio_fr:          string | null
  birthdate_raw:   string
  deathdate_raw:   string | null
  period:          string
  geo:             string
  tags:            string
  event_date_raw:  string
  person_age_days: number
  age_years:       number
  age_months:      number
  age_days_rem:    number
  age_label:       string    // '36 ans, 3 mois et 17 jours'
  description_fr:  string
  category:        string
  subcategory:     string | null
  importance:      number
  delta_days:      number    // Écart absolu avec l'âge utilisateur
}

export type UserProfile = {
  prenom:    string
  birthdate: string   // 'YYYY-MM-DD'
  country:   string
}


// ─────────────────────────────────────────────────────────
// Calcul de l'âge en jours
// ─────────────────────────────────────────────────────────

export function computeUserDays(birthdate: string): {
  userDays:  number
  ageLabel:  string
  years:     number
  months:    number
  days:      number
} {
  const birth = new Date(birthdate)
  const today = new Date()
  const userDays = Math.floor((today.getTime() - birth.getTime()) / 86_400_000)

  // Décomposition précise en années / mois / jours
  let y = today.getFullYear() - birth.getFullYear()
  let m = today.getMonth()    - birth.getMonth()
  let d = today.getDate()     - birth.getDate()

  if (d < 0) {
    m -= 1
    d += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }
  if (m < 0) { y -= 1; m += 12 }

  const ageLabel = `${y} ans, ${m} mois et ${d} jour${d > 1 ? 's' : ''}`

  return { userDays, ageLabel, years: y, months: m, days: d }
}


// ─────────────────────────────────────────────────────────
// Requête de matching principale
// ─────────────────────────────────────────────────────────

export async function fetchMatchEvents(params: {
  userDays:  number
  window?:   number     // ± jours, défaut 30
  category?: string     // null = tous
  period?:   string
  geo?:      string
  limit?:    number
}): Promise<MatchEvent[]> {
  const { userDays, window = 30, category, period, geo, limit = 20 } = params

  const { data, error } = await supabase.rpc('match_events', {
    p_user_days: userDays,
    p_window:    window,
    p_category:  category ?? null,
    p_period:    period   ?? null,
    p_geo:       geo      ?? null,
    p_limit:     limit,
  })

  if (error) throw new Error(`match_events: ${error.message}`)
  return data as MatchEvent[]
}


// ─────────────────────────────────────────────────────────
// API Route — app/api/match/route.ts
// GET /api/match?days=14932&window=30&category=sport
// ─────────────────────────────────────────────────────────

// Copier ce bloc dans : app/api/match/route.ts

/*
import { NextRequest, NextResponse } from 'next/server'
import { fetchMatchEvents } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const days     = Number(searchParams.get('days'))
  const window   = Number(searchParams.get('window')   ?? 30)
  const category = searchParams.get('category') ?? undefined
  const period   = searchParams.get('period')   ?? undefined
  const geo      = searchParams.get('geo')      ?? undefined
  const limit    = Number(searchParams.get('limit') ?? 20)

  if (!days || isNaN(days)) {
    return NextResponse.json({ error: 'Paramètre days requis' }, { status: 400 })
  }

  try {
    const events = await fetchMatchEvents({ userDays: days, window, category, period, geo, limit })
    return NextResponse.json({ events, total: events.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
*/


// ─────────────────────────────────────────────────────────
// Hook React — hooks/useMatchEvents.ts
// ─────────────────────────────────────────────────────────

/*
import { useState, useEffect } from 'react'
import { computeUserDays, MatchEvent } from '@/lib/supabase'

export function useMatchEvents(birthdate: string | null, category?: string) {
  const [events,  setEvents]  = useState<MatchEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [userDays, setUserDays] = useState(0)
  const [ageLabel, setAgeLabel] = useState('')

  useEffect(() => {
    if (!birthdate) return

    const { userDays, ageLabel } = computeUserDays(birthdate)
    setUserDays(userDays)
    setAgeLabel(ageLabel)

    setLoading(true)
    fetch(`/api/match?days=${userDays}&window=30${category ? `&category=${category}` : ''}`)
      .then(r => r.json())
      .then(d => { setEvents(d.events ?? []); setLoading(false) })
      .catch(() => setLoading(false))

    // Recalcul à minuit
    const now   = new Date()
    const night = new Date(); night.setHours(24, 0, 0, 0)
    const timer = setTimeout(() => location.reload(), night.getTime() - now.getTime())
    return () => clearTimeout(timer)
  }, [birthdate, category])

  return { events, loading, userDays, ageLabel }
}
*/
