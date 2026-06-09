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
    # George Orwell (1903-06-25)
    ("7a758e3a-5825-4a22-bc2d-314d98b3be5f", "George Orwell", "1903-06-25", "1928-01-01", "Vit dans la misère à Paris comme plongeur — expérience qui donnera Dans la dèche à Paris et Londres", "arts", "vie-privee", 5),
    ("7a758e3a-5825-4a22-bc2d-314d98b3be5f", "George Orwell", "1903-06-25", "1936-12-01", "Part combattre en Espagne — blessé par balle à la gorge, dénonce le stalinisme", "pouvoir", "engagement", 5),
    ("7a758e3a-5825-4a22-bc2d-314d98b3be5f", "George Orwell", "1903-06-25", "1945-08-17", "Publie La Ferme des animaux — allégorie anti-stalinienne, refusée par 4 éditeurs", "arts", "publication", 5),
    ("7a758e3a-5825-4a22-bc2d-314d98b3be5f", "George Orwell", "1903-06-25", "1949-06-08", "Publie 1984 — Big Brother, la novlangue, chef-d'oeuvre de la dystopie mondiale", "arts", "publication", 5),
    ("7a758e3a-5825-4a22-bc2d-314d98b3be5f", "George Orwell", "1903-06-25", "1950-01-21", "Meurt à Londres à 46 ans de tuberculose — 1984 écrit depuis son lit de malade", "arts", "mort", 5),

    # Stefan Zweig (1881-11-28)
    ("2d80d413-56c8-4fd6-aaa2-ca95dd9b1195", "Stefan Zweig", "1881-11-28", "1901-01-01", "Publie ses premiers poèmes à Vienne à 19 ans — entre dans les cercles intellectuels européens", "arts", "debut", 4),
    ("2d80d413-56c8-4fd6-aaa2-ca95dd9b1195", "Stefan Zweig", "1881-11-28", "1927-01-01", "Publie Vingt-quatre heures de la vie d'une femme — maître de la nouvelle psychologique", "arts", "publication", 5),
    ("2d80d413-56c8-4fd6-aaa2-ca95dd9b1195", "Stefan Zweig", "1881-11-28", "1934-02-28", "Fuit Vienne après la montée du nazisme — exil en Angleterre puis au Brésil", "arts", "exil", 5),
    ("2d80d413-56c8-4fd6-aaa2-ca95dd9b1195", "Stefan Zweig", "1881-11-28", "1941-01-01", "Publie Le Monde d'hier — mémoires d'une Europe disparue, testament d'une civilisation", "arts", "publication", 5),
    ("2d80d413-56c8-4fd6-aaa2-ca95dd9b1195", "Stefan Zweig", "1881-11-28", "1942-02-22", "Se suicide avec sa femme à Petrópolis au Brésil à 60 ans — désespoir face à la barbarie", "arts", "mort", 5),

    # Simone Veil (1927-07-13)
    ("c64a3bd9-51fd-42a7-9354-f910e1e1137b", "Simone Veil", "1927-07-13", "1944-03-30", "Déportée à Auschwitz-Birkenau à 16 ans — survivra avec sa mère et sa soeur", "pouvoir", "emprisonnement", 5),
    ("c64a3bd9-51fd-42a7-9354-f910e1e1137b", "Simone Veil", "1927-07-13", "1974-11-26", "Discours pour la loi sur l'avortement — Je vous parle au nom des femmes, ovation puis insultes", "pouvoir", "discours", 5),
    ("c64a3bd9-51fd-42a7-9354-f910e1e1137b", "Simone Veil", "1927-07-13", "1975-01-17", "La loi Veil est adoptée — légalisation de l'avortement en France, révolution sociale", "pouvoir", "loi", 5),
    ("c64a3bd9-51fd-42a7-9354-f910e1e1137b", "Simone Veil", "1927-07-13", "1979-07-17", "Élue présidente du Parlement européen — première femme à ce poste", "pouvoir", "election", 5),
    ("c64a3bd9-51fd-42a7-9354-f910e1e1137b", "Simone Veil", "1927-07-13", "2008-03-13", "Élue à l'Académie française — reçue par son ami Jean d'Ormesson", "arts", "distinction", 5),
    ("c64a3bd9-51fd-42a7-9354-f910e1e1137b", "Simone Veil", "1927-07-13", "2017-06-30", "Meurt à Paris à 89 ans — panthéonisée avec son mari en 2018", "pouvoir", "mort", 5),

    # Max Planck (1858-04-23)
    ("958721ad-aaa6-4ba9-a0db-531f0544ce24", "Max Planck", "1858-04-23", "1900-12-14", "Présente la théorie des quanta — naissance de la mécanique quantique, révolution de la physique", "science", "decouverte", 5),
    ("958721ad-aaa6-4ba9-a0db-531f0544ce24", "Max Planck", "1858-04-23", "1918-12-10", "Reçoit le prix Nobel de Physique — pour la découverte des quanta d'énergie", "science", "prix", 5),
    ("958721ad-aaa6-4ba9-a0db-531f0544ce24", "Max Planck", "1858-04-23", "1944-02-23", "Son fils Erwin exécuté par les nazis — pour avoir participé au complot contre Hitler", "science", "vie-privee", 5),
    ("958721ad-aaa6-4ba9-a0db-531f0544ce24", "Max Planck", "1858-04-23", "1947-10-04", "Meurt à Göttingen à 89 ans — père de la physique quantique, deuil mondial des scientifiques", "science", "mort", 5),

    # Enrico Fermi (1901-09-29)
    ("b44079d2-a142-4ea1-8609-744ae05f8e54", "Enrico Fermi", "1901-09-29", "1926-01-01", "Nommé professeur de physique à Rome à 24 ans — le plus jeune professeur d'Italie", "science", "nomination", 4),
    ("b44079d2-a142-4ea1-8609-744ae05f8e54", "Enrico Fermi", "1901-09-29", "1938-12-10", "Reçoit le Nobel de Physique à Stockholm — fuit l'Italie fasciste directement depuis la cérémonie", "science", "prix", 5),
    ("b44079d2-a142-4ea1-8609-744ae05f8e54", "Enrico Fermi", "1901-09-29", "1942-12-02", "Réalise la première réaction nucléaire en chaîne à Chicago — l'ère atomique commence", "science", "exploit", 5),
    ("b44079d2-a142-4ea1-8609-744ae05f8e54", "Enrico Fermi", "1901-09-29", "1954-11-28", "Meurt à Chicago à 53 ans d'un cancer — exposé aux radiations pendant toute sa carrière", "science", "mort", 5),

    # Ernest Rutherford (1871-08-30)
    ("5590f423-3695-4400-a0e2-1979f6d2916d", "Ernest Rutherford", "1871-08-30", "1898-01-01", "Découvre les rayonnements alpha et bêta à 27 ans — fondements de la physique nucléaire", "science", "decouverte", 5),
    ("5590f423-3695-4400-a0e2-1979f6d2916d", "Ernest Rutherford", "1871-08-30", "1908-12-10", "Reçoit le Nobel de Chimie — pour ses travaux sur la désintégration des éléments", "science", "prix", 5),
    ("5590f423-3695-4400-a0e2-1979f6d2916d", "Ernest Rutherford", "1871-08-30", "1911-04-07", "Découvre le noyau atomique — l'atome est presque entièrement vide, révolution totale", "science", "decouverte", 5),
    ("5590f423-3695-4400-a0e2-1979f6d2916d", "Ernest Rutherford", "1871-08-30", "1919-01-01", "Première transmutation artificielle — transforme l'azote en oxygène, réalise le rêve des alchimistes", "science", "exploit", 5),
    ("5590f423-3695-4400-a0e2-1979f6d2916d", "Ernest Rutherford", "1871-08-30", "1937-10-19", "Meurt à Cambridge à 66 ans — père de la physique nucléaire, enterré à Westminster", "science", "mort", 5),

    # Andy Warhol (1928-08-06)
    ("84c4f48d-719f-4e1e-94f4-f70aae6522e0", "Andy Warhol", "1928-08-06", "1949-01-01", "Arrive à New York comme illustrateur — talent immédiatement reconnu par les magazines", "arts", "debut", 4),
    ("84c4f48d-719f-4e1e-94f4-f70aae6522e0", "Andy Warhol", "1928-08-06", "1962-07-09", "Exposition des boîtes de soupe Campbell — naissance officielle du Pop Art américain", "arts", "creation", 5),
    ("84c4f48d-719f-4e1e-94f4-f70aae6522e0", "Andy Warhol", "1928-08-06", "1964-01-01", "Ouvre la Factory à New York — usine à art, laboratoire de la contre-culture", "arts", "creation", 5),
    ("84c4f48d-719f-4e1e-94f4-f70aae6522e0", "Andy Warhol", "1928-08-06", "1968-06-03", "Blessé par balle par Valerie Solanas — survit miraculeusement, sa vision du monde change", "arts", "vie-privee", 5),
    ("84c4f48d-719f-4e1e-94f4-f70aae6522e0", "Andy Warhol", "1928-08-06", "1987-02-22", "Meurt à New York à 58 ans — des suites d'une opération de la vésicule biliaire", "arts", "mort", 5),

    # Jackson Pollock (1912-01-28)
    ("aad2159d-3fda-4cd6-b6b9-9ebd23190096", "Jackson Pollock", "1912-01-28", "1929-01-01", "Arrive à New York pour étudier la peinture — rencontre Thomas Hart Benton, son premier maître", "arts", "debut", 4),
    ("aad2159d-3fda-4cd6-b6b9-9ebd23190096", "Jackson Pollock", "1912-01-28", "1947-01-01", "Invente le dripping — peint en versant la peinture directement sur la toile au sol", "arts", "creation", 5),
    ("aad2159d-3fda-4cd6-b6b9-9ebd23190096", "Jackson Pollock", "1912-01-28", "1949-08-08", "Life Magazine le sacre le plus grand peintre américain vivant — célébrité soudaine", "arts", "distinction", 5),
    ("aad2159d-3fda-4cd6-b6b9-9ebd23190096", "Jackson Pollock", "1912-01-28", "1956-08-11", "Meurt dans un accident de voiture à 44 ans — ivre au volant, l'expressionnisme abstrait perd son génie", "arts", "mort", 5),

    # Marc Chagall (1887-07-07)
    ("d5c55e55-2290-4550-a8e6-5566ad53aa31", "Marc Chagall", "1887-07-07", "1910-01-01", "Arrive à Paris — La Ruche, rencontre Modigliani et Léger, découvre le cubisme", "arts", "debut", 4),
    ("d5c55e55-2290-4550-a8e6-5566ad53aa31", "Marc Chagall", "1887-07-07", "1914-06-15", "Première exposition solo à Berlin — Der Sturm, reconnaissance internationale immédiate", "arts", "distinction", 5),
    ("d5c55e55-2290-4550-a8e6-5566ad53aa31", "Marc Chagall", "1887-07-07", "1941-06-23", "Fuit la France occupée pour New York — arrêté puis libéré grâce à Varian Fry", "arts", "exil", 5),
    ("d5c55e55-2290-4550-a8e6-5566ad53aa31", "Marc Chagall", "1887-07-07", "1964-09-23", "Peint le plafond de l'Opéra de Paris — commande de Malraux, polémique et chef-d'oeuvre", "arts", "creation", 5),
    ("d5c55e55-2290-4550-a8e6-5566ad53aa31", "Marc Chagall", "1887-07-07", "1985-03-28", "Meurt à Saint-Paul-de-Vence à 97 ans — le dernier des grands maîtres du 20e siècle", "arts", "mort", 5),
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
