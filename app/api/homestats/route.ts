import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const [{ count: persons }, { count: events }, { data: examples }] = await Promise.all([
    supabase.from('persons').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('description_fr, person_name, age_label, persons(image_url)').order('person_age_days').range(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500) + 19),
  ])
  return NextResponse.json({ persons, events, examples: examples ?? [] })
}