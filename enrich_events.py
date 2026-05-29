"""
ChronoHeroes — Script d'enrichissement automatique de la base Supabase
Usage : python enrich_events.py
"""

from supabase import create_client
from datetime import date
import calendar

SUPABASE_URL = "https://geabolpfdjrclhpqxcwi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWJvbHBmZGpyY2xocHF4Y3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE1NTMyNiwiZXhwIjoyMDkzNzMxMzI2fQ.T4BsishTPZulNh9vBloSnMa6jq7cpobLgykXtCI0aW4"

def compute_age(birth_str, event_str):
    by, bm, bd = map(int, birth_str.split('-'))
    ey, em, ed = map(int, event_str.split('-'))
    birth = date(by, bm, bd)
    event = date(ey, em, ed)
    age_days = (event - birth).days
    y = ey - by
    m = em - bm
    d = ed - bd
    if d < 0:
        m -= 1
        d += calendar.monthrange(ey, em - 1 if em > 1 else 12)[1]
    if m < 0:
        y -= 1
        m += 12
    jour = 'jour' if d == 1 else 'jours'
    return age_days, y, m, d, f"{y} ans, {m} mois et {d} {jour}"

NEW_EVENTS = [
    # Michel de Montaigne (1533-02-28)
    ("877482e4-baaf-43dd-b1ba-124c85ad69a8", "Michel de Montaigne", "1533-02-28", "1557-01-01", "Rencontre Étienne de La Boétie au parlement de Bordeaux — amitié la plus célèbre de la littérature", "philosophie", "rencontre", 5),
    ("877482e4-baaf-43dd-b1ba-124c85ad69a8", "Michel de Montaigne", "1533-02-28", "1563-08-18", "Mort de La Boétie à 32 ans — deuil profond, Montaigne se retire progressivement du monde", "philosophie", "vie-privee", 5),
    ("877482e4-baaf-43dd-b1ba-124c85ad69a8", "Michel de Montaigne", "1533-02-28", "1571-02-28", "Se retire dans sa tour à 38 ans — commence à écrire les Essais, invente un genre littéraire", "arts", "creation", 5),
    ("877482e4-baaf-43dd-b1ba-124c85ad69a8", "Michel de Montaigne", "1533-02-28", "1580-03-01", "Publie les deux premiers livres des Essais — succès immédiat, voyage en Europe", "arts", "publication", 5),
    ("877482e4-baaf-43dd-b1ba-124c85ad69a8", "Michel de Montaigne", "1533-02-28", "1581-09-01", "Élu maire de Bordeaux pendant son voyage en Italie — accepte à contrecoeur", "pouvoir", "election", 4),
    ("877482e4-baaf-43dd-b1ba-124c85ad69a8", "Michel de Montaigne", "1533-02-28", "1588-06-01", "Publie le troisième livre des Essais — travail inachevé, annotera jusqu'à sa mort", "arts", "publication", 5),
    ("877482e4-baaf-43dd-b1ba-124c85ad69a8", "Michel de Montaigne", "1533-02-28", "1592-09-13", "Meurt dans son château à 59 ans — les Essais seront le livre de chevet de Pascal, Nietzsche, Flaubert", "philosophie", "mort", 5),

    # Étienne de La Boétie (1530-11-01)
    ("977c2db8-388e-47ec-99f0-4db53db417ec", "Étienne de La Boétie", "1530-11-01", "1548-01-01", "Rédige le Discours de la servitude volontaire à 18 ans — texte fondateur de la résistance au tyran", "philosophie", "publication", 5),
    ("977c2db8-388e-47ec-99f0-4db53db417ec", "Étienne de La Boétie", "1530-11-01", "1553-05-23", "Nommé conseiller au parlement de Bordeaux à 22 ans — brillante carrière juridique", "pouvoir", "nomination", 4),
    ("977c2db8-388e-47ec-99f0-4db53db417ec", "Étienne de La Boétie", "1530-11-01", "1557-01-01", "Rencontre Montaigne — parce que c'était lui, parce que c'était moi, dit Montaigne", "philosophie", "rencontre", 5),
    ("977c2db8-388e-47ec-99f0-4db53db417ec", "Étienne de La Boétie", "1530-11-01", "1563-08-18", "Meurt de la peste à 32 ans — Montaigne à son chevet, lui transmet ses manuscrits", "philosophie", "mort", 5),

    # Érasme (1466-10-28)
    ("7d2bb2f5-16f6-401a-8441-c91194796c69", "Érasme", "1466-10-28", "1495-01-01", "Étudie à Paris — entre en contact avec l'humanisme et les textes grecs anciens", "philosophie", "formation", 4),
    ("7d2bb2f5-16f6-401a-8441-c91194796c69", "Érasme", "1466-10-28", "1500-01-01", "Publie les Adages — recueil de proverbes latins et grecs, best-seller de la Renaissance", "arts", "publication", 5),
    ("7d2bb2f5-16f6-401a-8441-c91194796c69", "Érasme", "1466-10-28", "1509-06-01", "Écrit l'Éloge de la Folie en une semaine chez Thomas More — satire mordante de l'Église", "arts", "creation", 5),
    ("7d2bb2f5-16f6-401a-8441-c91194796c69", "Érasme", "1466-10-28", "1516-02-01", "Publie le Nouveau Testament grec — édition critique qui révolutionne la théologie", "philosophie", "publication", 5),
    ("7d2bb2f5-16f6-401a-8441-c91194796c69", "Érasme", "1466-10-28", "1524-09-01", "Répond à Luther sur le libre arbitre — refuse la Réforme, choisit l'unité de l'Église", "philosophie", "publication", 5),
    ("7d2bb2f5-16f6-401a-8441-c91194796c69", "Érasme", "1466-10-28", "1536-07-12", "Meurt à Bâle à 69 ans — le plus grand humaniste de la Renaissance européenne", "philosophie", "mort", 5),
]

def main():
    print("🔌 Connexion à Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    print("📋 Récupération des événements existants...")
    existing = set()
    offset = 0
    while True:
        batch = supabase.table("events").select("person_name, event_date_raw").range(offset, offset + 999).execute()
        for row in batch.data:
            existing.add((row["person_name"], row["event_date_raw"]))
        if len(batch.data) < 1000:
            break
        offset += 1000
    print(f"   → {len(existing)} événements déjà en base")

    to_insert = []
    skipped = 0
    for e in NEW_EVENTS:
        pid, pname, birth, event_date, desc, cat, subcat, imp = e
        if (pname, event_date) in existing:
            skipped += 1
            continue
        age_days, y, m, d, age_label = compute_age(birth, event_date)
        to_insert.append({
            "person_id": pid, "person_name": pname, "event_date_raw": event_date,
            "person_age_days": age_days, "age_years": y, "age_months": m,
            "age_days_rem": d, "age_label": age_label, "description_fr": desc,
            "category": cat, "subcategory": subcat, "importance": imp,
        })

    print(f"\n📊 Résumé :")
    print(f"   → {len(to_insert)} événements à insérer")
    print(f"   → {skipped} doublons ignorés")

    if not to_insert:
        print("✅ Rien à insérer.")
        return

    total = 0
    for i in range(0, len(to_insert), 50):
        batch = to_insert[i:i + 50]
        supabase.table("events").insert(batch).execute()
        total += len(batch)
        print(f"   ✅ Lot {i // 50 + 1} inséré ({len(batch)} événements)")

    print(f"\n🎉 Terminé ! {total} événements ajoutés en base.")

if __name__ == "__main__":
    main()
