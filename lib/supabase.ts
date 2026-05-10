import { createClient } from "@supabase/supabase-js"
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
  importance: number; delta_days: number
}
export function computeUserDays(birthdate: string) {
  const birth = new Date(birthdate)
  const today = new Date()
  const userDays = Math.floor((today.getTime() - birth.getTime()) / 86_400_000)
  let y = today.getFullYear() - birth.getFullYear()
  let m = today.getMonth() - birth.getMonth()
  let d = today.getDate() - birth.getDate()
  if (d < 0) { m -= 1; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
  if (m < 0) { y -= 1; m += 12 }
  return { userDays, ageLabel: `${y} ans, ${m} mois et ${d} jour${d > 1 ? "s" : ""}`, years: y, months: m, days: d }
}
export async function fetchMatchEvents(params: { userDays: number; window?: number; category?: string; limit?: number }) {
  const { userDays, window = 30, category, limit = 20 } = params
  const { data, error } = await supabase.rpc("match_events", { p_user_days: userDays, p_window: window, p_category: category ?? null, p_period: null, p_geo: null, p_limit: limit })
  if (error) throw new Error(error.message)
  return (data ?? []) as MatchEvent[]
}
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  arts: { bg: "#FBEAF0", text: "#72243E", label: "Arts & culture" },
  science: { bg: "#E6F1FB", text: "#0C447C", label: "Sciences" },
  sport: { bg: "#EAF3DE", text: "#27500A", label: "Sport" },
  pouvoir: { bg: "#FAEEDA", text: "#633806", label: "Politique" },
  exploration: { bg: "#FFF9E6", text: "#633806", label: "Exploration" },
  guerre: { bg: "#FAECE7", text: "#712B13", label: "Guerre" },
  philosophie: { bg: "#EEEDFE", text: "#3C3489", label: "Philosophie" },
  spirituel: { bg: "#E1F5EE", text: "#085041", label: "Spirituel" },
}
export function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "#F1EFE8", text: "#444441", label: category }
}
