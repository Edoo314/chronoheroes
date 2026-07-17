import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Route API admin — la clé service ne quitte JAMAIS le serveur.
// Le mot de passe est vérifié contre la variable d'environnement
// ADMIN_PASSWORD (sans préfixe NEXT_PUBLIC_ : côté serveur uniquement).

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD non configuré sur le serveur' },
      { status: 500 }
    )
  }

  const provided = req.headers.get('x-admin-password')
  if (!provided || provided !== adminPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const body = await req.json()

  // Action 1 : simple vérification du mot de passe (login)
  if (body.action === 'verify') {
    return NextResponse.json({ ok: true })
  }

  // Action 2 : sauvegarde des bios d'un personnage
  if (body.action === 'save_bio') {
    if (!body.person_id) {
      return NextResponse.json({ error: 'person_id manquant' }, { status: 400 })
    }
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { error } = await admin
      .from('persons')
      .update({
        bio_fr: body.bio_fr?.trim() ? body.bio_fr.trim() : null,
        bio_en: body.bio_en?.trim() ? body.bio_en.trim() : null,
      })
      .eq('id', body.person_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}
