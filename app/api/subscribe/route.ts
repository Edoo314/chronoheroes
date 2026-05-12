import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'ChronoHeroes <hero@chronoheroes.com>',
      to: email,
      subject: 'Votre perspective historique personnelle',
      html: '<div style="font-family:sans-serif;max-width:520px;margin:0 auto;">' +

        '<div style="background:#1a1916;padding:24px 28px;border-radius:12px 12px 0 0;">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">' +
            '<span style="font-size:15px;font-weight:700;color:#f0ede6;">ChronoHeroes</span>' +
          '</div>' +
          '<div style="font-size:11px;color:#b8860b;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;">Votre perspective historique</div>' +
          '<div style="font-size:20px;font-weight:700;color:#ffffff;line-height:1.3;">Bienvenue ' + prenom + ' !</div>' +
        '</div>' +

        '<div style="background:#ffffff;padding:28px;border-radius:0 0 12px 12px;border:0.5px solid #e8e6e0;border-top:none;">' +
          '<p style="font-size:15px;color:#6b6a65;line-height:1.75;margin:0 0 16px;">Vous êtes inscrit à ChronoHeroes. Vous recevrez un email uniquement lorsqu\'une coïncidence exacte est détectée — quand vous avez le même nombre de jours qu\'un personnage historique au moment d\'un événement marquant.</p>' +
          '<p style="font-size:15px;color:#6b6a65;line-height:1.75;margin:0 0 24px;">Votre âge aujourd\'hui : <strong style="color:#1a1916;">' + userDays + ' jours</strong></p>' +
          '<a href="https://chronoheroes.vercel.app" style="display:block;background:#1a1916;color:#ffffff;padding:13px 24px;border-radius:99px;text-decoration:none;font-size:14px;font-weight:600;text-align:center;">Voir mes héros du jour</a>' +
          '<p style="font-size:11px;color:#a8a79f;margin-top:24px;text-align:center;">© 2026 ChronoHeroes · <a href="mailto:hero@chronoheroes.com" style="color:#b8860b;text-decoration:none;">hero@chronoheroes.com</a></p>' +
        '</div>' +

      '</div>'
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
