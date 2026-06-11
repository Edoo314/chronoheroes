import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function formatDate(raw: string): string {
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
  const parts = raw.split('-')
  return parts[2].replace(/^0/, '') + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0]
}

function ordinal(n: number): string {
  return n === 1 ? '1er' : n + 'e'
}

function heroCard(e: any): string {
  const dateLabel = formatDate(e.event_date_raw)
  const imgHtml = e.image_url
    ? `<img src="${e.image_url}" alt="${e.person_name}" width="56" height="56"
         style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex-shrink:0;" />`
    : `<div style="width:56px;height:56px;border-radius:50%;background:#e8e6e0;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;font-weight:700;color:#6b6a65;">
         ${e.person_name.split(' ').slice(0,2).map((w: string) => w[0]).join('').toUpperCase()}
       </div>`

  return `
    <div style="background:#f5f3ee;border-radius:12px;padding:16px;margin-bottom:12px;">
      <div style="display:flex;align-items:flex-start;gap:14px;">
        ${imgHtml}
        <div style="flex:1;min-width:0;">
          <div style="font-size:15px;font-weight:700;color:#1a1916;margin-bottom:2px;">${e.person_name}</div>
          <div style="font-size:12px;color:#b8860b;font-weight:600;margin-bottom:8px;">${e.age_label}</div>
          <div style="font-size:14px;color:#1a1916;line-height:1.6;margin-bottom:10px;">${e.description_fr}</div>
          <div style="font-size:11px;color:#a8a79f;text-align:right;">${dateLabel}</div>
        </div>
      </div>
    </div>`
}

function buildAlertEmail(prenom: string, userDays: number, events: any[]): string {
  const first = events[0]
  const rest  = events.slice(1)
  const dateLabel = formatDate(first.event_date_raw)
  const ordDay = ordinal(userDays)

  const imgBlock = first.image_url
    ? `<img src="${first.image_url}" alt="${first.person_name}"
         style="width:90px;height:90px;border-radius:50%;object-fit:cover;
                border:3px solid #b8860b;display:block;margin:0 auto 16px;" />`
    : ''

  const otherCards = rest.length > 0
    ? `<p style="font-size:13px;color:#6b6a65;margin:24px 0 12px;font-weight:600;">
         Autres coïncidences de ce jour :
       </p>
       ${rest.map(heroCard).join('')}`
    : ''

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;">

  <!-- Header -->
  <div style="background:#1a1916;padding:24px 28px;border-radius:12px 12px 0 0;">
    <div style="font-size:11px;color:#b8860b;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">
      Votre perspective historique
    </div>
    <div style="font-size:20px;font-weight:700;color:#ffffff;line-height:1.4;">
      Aujourd'hui vous avez l'âge exact de ${first.person_name} lors d'un événement déterminant de sa vie.
    </div>
  </div>

  <!-- Corps -->
  <div style="background:#ffffff;padding:28px;border-radius:0 0 12px 12px;
              border:0.5px solid #e8e6e0;border-top:none;">

    <!-- Événement principal -->
    <div style="background:#f5f3ee;border-radius:14px;padding:24px;margin-bottom:20px;text-align:center;">
      ${imgBlock}
      <div style="font-size:13px;color:#6b6a65;margin-bottom:6px;">
        Vous avez précisément l'âge de
      </div>
      <div style="font-size:22px;font-weight:700;color:#1a1916;margin-bottom:4px;">
        ${first.person_name}
      </div>
      <div style="font-size:13px;color:#b8860b;font-weight:600;margin-bottom:16px;">
        ${first.age_label}
      </div>
      <div style="font-size:16px;color:#1a1916;line-height:1.65;margin-bottom:16px;
                  font-style:italic;">
        "${first.description_fr}"
      </div>
      <div style="font-size:12px;color:#a8a79f;">
        ${dateLabel}
      </div>
    </div>

    <!-- Texte intro -->
    <p style="font-size:14px;color:#6b6a65;margin:0 0 20px;line-height:1.7;">
      Aujourd'hui vous vivez votre <strong style="color:#1a1916;">${ordDay} jour</strong>.
      Découvrez ce qu'ont fait vos alter-ego au même âge précisément.
    </p>

    <!-- CTA -->
    <a href="https://chronoheroes.com?prenom=${encodeURIComponent(prenom)}"
       style="display:block;background:#1a1916;color:#ffffff;padding:14px 24px;
              border-radius:99px;text-decoration:none;font-size:15px;font-weight:600;
              text-align:center;margin-bottom:8px;">
      Découvrir tous mes héros du jour →
    </a>

    ${otherCards}

    <!-- Footer -->
    <p style="font-size:11px;color:#a8a79f;margin-top:28px;text-align:center;line-height:1.8;">
      Vous recevez cet email car une coïncidence exacte a été détectée.<br>
      <a href="mailto:hero@chronoheroes.com?subject=Désabonnement"
         style="color:#b8860b;text-decoration:none;">Se désabonner</a>
      · © 2026 ChronoHeroes
    </p>
  </div>
</div>`
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
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
      return NextResponse.json({ message: 'Aucun abonné', sent: 0 })
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

      const { data: events } = await supabase.rpc('match_events', {
        p_user_days: userDays,
        p_window: 0,
        p_category: null,
        p_period: null,
        p_geo: null,
        p_limit: 5
      })

      if (!events || events.length === 0) continue

      const html = buildAlertEmail(sub.prenom, userDays, events)

      await resend.emails.send({
        from: 'ChronoHeroes <hero@chronoheroes.com>',
        to: sub.email,
        subject: `${sub.prenom}, vous avez l'âge exact de ${events[0].person_name} lors d'un événement déterminant`,
        html,
      })

      sent++
    }

    return NextResponse.json({ message: 'Cron terminé', sent, total: subscribers.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
