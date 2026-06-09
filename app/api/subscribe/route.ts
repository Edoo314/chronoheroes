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

function buildWelcomeEmail(prenom: string, userDays: number, firstEvent: any | null): string {
  const ordDay = ordinal(userDays)

  const eventBlock = firstEvent ? (() => {
    const dateLabel = formatDate(firstEvent.event_date_raw)
    const imgBlock = firstEvent.image_url
      ? `<img src="${firstEvent.image_url}" alt="${firstEvent.person_name}"
           style="width:80px;height:80px;border-radius:50%;object-fit:cover;
                  border:3px solid #b8860b;display:block;margin:0 auto 14px;" />`
      : ''
    return `
      <div style="background:#f5f3ee;border-radius:14px;padding:22px;margin:20px 0;text-align:center;">
        <div style="font-size:12px;color:#6b6a65;margin-bottom:10px;">
          Une coïncidence aujourd'hui même :
        </div>
        ${imgBlock}
        <div style="font-size:20px;font-weight:700;color:#1a1916;margin-bottom:4px;">
          ${firstEvent.person_name}
        </div>
        <div style="font-size:12px;color:#b8860b;font-weight:600;margin-bottom:14px;">
          ${firstEvent.age_label}
        </div>
        <div style="font-size:15px;color:#1a1916;line-height:1.65;font-style:italic;margin-bottom:12px;">
          "${firstEvent.description_fr}"
        </div>
        <div style="font-size:11px;color:#a8a79f;">${dateLabel}</div>
      </div>`
  })() : ''

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;">

  <!-- Header -->
  <div style="background:#1a1916;padding:24px 28px;border-radius:12px 12px 0 0;">
    <div style="font-size:11px;color:#b8860b;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;">
      Bienvenue sur ChronoHeroes
    </div>
    <div style="font-size:18px;font-weight:700;color:#ffffff;line-height:1.5;">
      Chaque jour, découvrez les personnalités<br>qui ont fait l'Histoire.
    </div>
  </div>

  <!-- Corps -->
  <div style="background:#ffffff;padding:28px;border-radius:0 0 12px 12px;
              border:0.5px solid #e8e6e0;border-top:none;">

    <p style="font-size:15px;color:#6b6a65;line-height:1.75;margin:0 0 10px;">
      Bonjour <strong style="color:#1a1916;">${prenom}</strong>, vous êtes inscrit à ChronoHeroes.
    </p>
    <p style="font-size:15px;color:#6b6a65;line-height:1.75;margin:0 0 20px;">
      Vous recevrez un email <strong style="color:#1a1916;">uniquement lorsqu'une coïncidence exacte
      est détectée</strong> avec votre âge au jour près.
    </p>
    <p style="font-size:15px;color:#6b6a65;line-height:1.75;margin:0 0 20px;">
      Votre âge aujourd'hui : <strong style="color:#1a1916;">${ordDay} jour</strong>
    </p>

    ${eventBlock}

    <a href="https://chronoheroes.com?prenom=${encodeURIComponent(prenom)}"
       style="display:block;background:#1a1916;color:#ffffff;padding:14px 24px;
              border-radius:99px;text-decoration:none;font-size:15px;font-weight:600;
              text-align:center;margin-top:8px;">
      Voir mes héros du jour →
    </a>

    <p style="font-size:11px;color:#a8a79f;margin-top:24px;text-align:center;line-height:1.8;">
      <a href="mailto:hero@chronoheroes.com?subject=Désabonnement"
         style="color:#b8860b;text-decoration:none;">Se désabonner</a>
      · © 2026 ChronoHeroes
    </p>
  </div>
</div>`
}

export async function POST(req: NextRequest) {
  try {
    const { email, prenom, birthdate, userDays } = await req.json()

    if (!email || !prenom || !birthdate || !userDays) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const { error } = await supabase
      .from('subscribers')
      .upsert({ email, prenom, birthdate, user_days: userDays, confirmed: true }, { onConflict: 'email' })

    if (error) throw error

    // Chercher un événement du jour pour personnaliser le welcome
    let firstEvent: any = null
    try {
      const { data: events } = await supabase.rpc('match_events', {
        p_user_days: userDays,
        p_window: 0,
        p_category: null,
        p_period: null,
        p_geo: null,
        p_limit: 1
      })
      if (events && events.length > 0) firstEvent = events[0]
    } catch {
      // Pas grave si pas d'événement exact aujourd'hui
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const subject = firstEvent
      ? `Bienvenue sur ChronoHeroes — vous avez l'âge exact de ${firstEvent.person_name} !`
      : `Bienvenue sur ChronoHeroes — votre ${ordinal(userDays)}e jour`

    await resend.emails.send({
      from: 'ChronoHeroes <hero@chronoheroes.com>',
      to: email,
      subject,
      html: buildWelcomeEmail(prenom, userDays, firstEvent),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
