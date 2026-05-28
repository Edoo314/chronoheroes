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
    # Mahatma Gandhi (1869-10-02)
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1888-09-04", "Part étudier le droit à Londres — première confrontation avec la civilisation occidentale", "pouvoir", "formation", 4),
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1893-06-07", "Expulsé d'un train en Afrique du Sud malgré son billet de 1ère classe — nuit fondatrice de son engagement", "pouvoir", "engagement", 5),
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1906-09-11", "Lance la première campagne de désobéissance civile non-violente à Johannesburg", "pouvoir", "engagement", 5),
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1919-04-06", "Lance le hartal national contre la loi Rowlatt — grève générale en Inde, réprimée dans le sang", "pouvoir", "engagement", 5),
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1930-03-12", "Marche du sel — 390 km à pied pour défier le monopole britannique sur le sel", "pouvoir", "engagement", 5),
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1942-08-08", "Lance le mouvement Quit India — emprisonné, la résistance s'embrase dans tout le pays", "pouvoir", "engagement", 5),
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1947-08-15", "L'Inde accède à l'indépendance — Gandhi jeûne pour stopper les violences entre hindous et musulmans", "pouvoir", "victoire", 5),
    ("16a4b26b-6899-4d5b-843e-08611edf7e2b", "Mahatma Gandhi", "1869-10-02", "1948-01-30", "Assassiné à New Delhi à 78 ans — tué par un extrémiste hindou lors d'une prière", "pouvoir", "mort", 5),
    # John F. Kennedy (1917-05-29)
    ("03673c51-67f8-400d-bb3e-a0a1ee38d6af", "John F. Kennedy", "1917-05-29", "1943-08-02", "Son torpilleur PT-109 coulé au Pacifique — sauve ses hommes en nageant des heures malgré le dos blessé", "pouvoir", "exploit", 5),
    ("03673c51-67f8-400d-bb3e-a0a1ee38d6af", "John F. Kennedy", "1917-05-29", "1953-09-12", "Épouse Jacqueline Bouvier — mariage du siècle, 700 invités, couverture mondiale", "pouvoir", "vie-privee", 4),
    ("03673c51-67f8-400d-bb3e-a0a1ee38d6af", "John F. Kennedy", "1917-05-29", "1960-11-08", "Élu président des États-Unis à 43 ans — le plus jeune et premier catholique élu", "pouvoir", "election", 5),
    ("03673c51-67f8-400d-bb3e-a0a1ee38d6af", "John F. Kennedy", "1917-05-29", "1961-04-17", "Fiasco de la Baie des Cochons — invasion de Cuba ratée, humiliation internationale", "pouvoir", "echec", 5),
    ("03673c51-67f8-400d-bb3e-a0a1ee38d6af", "John F. Kennedy", "1917-05-29", "1962-10-22", "Annonce le blocus de Cuba à la télévision — 13 jours au bord de la guerre nucléaire", "pouvoir", "discours", 5),
    ("03673c51-67f8-400d-bb3e-a0a1ee38d6af", "John F. Kennedy", "1917-05-29", "1963-06-26", "Discours Ich bin ein Berliner devant 450 000 personnes à Berlin-Ouest", "pouvoir", "discours", 5),
    ("03673c51-67f8-400d-bb3e-a0a1ee38d6af", "John F. Kennedy", "1917-05-29", "1963-11-22", "Assassiné à Dallas à 46 ans — Lee Harvey Oswald arrêté, tué deux jours plus tard", "pouvoir", "mort", 5),
    # Winston Churchill (1874-11-30)
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1899-10-15", "Correspondant de guerre en Afrique du Sud — capturé par les Boers, s'échappe spectaculairement", "pouvoir", "exploit", 5),
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1911-10-23", "Nommé Premier Lord de l'Amirauté — modernise la marine royale britannique", "pouvoir", "nomination", 4),
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1915-04-25", "Désastre de Gallipoli — sa stratégie coûte 250 000 vies, il démissionne en disgrâce", "pouvoir", "echec", 5),
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1940-05-13", "Premier discours comme Premier ministre — je n'ai rien d'autre à offrir que du sang, du labeur, des larmes et de la sueur", "pouvoir", "discours", 5),
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1940-08-20", "Discours sur la RAF — jamais dans l'histoire des conflits humains autant de gens ne doivent autant à si peu", "pouvoir", "discours", 5),
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1945-07-26", "Battu aux élections après la victoire — évincé par les travaillistes malgré avoir sauvé l'Angleterre", "pouvoir", "chute", 5),
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1953-11-03", "Reçoit le prix Nobel de Littérature — pour ses Mémoires de guerre et son histoire de la Seconde Guerre", "arts", "prix", 5),
    ("2b5e4f57-bc67-44e0-b0da-9752f7dcd4d2", "Winston Churchill", "1874-11-30", "1965-01-24", "Meurt à Londres à 90 ans — funérailles d'État, dernier grand chef de guerre de l'ère impériale", "pouvoir", "mort", 5),
    # Franklin D. Roosevelt (1882-01-30)
    ("65cfb146-2bab-4953-abb4-d88c5a9a97cb", "Franklin D. Roosevelt", "1882-01-30", "1910-11-08", "Élu sénateur de New York à 28 ans — début d'une carrière politique fulgurante", "pouvoir", "election", 4),
    ("65cfb146-2bab-4953-abb4-d88c5a9a97cb", "Franklin D. Roosevelt", "1882-01-30", "1921-08-10", "Contracte la polio à 39 ans — paralysé des deux jambes, refuse d'abandonner la politique", "pouvoir", "vie-privee", 5),
    ("65cfb146-2bab-4953-abb4-d88c5a9a97cb", "Franklin D. Roosevelt", "1882-01-30", "1933-03-04", "Élu président en pleine Grande Dépression — 25% de chômage, lance le New Deal", "pouvoir", "election", 5),
    ("65cfb146-2bab-4953-abb4-d88c5a9a97cb", "Franklin D. Roosevelt", "1882-01-30", "1941-12-08", "Discours de l'infamie après Pearl Harbor — engage les États-Unis dans la guerre", "pouvoir", "discours", 5),
    ("65cfb146-2bab-4953-abb4-d88c5a9a97cb", "Franklin D. Roosevelt", "1882-01-30", "1944-06-06", "Coordonne le débarquement en Normandie depuis Washington — opération la plus complexe de l'histoire", "pouvoir", "exploit", 5),
    ("65cfb146-2bab-4953-abb4-d88c5a9a97cb", "Franklin D. Roosevelt", "1882-01-30", "1945-04-12", "Meurt à 63 ans d'une hémorragie cérébrale — à 83 jours de la fin de la guerre", "pouvoir", "mort", 5),
    # Lénine (1870-04-22)
    ("c4732aec-3588-4504-86bb-2452cf09cd6d", "Lénine", "1870-04-22", "1895-12-21", "Arrêté pour activités révolutionnaires à Saint-Pétersbourg — premier exil en Sibérie", "pouvoir", "emprisonnement", 4),
    ("c4732aec-3588-4504-86bb-2452cf09cd6d", "Lénine", "1870-04-22", "1903-07-30", "Fonde le Parti bolchevique lors du 2e congrès — scission du mouvement socialiste russe", "pouvoir", "creation", 5),
    ("c4732aec-3588-4504-86bb-2452cf09cd6d", "Lénine", "1870-04-22", "1917-04-16", "Retour en Russie dans le wagon plombé — les Allemands l'ont laissé passer pour déstabiliser la Russie", "pouvoir", "retour", 5),
    ("c4732aec-3588-4504-86bb-2452cf09cd6d", "Lénine", "1870-04-22", "1917-11-07", "Dirige la révolution d'Octobre — prise du Palais d'Hiver, naissance de l'URSS", "pouvoir", "exploit", 5),
    ("c4732aec-3588-4504-86bb-2452cf09cd6d", "Lénine", "1870-04-22", "1918-08-30", "Blessé par deux balles lors d'un attentat — survit, lance la Terreur rouge", "pouvoir", "vie-privee", 5),
    ("c4732aec-3588-4504-86bb-2452cf09cd6d", "Lénine", "1870-04-22", "1922-05-26", "Premier AVC — commence à perdre ses capacités, s'inquiète du pouvoir de Staline", "pouvoir", "vie-privee", 4),
    ("c4732aec-3588-4504-86bb-2452cf09cd6d", "Lénine", "1870-04-22", "1924-01-21", "Meurt à 53 ans d'une hémorragie cérébrale — son corps embaumé exposé au mausolée de la Place Rouge", "pouvoir", "mort", 5),
    # Mao Zedong (1893-12-26)
    ("56225300-a590-4a35-a088-0da5c38556fa", "Mao Zedong", "1893-12-26", "1921-07-23", "Participe à la fondation du Parti communiste chinois à Shanghai — l'un des 13 fondateurs", "pouvoir", "creation", 5),
    ("56225300-a590-4a35-a088-0da5c38556fa", "Mao Zedong", "1893-12-26", "1934-10-16", "Lance la Longue Marche — 12 500 km à pied, 100 000 soldats partent, 8 000 arrivent", "pouvoir", "exploit", 5),
    ("56225300-a590-4a35-a088-0da5c38556fa", "Mao Zedong", "1893-12-26", "1949-10-01", "Proclame la République populaire de Chine depuis Pékin — fin de la guerre civile", "pouvoir", "victoire", 5),
    ("56225300-a590-4a35-a088-0da5c38556fa", "Mao Zedong", "1893-12-26", "1958-01-01", "Lance le Grand Bond en avant — collectivisation forcée, 15 à 55 millions de morts de famine", "pouvoir", "decision", 5),
    ("56225300-a590-4a35-a088-0da5c38556fa", "Mao Zedong", "1893-12-26", "1966-05-16", "Lance la Révolution culturelle — 10 ans de chaos, destruction du patrimoine, millions de victimes", "pouvoir", "decision", 5),
    ("56225300-a590-4a35-a088-0da5c38556fa", "Mao Zedong", "1893-12-26", "1972-02-21", "Reçoit Nixon à Pékin — rapprochement sino-américain, choc géopolitique mondial", "pouvoir", "exploit", 5),
    ("56225300-a590-4a35-a088-0da5c38556fa", "Mao Zedong", "1893-12-26", "1976-09-09", "Meurt à 82 ans à Pékin — son bilan reste l'un des plus controversés de l'histoire", "pouvoir", "mort", 5),
    # Otto von Bismarck (1815-04-01)
    ("b870f510-f0d2-4675-ac3c-abec2663506a", "Otto von Bismarck", "1815-04-01", "1847-08-11", "Élu au Parlement prussien — commence sa carrière politique à 32 ans", "pouvoir", "election", 4),
    ("b870f510-f0d2-4675-ac3c-abec2663506a", "Otto von Bismarck", "1815-04-01", "1862-09-23", "Nommé Premier ministre de Prusse par Guillaume Ier — le fer et le sang comme politique", "pouvoir", "nomination", 5),
    ("b870f510-f0d2-4675-ac3c-abec2663506a", "Otto von Bismarck", "1815-04-01", "1866-07-03", "Victoire de Sadowa contre l'Autriche — la Prusse domine l'Allemagne du Nord", "pouvoir", "victoire", 5),
    ("b870f510-f0d2-4675-ac3c-abec2663506a", "Otto von Bismarck", "1815-04-01", "1871-01-18", "Proclame l'Empire allemand à Versailles — unification de l'Allemagne, il devient chancelier", "pouvoir", "victoire", 5),
    ("b870f510-f0d2-4675-ac3c-abec2663506a", "Otto von Bismarck", "1815-04-01", "1883-06-15", "Instaure l'assurance maladie obligatoire — première protection sociale au monde", "pouvoir", "loi", 5),
    ("b870f510-f0d2-4675-ac3c-abec2663506a", "Otto von Bismarck", "1815-04-01", "1890-03-18", "Forcé de démissionner par Guillaume II — le pilote est mis à terre, fin d'une ère", "pouvoir", "chute", 5),
    ("b870f510-f0d2-4675-ac3c-abec2663506a", "Otto von Bismarck", "1815-04-01", "1898-07-30", "Meurt à 83 ans à Friedrichsruh — le plus grand stratège politique du 19e siècle", "pouvoir", "mort", 5),
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
