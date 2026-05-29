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
    # Aung San Suu Kyi (1945-06-19)
    ("4d35e6cb-ea51-4a7c-af4d-4f23f8830518", "Aung San Suu Kyi", "1945-06-19", "1988-08-26", "Retourne en Birmanie pour soigner sa mère — découvre la répression militaire, bascule vers la résistance", "pouvoir", "engagement", 5),
    ("4d35e6cb-ea51-4a7c-af4d-4f23f8830518", "Aung San Suu Kyi", "1945-06-19", "1989-07-20", "Assignée à résidence par la junte militaire — refuse de quitter le pays malgré la liberté offerte", "pouvoir", "emprisonnement", 5),
    ("4d35e6cb-ea51-4a7c-af4d-4f23f8830518", "Aung San Suu Kyi", "1945-06-19", "1991-10-14", "Reçoit le prix Nobel de la Paix en son absence — assignée à résidence, son fils récupère le prix", "pouvoir", "prix", 5),
    ("4d35e6cb-ea51-4a7c-af4d-4f23f8830518", "Aung San Suu Kyi", "1945-06-19", "2010-11-13", "Libérée après 15 ans de détention — sort de sa maison au bord du lac Inya sous les acclamations", "pouvoir", "liberation", 5),
    ("4d35e6cb-ea51-4a7c-af4d-4f23f8830518", "Aung San Suu Kyi", "1945-06-19", "2021-02-01", "Arrêtée lors du coup d'état militaire à 75 ans — condamnée à 27 ans de prison", "pouvoir", "emprisonnement", 5),

    # Samuel Beckett (1906-04-13)
    ("0886bac6-934d-4a79-89ec-5de505d8151d", "Samuel Beckett", "1906-04-13", "1928-01-01", "Rencontre James Joyce à Paris — devient son secrétaire et disciple", "arts", "rencontre", 5),
    ("0886bac6-934d-4a79-89ec-5de505d8151d", "Samuel Beckett", "1906-04-13", "1938-01-07", "Poignardé dans la rue par un inconnu à Paris — survit, continue d'écrire", "arts", "vie-privee", 4),
    ("0886bac6-934d-4a79-89ec-5de505d8151d", "Samuel Beckett", "1906-04-13", "1953-01-05", "En attendant Godot créé à Paris — scandale et triomphe, révolution du théâtre mondial", "arts", "creation", 5),
    ("0886bac6-934d-4a79-89ec-5de505d8151d", "Samuel Beckett", "1906-04-13", "1969-10-23", "Reçoit le prix Nobel de Littérature — apprend la nouvelle dans un taxi, le trouve embarrassant", "arts", "prix", 5),
    ("0886bac6-934d-4a79-89ec-5de505d8151d", "Samuel Beckett", "1906-04-13", "1989-12-22", "Meurt à Paris à 83 ans — enterré au cimetière du Montparnasse avec Suzanne", "arts", "mort", 5),

    # Pablo Neruda (1904-07-12)
    ("13c41fee-4a40-4190-8037-55187c409237", "Pablo Neruda", "1904-07-12", "1924-06-01", "Publie Vingt poèmes d'amour à 19 ans — best-seller de poésie, traduit en 35 langues", "arts", "publication", 5),
    ("13c41fee-4a40-4190-8037-55187c409237", "Pablo Neruda", "1904-07-12", "1936-07-18", "Consul du Chili en Espagne — témoin de la guerre civile, engagement politique total", "pouvoir", "engagement", 5),
    ("13c41fee-4a40-4190-8037-55187c409237", "Pablo Neruda", "1904-07-12", "1950-01-01", "Publie le Chant Général — épopée de l'Amérique latine, chef-d'oeuvre universel", "arts", "publication", 5),
    ("13c41fee-4a40-4190-8037-55187c409237", "Pablo Neruda", "1904-07-12", "1971-10-21", "Reçoit le prix Nobel de Littérature — discours sur la poésie comme acte politique", "arts", "prix", 5),
    ("13c41fee-4a40-4190-8037-55187c409237", "Pablo Neruda", "1904-07-12", "1973-09-23", "Meurt à 69 ans à Santiago — 12 jours après le coup d'état de Pinochet contre Allende", "arts", "mort", 5),

    # Alexandre Soljenitsyne (1918-12-11)
    ("43e60f2f-243d-4541-80b1-4544c6c312f4", "Alexandre Soljenitsyne", "1918-12-11", "1945-02-09", "Arrêté par le NKVD à 26 ans — une lettre critique sur Staline interceptée, 8 ans de Goulag", "arts", "emprisonnement", 5),
    ("43e60f2f-243d-4541-80b1-4544c6c312f4", "Alexandre Soljenitsyne", "1918-12-11", "1962-11-18", "Publie Une journée d'Ivan Denissovitch — premier récit du Goulag autorisé par Khrouchtchev", "arts", "publication", 5),
    ("43e60f2f-243d-4541-80b1-4544c6c312f4", "Alexandre Soljenitsyne", "1918-12-11", "1970-10-08", "Reçoit le prix Nobel de Littérature — refuse d'aller chercher le prix, craint de ne plus rentrer", "arts", "prix", 5),
    ("43e60f2f-243d-4541-80b1-4544c6c312f4", "Alexandre Soljenitsyne", "1918-12-11", "1974-02-13", "Expulsé d'URSS — L'Archipel du Goulag publié en Occident, coup fatal au mythe soviétique", "arts", "exil", 5),
    ("43e60f2f-243d-4541-80b1-4544c6c312f4", "Alexandre Soljenitsyne", "1918-12-11", "1994-05-27", "Retour triomphal en Russie après 20 ans d'exil — traverse le pays en train de Vladivostok à Moscou", "arts", "retour", 5),
    ("43e60f2f-243d-4541-80b1-4544c6c312f4", "Alexandre Soljenitsyne", "1918-12-11", "2008-08-03", "Meurt à Moscou à 89 ans — l'homme qui a contribué à faire tomber l'URSS", "arts", "mort", 5),

    # Naguib Mahfouz (1911-12-11)
    ("b7721aeb-212b-44fd-a154-e80842112d34", "Naguib Mahfouz", "1911-12-11", "1956-12-01", "Publie la Trilogie du Caire — chef-d'oeuvre de la littérature arabe moderne", "arts", "publication", 5),
    ("b7721aeb-212b-44fd-a154-e80842112d34", "Naguib Mahfouz", "1911-12-11", "1988-10-13", "Reçoit le prix Nobel de Littérature — premier auteur arabophone nobélisé", "arts", "prix", 5),
    ("b7721aeb-212b-44fd-a154-e80842112d34", "Naguib Mahfouz", "1911-12-11", "1994-10-14", "Poignardé au cou par un islamiste à 82 ans — survit mais perd l'usage de sa main droite", "arts", "vie-privee", 5),
    ("b7721aeb-212b-44fd-a154-e80842112d34", "Naguib Mahfouz", "1911-12-11", "2006-08-30", "Meurt au Caire à 94 ans — 34 romans, la mémoire vivante de l'Égypte moderne", "arts", "mort", 5),

    # Richard Feynman (1918-05-11)
    ("184a03e9-fc63-4be6-aa20-3a5df7c72cb8", "Richard Feynman", "1918-05-11", "1943-06-01", "Rejoint le projet Manhattan à Los Alamos — passe son temps à crocheter les coffres-forts des scientifiques", "science", "debut", 4),
    ("184a03e9-fc63-4be6-aa20-3a5df7c72cb8", "Richard Feynman", "1918-05-11", "1948-03-01", "Développe l'électrodynamique quantique — les diagrammes de Feynman révolutionnent la physique", "science", "decouverte", 5),
    ("184a03e9-fc63-4be6-aa20-3a5df7c72cb8", "Richard Feynman", "1918-05-11", "1965-10-21", "Reçoit le prix Nobel de Physique — le professeur le plus aimé de Caltech", "science", "prix", 5),
    ("184a03e9-fc63-4be6-aa20-3a5df7c72cb8", "Richard Feynman", "1918-05-11", "1986-02-11", "Démontre la défaillance du joint torique de Challenger — anneau de caoutchouc dans un verre d'eau glacée", "science", "exploit", 5),
    ("184a03e9-fc63-4be6-aa20-3a5df7c72cb8", "Richard Feynman", "1918-05-11", "1988-02-15", "Meurt à Los Angeles à 69 ans — ses Cours de physique restent la référence mondiale", "science", "mort", 5),

    # Linus Pauling (1901-02-28)
    ("554a09ca-030a-4d1b-be50-28e678a4260f", "Linus Pauling", "1901-02-28", "1931-01-01", "Publie ses règles sur la structure des cristaux — révolutionne la chimie structurale", "science", "decouverte", 5),
    ("554a09ca-030a-4d1b-be50-28e678a4260f", "Linus Pauling", "1901-02-28", "1951-03-01", "Découvre la structure en hélice des protéines — avant Watson et Crick pour l'ADN", "science", "decouverte", 5),
    ("554a09ca-030a-4d1b-be50-28e678a4260f", "Linus Pauling", "1901-02-28", "1954-12-10", "Reçoit le Nobel de Chimie — pour sa découverte de la nature des liaisons chimiques", "science", "prix", 5),
    ("554a09ca-030a-4d1b-be50-28e678a4260f", "Linus Pauling", "1901-02-28", "1962-10-10", "Reçoit le Nobel de la Paix — pour son combat contre les essais nucléaires, seul double Nobel", "pouvoir", "prix", 5),
    ("554a09ca-030a-4d1b-be50-28e678a4260f", "Linus Pauling", "1901-02-28", "1994-08-19", "Meurt à 93 ans en Californie — deux prix Nobel dans des domaines totalement différents", "science", "mort", 5),

    # Jimmy Carter (1924-10-01)
    ("80abad43-6f1e-49f8-832b-c81544694a38", "Jimmy Carter", "1924-10-01", "1976-11-02", "Élu président des États-Unis — gouverneur de Géorgie inconnu bat Gerald Ford", "pouvoir", "election", 5),
    ("80abad43-6f1e-49f8-832b-c81544694a38", "Jimmy Carter", "1924-10-01", "1978-09-17", "Accords de Camp David — première paix entre Israël et un pays arabe, l'Égypte", "pouvoir", "victoire", 5),
    ("80abad43-6f1e-49f8-832b-c81544694a38", "Jimmy Carter", "1924-10-01", "1980-11-04", "Battu par Reagan — otages en Iran, crise économique, un seul mandat", "pouvoir", "chute", 5),
    ("80abad43-6f1e-49f8-832b-c81544694a38", "Jimmy Carter", "1924-10-01", "1984-06-01", "Fonde Habitat pour l'Humanité — construit lui-même des maisons pour les pauvres", "pouvoir", "engagement", 5),
    ("80abad43-6f1e-49f8-832b-c81544694a38", "Jimmy Carter", "1924-10-01", "2002-10-11", "Reçoit le prix Nobel de la Paix à 78 ans — pour ses décennies de diplomatie et d'action humanitaire", "pouvoir", "prix", 5),
    ("80abad43-6f1e-49f8-832b-c81544694a38", "Jimmy Carter", "1924-10-01", "2024-12-29", "Meurt à 100 ans — le président américain le plus âgé de l'histoire", "pouvoir", "mort", 5),

    # Francis Crick (1916-06-08)
    ("671bed1b-0812-47e0-a2b2-e07c0a5de51b", "Francis Crick", "1916-06-08", "1951-01-01", "Rejoint le Cavendish Laboratory de Cambridge — commence à travailler sur la structure de l'ADN", "science", "debut", 4),
    ("671bed1b-0812-47e0-a2b2-e07c0a5de51b", "Francis Crick", "1916-06-08", "1953-04-25", "Publie la double hélice de l'ADN avec Watson — en utilisant la Photo 51 de Rosalind Franklin", "science", "decouverte", 5),
    ("671bed1b-0812-47e0-a2b2-e07c0a5de51b", "Francis Crick", "1916-06-08", "1962-10-18", "Reçoit le Nobel de Médecine avec Watson et Wilkins — Franklin est décédée 4 ans plus tôt", "science", "prix", 5),
    ("671bed1b-0812-47e0-a2b2-e07c0a5de51b", "Francis Crick", "1916-06-08", "1976-09-01", "Rejoint le Salk Institute — se consacre aux neurosciences et à la conscience", "science", "nomination", 4),
    ("671bed1b-0812-47e0-a2b2-e07c0a5de51b", "Francis Crick", "1916-06-08", "2004-07-28", "Meurt à San Diego à 88 ans — travaillait encore sur un article le jour de sa mort", "science", "mort", 5),

    # James Watson (1928-04-06)
    ("6e73fff1-2608-4d2c-a5d1-e6863179fe87", "James Watson", "1928-04-06", "1950-01-01", "Obtient son doctorat à 22 ans à Chicago — prodige de la biologie moléculaire", "science", "formation", 4),
    ("6e73fff1-2608-4d2c-a5d1-e6863179fe87", "James Watson", "1928-04-06", "1953-04-25", "Publie la structure en double hélice de l'ADN — révolution de la biologie", "science", "decouverte", 5),
    ("6e73fff1-2608-4d2c-a5d1-e6863179fe87", "James Watson", "1928-04-06", "1962-10-18", "Reçoit le Nobel de Médecine avec Crick et Wilkins — à 34 ans", "science", "prix", 5),
    ("6e73fff1-2608-4d2c-a5d1-e6863179fe87", "James Watson", "1928-04-06", "1988-10-01", "Dirige le projet Génome humain — cartographie complète de l'ADN humain", "science", "nomination", 5),
    ("6e73fff1-2608-4d2c-a5d1-e6863179fe87", "James Watson", "1928-04-06", "2019-01-13", "Déchu de ses titres honorifiques — propos racistes sur l'intelligence répétés à la télévision", "science", "chute", 4),
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
