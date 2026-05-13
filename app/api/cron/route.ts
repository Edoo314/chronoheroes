import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const today = new Date()
    const ty = today.getFullYear()
    const tm = today.getMonth() + 1
    const td = today.getDate()

    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('*')
      .eq('confirmed', true)

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'Aucun abonne', sent: 0 })
    }

    let sent = 0

    for (const sub of subscribers) {
      const birth = new Date(sub.birthdate)
      const by = birth.getFullYear()
      const bm = birth.getMonth() + 1
      const bd = birth.getDate()
      const d1 = Date.UTC(by, bm - 1, bd)
      const d2 = Date.UTC(ty, tm - 1, td)
      const userDays = Math.floor((d2 - d1) / 86_400_000)

      const { data: events } = await supabase
        .rpc('match_events', {
          p_user_days: userDays,
          p_window: 0,
          p_category: null,
          p_period: null,
          p_geo: null,
          p_limit: 5
        })

      if (!events || events.length === 0) continue

      const eventCards = events.map((e: any) => {
        const months = ['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre']
        const parts = e.event_date_raw.split('-')
        const dateLabel = parts[2] + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
        return '<div style="background:#f5f3ee;border-radius:10px;padding:16px;margin-bottom:12px;">' +
          '<div style="font-size:14px;font-weight:600;color:#1a1916;margin-bottom:4px;">' + e.person_name + '</div>' +
          '<div style="font-size:11px;color:#a8a79f;margin-bottom:6px;">' + e.age_label + '</div>' +
          '<div style="font-size:13px;color:#1a1916;line-height:1.55;margin-bottom:8px;">' + e.description_fr + '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
            '<span style="font-size:10px;background:#FBEAF0;color:#72243E;padding:2px 8px;border-radius:99px;">' + e.category + '</span>' +
            '<span style="font-size:11px;color:#b8b6ae;">' + dateLabel + '</span>' +
          '</div>' +
        '</div>'
      }).join('')

      const firstName = events[0].person_name
      const subject = 'Votre perspective historique personnelle'
      const headline = sub.prenom + ', aujourd\'hui vous avez l\'age exact de ' + firstName + ' lors d\'un evenement historique.'

      await resend.emails.send({
        from: 'ChronoHeroes <hero@chronoheroes.com>',
        to: sub.email,
        subject,
        html: '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;">' +

          '<div style="background:#1a1916;padding:24px 28px;border-radius:12px 12px 0 0;">' +
            '<div style="font-size:11px;color:#b8860b;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;">Votre perspective historique</div>' +
            '<div style="font-size:20px;font-weight:700;color:#ffffff;line-height:1.3;">' + headline + '</div>' +
          '</div>' +

          '<div style="background:#ffffff;padding:28px;border-radius:0 0 12px 12px;border:0.5px solid #e8e6e0;border-top:none;">' +
            '<p style="font-size:13px;color:#6b6a65;margin:0 0 16px;">Ce jour vous vivez exactement <strong style="color:#1a1916;">' + userDays + ' jours</strong>, soit autant que ces personnages lors des evenements suivants :</p>' +
            eventCards +
            '<a href="https://chronoheroes.com" style="display:block;background:#1a1916;color:#ffffff;padding:13px 24px;border-radius:99px;text-decoration:none;font-size:14px;font-weight:600;text-align:center;margin-top:8px;">Voir tous mes heros du jour</a>' +
            '<p style="font-size:11px;color:#a8a79f;margin-top:24px;text-align:center;line-height:1.6;">Vous recevez cet email car une coincidence exacte a ete detectee.<br><a href="mailto:hero@chronoheroes.com" style="color:#b8860b;text-decoration:none;">Se desinscrire</a> · 2026 ChronoHeroes</p>' +
          '</div>' +

        '</div>'
      })

      sent++
    }

    return NextResponse.json({ message: 'Cron termine', sent, total: subscribers.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
