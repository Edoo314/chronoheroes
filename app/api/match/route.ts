import { NextRequest, NextResponse } from 'next/server'
import { fetchMatchEvents } from '@/lib/supabase'
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days     = Number(searchParams.get('days'))
  const window   = Number(searchParams.get('window') ?? 30)
  const category = searchParams.get('category') ?? undefined
  const limit    = Number(searchParams.get('limit') ?? 20)
  if (!days || isNaN(days)) {
    return NextResponse.json({ error: 'Parametre days requis' }, { status: 400 })
  }
  try {
    const events = await fetchMatchEvents({ userDays: days, window, category, limit })
    return NextResponse.json({ events, total: events.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
