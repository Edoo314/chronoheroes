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
    # Piotr Tchaïkovski (1840-05-07)
    ("80162ee5-10e0-4b10-a26b-1086e2a6e58f", "Piotr Tchaïkovski", "1840-05-07", "1866-09-01", "Nommé professeur au Conservatoire de Moscou — commence à composer intensément", "arts", "nomination", 4),
    ("80162ee5-10e0-4b10-a26b-1086e2a6e58f", "Piotr Tchaïkovski", "1840-05-07", "1876-03-04", "Crée le Lac des Cygnes — accueil mitigé, le chef-d'oeuvre sera reconnu après sa mort", "arts", "creation", 5),
    ("80162ee5-10e0-4b10-a26b-1086e2a6e58f", "Piotr Tchaïkovski", "1840-05-07", "1877-07-18", "Épouse Antonina Miliukova — catastrophe totale, il tente de se suicider, fuit en Europe", "arts", "vie-privee", 5),
    ("80162ee5-10e0-4b10-a26b-1086e2a6e58f", "Piotr Tchaïkovski", "1840-05-07", "1878-01-07", "Achève son concerto pour violon et la 4e symphonie — période la plus créative", "arts", "creation", 5),
    ("80162ee5-10e0-4b10-a26b-1086e2a6e58f", "Piotr Tchaïkovski", "1840-05-07", "1890-01-23", "Crée La Belle au Bois Dormant — ballet commandé par le tsar, triomphe absolu", "arts", "creation", 5),
    ("80162ee5-10e0-4b10-a26b-1086e2a6e58f", "Piotr Tchaïkovski", "1840-05-07", "1893-11-06", "Meurt à 53 ans — choléra officiel ou suicide imposé, mystère jamais élucidé", "arts", "mort", 5),
    # Giuseppe Verdi (1813-10-10)
    ("3a199e9f-4b95-4e86-9bd6-49134fe590fb", "Giuseppe Verdi", "1813-10-10", "1839-11-17", "Crée Oberto à la Scala de Milan — premier opéra, succès modeste mais encourageant", "arts", "debut", 4),
    ("3a199e9f-4b95-4e86-9bd6-49134fe590fb", "Giuseppe Verdi", "1813-10-10", "1842-03-09", "Crée Nabucco — triomphe absolu, Va Pensiero devient hymne du Risorgimento", "arts", "creation", 5),
    ("3a199e9f-4b95-4e86-9bd6-49134fe590fb", "Giuseppe Verdi", "1813-10-10", "1851-03-11", "Crée Rigoletto — chef-d'oeuvre, la censure avait voulu le faire interdire", "arts", "creation", 5),
    ("3a199e9f-4b95-4e86-9bd6-49134fe590fb", "Giuseppe Verdi", "1813-10-10", "1853-01-19", "Crée Il Trovatore et La Traviata — deux chefs-d'oeuvre en un mois", "arts", "creation", 5),
    ("3a199e9f-4b95-4e86-9bd6-49134fe590fb", "Giuseppe Verdi", "1813-10-10", "1871-12-24", "Crée Aïda au Caire — commande du khédive d'Égypte pour l'ouverture du canal de Suez", "arts", "creation", 5),
    ("3a199e9f-4b95-4e86-9bd6-49134fe590fb", "Giuseppe Verdi", "1813-10-10", "1901-01-27", "Meurt à Milan à 87 ans — 28 opéras, 200 000 personnes à ses funérailles", "arts", "mort", 5),
    # Carl Sagan (1934-11-09)
    ("a43804a0-26c5-4003-bec7-2f2abad56675", "Carl Sagan", "1934-11-09", "1960-05-01", "Obtient son doctorat à Chicago — spécialiste de l'astronomie et de l'origine de la vie", "science", "formation", 4),
    ("a43804a0-26c5-4003-bec7-2f2abad56675", "Carl Sagan", "1934-11-09", "1972-03-02", "Contribue à la plaque Pioneer — message de l'humanité vers les étoiles sur la sonde Pioneer 10", "science", "exploit", 5),
    ("a43804a0-26c5-4003-bec7-2f2abad56675", "Carl Sagan", "1934-11-09", "1977-09-05", "Lance Voyager 1 avec son disque d'or — sons et images de la Terre pour une civilisation extraterrestre", "science", "exploit", 5),
    ("a43804a0-26c5-4003-bec7-2f2abad56675", "Carl Sagan", "1934-11-09", "1980-09-28", "Lance la série Cosmos à la télévision — 500 millions de téléspectateurs dans 60 pays", "science", "creation", 5),
    ("a43804a0-26c5-4003-bec7-2f2abad56675", "Carl Sagan", "1934-11-09", "1994-10-13", "Publie Pale Blue Dot — contemple la Terre photographiée depuis 6 milliards de km", "science", "publication", 5),
    ("a43804a0-26c5-4003-bec7-2f2abad56675", "Carl Sagan", "1934-11-09", "1996-12-20", "Meurt à Seattle à 62 ans d'une pneumonie — après un combat de 2 ans contre la leucémie", "science", "mort", 5),
    # Tim Berners-Lee (1955-06-08)
    ("78d624c0-19c0-48f9-852d-15551c87cf91", "Tim Berners-Lee", "1955-06-08", "1980-06-01", "Propose un système de gestion de l'information au CERN — première ébauche du Web", "science", "creation", 4),
    ("78d624c0-19c0-48f9-852d-15551c87cf91", "Tim Berners-Lee", "1955-06-08", "1989-03-12", "Soumet sa proposition pour le World Wide Web — son patron écrit vague mais excitant", "science", "creation", 5),
    ("78d624c0-19c0-48f9-852d-15551c87cf91", "Tim Berners-Lee", "1955-06-08", "1991-08-06", "Met en ligne le premier site web de l'histoire — info.cern.ch", "science", "exploit", 5),
    ("78d624c0-19c0-48f9-852d-15551c87cf91", "Tim Berners-Lee", "1955-06-08", "1994-10-01", "Fonde le W3C — consortium pour standardiser le Web et le garder ouvert à tous", "science", "creation", 5),
    ("78d624c0-19c0-48f9-852d-15551c87cf91", "Tim Berners-Lee", "1955-06-08", "2004-07-16", "Anobli par la reine Elizabeth II — devient Sir Tim Berners-Lee", "science", "distinction", 4),
    ("78d624c0-19c0-48f9-852d-15551c87cf91", "Tim Berners-Lee", "1955-06-08", "2012-07-27", "Salué aux JO de Londres — tweete This is for everyone lors de la cérémonie d'ouverture", "science", "distinction", 5),
    # Charles Darwin (1809-02-12)
    ("9924b00b-070c-48d1-8242-2f1d5171aeb0", "Charles Darwin", "1809-02-12", "1831-12-27", "Embarque sur le Beagle — voyage de 5 ans qui changera sa vision du monde", "science", "voyage", 5),
    ("9924b00b-070c-48d1-8242-2f1d5171aeb0", "Charles Darwin", "1809-02-12", "1836-10-02", "Retour en Angleterre après 5 ans — commence à noter ses premières théories sur l'évolution", "science", "decouverte", 5),
    ("9924b00b-070c-48d1-8242-2f1d5171aeb0", "Charles Darwin", "1809-02-12", "1844-01-01", "Rédige un essai de 230 pages sur la sélection naturelle — garde le secret pendant 15 ans", "science", "creation", 5),
    ("9924b00b-070c-48d1-8242-2f1d5171aeb0", "Charles Darwin", "1809-02-12", "1860-06-30", "Débat d'Oxford — Huxley défend Darwin contre l'évêque Wilberforce, victoire éclatante", "science", "distinction", 5),
    ("9924b00b-070c-48d1-8242-2f1d5171aeb0", "Charles Darwin", "1809-02-12", "1871-02-24", "Publie La Filiation de l'homme — applique la sélection naturelle à l'espèce humaine", "science", "publication", 5),
    # Albert Einstein (1879-03-14)
    ("0a49f4f4-0d02-4830-87f1-8c8cddf85269", "Albert Einstein", "1879-03-14", "1902-06-16", "Obtient un poste à l'Office des brevets de Berne — commence à penser pendant ses heures libres", "science", "debut", 4),
    ("0a49f4f4-0d02-4830-87f1-8c8cddf85269", "Albert Einstein", "1879-03-14", "1905-03-17", "Publie 4 articles révolutionnaires en un an — l'annus mirabilis de la physique", "science", "decouverte", 5),
    ("0a49f4f4-0d02-4830-87f1-8c8cddf85269", "Albert Einstein", "1879-03-14", "1919-11-07", "Confirmé par l'éclipse solaire — la relativité générale est prouvée, célébrité mondiale", "science", "decouverte", 5),
    ("0a49f4f4-0d02-4830-87f1-8c8cddf85269", "Albert Einstein", "1879-03-14", "1921-12-10", "Reçoit le prix Nobel de Physique — pour l'effet photoélectrique, pas la relativité", "science", "prix", 5),
    ("0a49f4f4-0d02-4830-87f1-8c8cddf85269", "Albert Einstein", "1879-03-14", "1933-03-01", "Fuit l'Allemagne nazie — ne reviendra jamais, s'installe à Princeton", "science", "exil", 5),
    ("0a49f4f4-0d02-4830-87f1-8c8cddf85269", "Albert Einstein", "1879-03-14", "1955-04-18", "Meurt à Princeton à 76 ans — refuse une opération : vouloir prolonger la vie est sans goût", "science", "mort", 5),
    # Pelé (1940-10-23)
    ("960b8ab5-2b8c-4e63-8b35-6e346cd8e80d", "Pelé (Edson Arantes do Nascimento)", "1940-10-23", "1956-09-07", "Débute en professionnel au Santos FC à 15 ans — plus jeune buteur du club", "sport", "debut", 4),
    ("960b8ab5-2b8c-4e63-8b35-6e346cd8e80d", "Pelé (Edson Arantes do Nascimento)", "1940-10-23", "1958-06-29", "Remporte la Coupe du monde à 17 ans — pleure dans les bras de son coéquipier Gilmar", "sport", "victoire", 5),
    ("960b8ab5-2b8c-4e63-8b35-6e346cd8e80d", "Pelé (Edson Arantes do Nascimento)", "1940-10-23", "1961-11-05", "Marque le but du siècle contre Fluminense — dribble 7 joueurs depuis sa propre surface", "sport", "exploit", 5),
    ("960b8ab5-2b8c-4e63-8b35-6e346cd8e80d", "Pelé (Edson Arantes do Nascimento)", "1940-10-23", "1969-11-19", "Inscrit son 1000e but en carrière — fête nationale au Brésil", "sport", "record", 5),
    ("960b8ab5-2b8c-4e63-8b35-6e346cd8e80d", "Pelé (Edson Arantes do Nascimento)", "1940-10-23", "1970-06-21", "Remporte sa 3e Coupe du monde — meilleur joueur du tournoi à 29 ans", "sport", "victoire", 5),
    ("960b8ab5-2b8c-4e63-8b35-6e346cd8e80d", "Pelé (Edson Arantes do Nascimento)", "1940-10-23", "2022-12-29", "Meurt à 82 ans à São Paulo — deuil national au Brésil, 3 jours de tribut mondial", "sport", "mort", 5),
    # Diego Maradona (1960-10-30)
    ("08983622-9998-4382-b4bf-70411374162a", "Diego Maradona", "1960-10-30", "1976-10-22", "Débute en professionnel à 15 ans avec les Argentinos Juniors", "sport", "debut", 4),
    ("08983622-9998-4382-b4bf-70411374162a", "Diego Maradona", "1960-10-30", "1982-06-01", "Rejoint le FC Barcelone pour 7,6 millions de dollars — transfert record mondial", "sport", "transfert", 5),
    ("08983622-9998-4382-b4bf-70411374162a", "Diego Maradona", "1960-10-30", "1984-07-05", "Rejoint le Napoli — transforme un club modeste en champion d'Italie", "sport", "transfert", 5),
    ("08983622-9998-4382-b4bf-70411374162a", "Diego Maradona", "1960-10-30", "1986-06-22", "But de la main de Dieu puis but du siècle contre l'Angleterre — deux buts en 4 minutes", "sport", "exploit", 5),
    ("08983622-9998-4382-b4bf-70411374162a", "Diego Maradona", "1960-10-30", "1986-06-29", "Remporte la Coupe du monde avec l'Argentine — meilleur joueur du tournoi", "sport", "victoire", 5),
    ("08983622-9998-4382-b4bf-70411374162a", "Diego Maradona", "1960-10-30", "2020-11-25", "Meurt à 60 ans d'une crise cardiaque — deuil national en Argentine, 3 jours de deuil officiel", "sport", "mort", 5),
    # Roger Federer (1981-08-08)
    ("82d3dfe2-a1ff-4981-99df-5413660b52d8", "Roger Federer", "1981-08-08", "1998-07-06", "Remporte Wimbledon junior à 16 ans — première grande distinction", "sport", "victoire", 4),
    ("82d3dfe2-a1ff-4981-99df-5413660b52d8", "Roger Federer", "1981-08-08", "2001-07-02", "Bat Pete Sampras à Wimbledon — l'élimination du champion en titre lance sa légende", "sport", "victoire", 5),
    ("82d3dfe2-a1ff-4981-99df-5413660b52d8", "Roger Federer", "1981-08-08", "2003-07-06", "Remporte son premier Wimbledon — début d'une série de 5 titres consécutifs", "sport", "victoire", 5),
    ("82d3dfe2-a1ff-4981-99df-5413660b52d8", "Roger Federer", "1981-08-08", "2009-06-07", "Remporte Roland-Garros — complète le Grand Chelem en carrière, pleure sur le court", "sport", "victoire", 5),
    ("82d3dfe2-a1ff-4981-99df-5413660b52d8", "Roger Federer", "1981-08-08", "2017-07-16", "Remporte Wimbledon à 35 ans — 8e titre, retour miraculeux après blessure", "sport", "victoire", 5),
    ("82d3dfe2-a1ff-4981-99df-5413660b52d8", "Roger Federer", "1981-08-08", "2022-09-23", "Prend sa retraite à 41 ans lors de la Laver Cup — pleure avec Nadal sur le banc", "sport", "retraite", 5),
    # Zinédine Zidane (1972-06-23)
    ("63cce132-a1cb-4c5e-a952-87ce00a6d1f9", "Zinédine Zidane", "1972-06-23", "1989-05-20", "Débute professionnel à Cannes à 16 ans — repéré dans les quartiers nord de Marseille", "sport", "debut", 4),
    ("63cce132-a1cb-4c5e-a952-87ce00a6d1f9", "Zinédine Zidane", "1972-06-23", "1996-07-02", "Rejoint la Juventus — devient l'un des meilleurs joueurs du monde en Serie A", "sport", "transfert", 4),
    ("63cce132-a1cb-4c5e-a952-87ce00a6d1f9", "Zinédine Zidane", "1972-06-23", "1998-07-12", "Double buteur en finale de la Coupe du monde — champion du monde à 26 ans", "sport", "victoire", 5),
    ("63cce132-a1cb-4c5e-a952-87ce00a6d1f9", "Zinédine Zidane", "1972-06-23", "2001-07-09", "Transféré au Real Madrid pour 77,5 millions d'euros — record mondial à l'époque", "sport", "transfert", 5),
    ("63cce132-a1cb-4c5e-a952-87ce00a6d1f9", "Zinédine Zidane", "1972-06-23", "2006-07-09", "Coup de tête sur Materazzi en finale de la Coupe du monde — sa dernière action professionnelle", "sport", "vie-privee", 5),
    ("63cce132-a1cb-4c5e-a952-87ce00a6d1f9", "Zinédine Zidane", "1972-06-23", "2016-01-04", "Nommé entraîneur du Real Madrid — remporte 3 Ligue des Champions consécutives", "sport", "nomination", 5),
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
