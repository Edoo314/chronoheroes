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
    # Thomas Edison (1847-02-11)
    ("1086fd40-bedf-4db2-9f2f-4e58552e3990", "Thomas Edison", "1847-02-11", "1862-01-01", "Sauve un enfant sur les rails — le père reconnaissant lui apprend la télégraphie", "science", "vie-privee", 4),
    ("1086fd40-bedf-4db2-9f2f-4e58552e3990", "Thomas Edison", "1847-02-11", "1877-12-01", "Invente le phonographe — première machine à enregistrer et reproduire le son", "science", "invention", 5),
    ("1086fd40-bedf-4db2-9f2f-4e58552e3990", "Thomas Edison", "1847-02-11", "1879-10-22", "Invente l'ampoule électrique pratique — après 1000 tentatives ratées", "science", "invention", 5),
    ("1086fd40-bedf-4db2-9f2f-4e58552e3990", "Thomas Edison", "1847-02-11", "1882-09-04", "Inaugure la première centrale électrique de Manhattan — allume 400 ampoules simultanément", "science", "exploit", 5),
    ("1086fd40-bedf-4db2-9f2f-4e58552e3990", "Thomas Edison", "1847-02-11", "1891-08-24", "Dépose le brevet du Kinetoscope — ancêtre du cinéma, voir des images en mouvement", "science", "invention", 5),
    ("1086fd40-bedf-4db2-9f2f-4e58552e3990", "Thomas Edison", "1847-02-11", "1931-10-18", "Meurt à 84 ans dans son laboratoire de West Orange — 1093 brevets déposés", "science", "mort", 5),

    # Alexander Graham Bell (1847-03-03)
    ("2f8f2e3a-e088-48d0-930c-f081629d7cb4", "Alexander Graham Bell", "1847-03-03", "1871-01-01", "Enseigne aux sourds-muets à Boston — sa méthode révolutionne leur éducation", "science", "debut", 4),
    ("2f8f2e3a-e088-48d0-930c-f081629d7cb4", "Alexander Graham Bell", "1847-03-03", "1876-03-10", "Invente le téléphone à 28 ans — premiers mots : Watson, venez, j'ai besoin de vous", "science", "invention", 5),
    ("2f8f2e3a-e088-48d0-930c-f081629d7cb4", "Alexander Graham Bell", "1847-03-03", "1876-06-25", "Présente le téléphone à l'Exposition universelle de Philadelphie — l'empereur du Brésil s'exclame Mon Dieu, ça parle", "science", "exploit", 5),
    ("2f8f2e3a-e088-48d0-930c-f081629d7cb4", "Alexander Graham Bell", "1847-03-03", "1880-01-01", "Invente le photophone — transmission de la voix par la lumière, ancêtre de la fibre optique", "science", "invention", 5),
    ("2f8f2e3a-e088-48d0-930c-f081629d7cb4", "Alexander Graham Bell", "1847-03-03", "1922-08-02", "Meurt à 75 ans en Nouvelle-Écosse — à ses funérailles tous les téléphones d'Amérique silencieux une minute", "science", "mort", 5),

    # James Watt (1736-01-19)
    ("7cbeb8d9-63c0-4e27-a12a-3b956ddb06f0", "James Watt", "1736-01-19", "1763-01-01", "Répare une machine à vapeur de Newcomen — comprend ses inefficacités fondamentales", "science", "decouverte", 5),
    ("7cbeb8d9-63c0-4e27-a12a-3b956ddb06f0", "James Watt", "1736-01-19", "1769-01-05", "Dépose le brevet de sa machine à vapeur améliorée — condenseur séparé, révolution industrielle", "science", "invention", 5),
    ("7cbeb8d9-63c0-4e27-a12a-3b956ddb06f0", "James Watt", "1736-01-19", "1775-06-01", "S'associe avec Matthew Boulton — ensemble ils industrialisent la machine à vapeur", "science", "creation", 5),
    ("7cbeb8d9-63c0-4e27-a12a-3b956ddb06f0", "James Watt", "1736-01-19", "1784-01-01", "Invente la machine à vapeur rotative — permet d'alimenter les usines et locomotives", "science", "invention", 5),
    ("7cbeb8d9-63c0-4e27-a12a-3b956ddb06f0", "James Watt", "1736-01-19", "1819-08-25", "Meurt à 83 ans à Handsworth — l'unité de puissance watt porte son nom", "science", "mort", 5),

    # Guglielmo Marconi (1874-04-25)
    ("e121b6ef-d55a-43b1-8882-a57d80c577b5", "Guglielmo Marconi", "1874-04-25", "1895-12-01", "Réalise les premières transmissions radio dans son jardin — signaux sur 3 km", "science", "invention", 4),
    ("e121b6ef-d55a-43b1-8882-a57d80c577b5", "Guglielmo Marconi", "1874-04-25", "1896-06-02", "Dépose le brevet de la radio en Angleterre — le gouvernement italien avait refusé de l'écouter", "science", "invention", 5),
    ("e121b6ef-d55a-43b1-8882-a57d80c577b5", "Guglielmo Marconi", "1874-04-25", "1901-12-12", "Premier signal radio traversant l'Atlantique — de Cornwall à Terre-Neuve, la lettre S en morse", "science", "exploit", 5),
    ("e121b6ef-d55a-43b1-8882-a57d80c577b5", "Guglielmo Marconi", "1874-04-25", "1909-12-10", "Reçoit le prix Nobel de Physique — partagé avec Ferdinand Braun", "science", "prix", 5),
    ("e121b6ef-d55a-43b1-8882-a57d80c577b5", "Guglielmo Marconi", "1874-04-25", "1937-07-20", "Meurt à Rome à 63 ans — les émetteurs radio du monde entier silencieux deux minutes", "science", "mort", 5),

    # Salvador Dalí (1904-05-11)
    ("8b9e81f8-cb85-4291-9895-6401001e1cf4", "Salvador Dalí", "1904-05-11", "1922-09-01", "Entre à l'École des Beaux-Arts de Madrid — rencontre Lorca et Buñuel, scandale permanent", "arts", "debut", 4),
    ("8b9e81f8-cb85-4291-9895-6401001e1cf4", "Salvador Dalí", "1904-05-11", "1929-06-01", "Tourne Un Chien andalou avec Buñuel — chef-d'oeuvre surréaliste, l'oeil tranché au rasoir", "arts", "creation", 5),
    ("8b9e81f8-cb85-4291-9895-6401001e1cf4", "Salvador Dalí", "1904-05-11", "1931-06-01", "Peint La Persistance de la mémoire — les montres molles, icône du surréalisme mondial", "arts", "creation", 5),
    ("8b9e81f8-cb85-4291-9895-6401001e1cf4", "Salvador Dalí", "1904-05-11", "1940-08-16", "Fuit en Amérique avec Gala — 8 ans d'exil luxueux, devient une célébrité commerciale", "arts", "exil", 4),
    ("8b9e81f8-cb85-4291-9895-6401001e1cf4", "Salvador Dalí", "1904-05-11", "1974-09-28", "Inaugure le Théâtre-Musée Dalí à Figueres — son oeuvre maîtresse architecturale", "arts", "creation", 5),
    ("8b9e81f8-cb85-4291-9895-6401001e1cf4", "Salvador Dalí", "1904-05-11", "1989-01-23", "Meurt à 84 ans à Figueres — enterré sous la scène de son propre musée", "arts", "mort", 5),

    # Francisco de Goya (1746-03-30)
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1786-06-25", "Nommé peintre du roi Charles III — entre à la cour d'Espagne à 40 ans", "arts", "nomination", 4),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1792-01-01", "Grave maladie — devient sourd à 46 ans, sa peinture bascule vers les ténèbres", "arts", "vie-privee", 5),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1808-05-02", "Témoin du soulèvement de Madrid contre Napoléon — peindra les fusillades du 3 mai", "arts", "vie-privee", 5),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1819-01-01", "Peint les Peintures noires sur les murs de sa maison — génie sombre et visionnaire", "arts", "creation", 5),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1828-04-16", "Meurt à Bordeaux à 82 ans en exil — précurseur du romantisme et de l'art moderne", "arts", "mort", 5),

    # Édouard Manet (1832-01-23)
    ("246706c3-6a80-4e64-b99a-5d04a5e92685", "Édouard Manet", "1832-01-23", "1863-05-15", "Le Déjeuner sur l'herbe scandalise le Salon des Refusés — femme nue avec des hommes habillés", "arts", "creation", 5),
    ("246706c3-6a80-4e64-b99a-5d04a5e92685", "Édouard Manet", "1832-01-23", "1865-05-01", "Olympia provoque un scandale au Salon — prostituée nue regardant le spectateur sans détourner les yeux", "arts", "creation", 5),
    ("246706c3-6a80-4e64-b99a-5d04a5e92685", "Édouard Manet", "1832-01-23", "1874-04-15", "Refuse de participer à la première exposition impressionniste — reste attaché au Salon officiel", "arts", "vie-privee", 4),
    ("246706c3-6a80-4e64-b99a-5d04a5e92685", "Édouard Manet", "1832-01-23", "1882-01-01", "Peint Un bar aux Folies-Bergère — son dernier chef-d'oeuvre avant la maladie", "arts", "creation", 5),
    ("246706c3-6a80-4e64-b99a-5d04a5e92685", "Édouard Manet", "1832-01-23", "1883-04-30", "Meurt à Paris à 51 ans d'une gangrène — père de l'art moderne selon ses successeurs", "arts", "mort", 5),

    # Alexandre le Grand (0356-07-20)
    ("a8d109c5-e81f-43ca-8174-cc8dbd04e5c3", "Alexandre le Grand", "0356-07-20", "0343-01-01", "Aristote devient son précepteur à 13 ans — 3 ans de formation philosophique et scientifique", "pouvoir", "formation", 5),
    ("a8d109c5-e81f-43ca-8174-cc8dbd04e5c3", "Alexandre le Grand", "0356-07-20", "0338-08-02", "Commande la cavalerie macédonienne à Chéronée à 18 ans — victoire décisive sur la Grèce", "pouvoir", "victoire", 5),
    ("a8d109c5-e81f-43ca-8174-cc8dbd04e5c3", "Alexandre le Grand", "0356-07-20", "0334-05-01", "Traverse l'Hellespont avec 35 000 hommes — début de la conquête de l'Empire perse", "pouvoir", "voyage", 5),
    ("a8d109c5-e81f-43ca-8174-cc8dbd04e5c3", "Alexandre le Grand", "0356-07-20", "0331-10-01", "Bat Darius III à Gaugamèles — fin de l'Empire perse, maître de l'Asie", "pouvoir", "victoire", 5),
    ("a8d109c5-e81f-43ca-8174-cc8dbd04e5c3", "Alexandre le Grand", "0356-07-20", "0326-07-01", "Ses soldats refusent d'aller plus loin aux Indes — premier échec, demi-tour forcé", "pouvoir", "echec", 5),
    ("a8d109c5-e81f-43ca-8174-cc8dbd04e5c3", "Alexandre le Grand", "0356-07-20", "0323-06-10", "Meurt à Babylone à 32 ans — fièvre mystérieuse, empire démembré entre ses généraux", "pouvoir", "mort", 5),

    # Jules César (0100-07-12)
    ("def59446-7bd3-431d-8f55-0b5b16726ef8", "Jules César", "0100-07-12", "0081-01-01", "Capturé par des pirates — négocie sa rançon puis revient les crucifier", "pouvoir", "exploit", 5),
    ("def59446-7bd3-431d-8f55-0b5b16726ef8", "Jules César", "0100-07-12", "0060-01-01", "Forme le premier triumvirat avec Pompée et Crassus — partage le pouvoir de Rome", "pouvoir", "decision", 5),
    ("def59446-7bd3-431d-8f55-0b5b16726ef8", "Jules César", "0100-07-12", "0052-10-03", "Bat Vercingétorix à Alésia — fin de la résistance gauloise après 8 ans de guerre", "pouvoir", "victoire", 5),
    ("def59446-7bd3-431d-8f55-0b5b16726ef8", "Jules César", "0100-07-12", "0049-01-10", "Franchit le Rubicon — le dé est jeté, début de la guerre civile contre Pompée", "pouvoir", "decision", 5),
    ("def59446-7bd3-431d-8f55-0b5b16726ef8", "Jules César", "0100-07-12", "0044-02-14", "Nommé dictateur à vie — le Sénat lui offre un pouvoir absolu et sans limite", "pouvoir", "nomination", 5),
    ("def59446-7bd3-431d-8f55-0b5b16726ef8", "Jules César", "0100-07-12", "0044-03-15", "Assassiné aux Ides de Mars à 55 ans — 23 coups de poignard dont celui de Brutus", "pouvoir", "mort", 5),
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
