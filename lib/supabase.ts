import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
export type MatchEvent = {
  event_id: string; person_name: string; wikipedia_slug: string | null
  image_url: string | null; bio_fr: string | null; birthdate_raw: string
  deathdate_raw: string | null; period: string; geo: string; tags: string
  event_date_raw: string; person_age_days: number; age_years: number
  age_months: number; age_days_rem: number; age_label: string
  description_fr: string; category: string; subcategory: string | null
  importance: number; delta_days: number; delta_signed: number
}
export function computeUserDays(birthdate: string) {
  const [by, bm, bd] = birthdate.split('-').map(Number)
  const today = new Date()
  const ty = today.getFullYear()
  const tm = today.getMonth() + 1
  const td = today.getDate()
  const d1 = Date.UTC(by, bm - 1, bd)
  const d2 = Date.UTC(ty, tm - 1, td)
  const userDays = Math.floor((d2 - d1) / 86_400_000)
  let y = ty - by
  let m = tm - bm
  let d = td - bd
  if (d < 0) { m -= 1; d += new Date(ty, tm - 1, 0).getDate() }
  if (m < 0) { y -= 1; m += 12 }
  return { userDays, ageLabel: y + ' ans, ' + m + ' mois et ' + d + ' jour' + (d > 1 ? 's' : ''), years: y, months: m, days: d }
}
export function getMatchWindow(userDays: number): number {
  const years = userDays / 365.25
  if (years >= 60) return 120
  if (years >= 50) return 90
  return 60
}
export async function fetchMatchEvents(params: { userDays: number; window?: number; category?: string; limit?: number }) {
  const { userDays, category, limit = 20 } = params
  const window = params.window ?? getMatchWindow(userDays)
  const { data, error } = await supabase.rpc('match_events', { p_user_days: userDays, p_window: window, p_category: category ?? null, p_period: null, p_geo: null, p_limit: limit })
  if (error) throw new Error(error.message)
  return (data ?? []) as MatchEvent[]
}
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  arts: { bg: '#FBEAF0', text: '#72243E', label: 'Arts & culture' },
  science: { bg: '#E6F1FB', text: '#0C447C', label: 'Sciences' },
  sport: { bg: '#EAF3DE', text: '#27500A', label: 'Sport' },
  pouvoir: { bg: '#FAEEDA', text: '#633806', label: 'Politique' },
  exploration: { bg: '#FFF9E6', text: '#633806', label: 'Exploration' },
  philosophie: { bg: '#EEEDFE', text: '#3C3489', label: 'Philosophie' },
  spirituel: { bg: '#E1F5EE', text: '#085041', label: 'Spirituel' },
  architecture: { bg: '#F1EFE8', text: '#444441', label: 'Architecture' },
  economie: { bg: '#EAF3DE', text: '#3B6D11', label: 'Economie' },
}
export function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: '#F1EFE8', text: '#444441', label: category }
}
