"""
ChronoHeroes — Insert events V2
================================
Insère les événements pour les 5 nouveaux personnages.
Les person_id sont codés en dur (récupérés via SQL Editor).

Usage : python insert_events_V2.py
"""

import os, requests, time

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env.local")
    if os.path.exists(env_path):
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

load_env()

SUPABASE_URL = "https://geabolpfdjrclhpqxcwi.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# IDs récupérés via SQL Editor
IDS = {
    "Edgar Morin":         "e0ddfd21-f4b6-476f-a029-8baac2a6d8f0",
    "Baruch Spinoza":      "86024a0b-cb1a-4038-a053-ee81ab01b71e",
    "Friedrich Nietzsche": "c24c35cc-aa61-41b9-9821-45985b6f9770",
    "George Harrison":     "b713b830-a218-4166-9629-829745750285",
    "Ringo Starr":         "33c79785-220d-410f-8669-8b065c43b9df",
}

# (person_name, event_date_raw, age_days, age_years, age_months, age_days_rem, age_label, description_fr, category, subcategory, importance)
EVENTS = [
    # Edgar Morin
    ("Edgar Morin","1951-01-01",10769,29,5,24,"29 ans, 5 mois et 24 jours","Publication de L'Homme et la Mort, son premier grand essai philosophique, qui fonde sa réflexion sur la condition humaine","philosophie","essai",4),
    ("Edgar Morin","1967-01-01",16613,45,5,24,"45 ans, 5 mois et 24 jours","Publie La Commune en France, reportage sociologique sur Plozévet — naissance de la sociologie du présent","science","sociologie",4),
    ("Edgar Morin","1977-01-01",20266,55,5,24,"55 ans, 5 mois et 24 jours","Publication du premier tome de La Méthode, œuvre monumentale sur la pensée complexe en 6 volumes sur 30 ans","philosophie","essai",5),
    ("Edgar Morin","2026-05-29",38311,104,10,21,"104 ans, 10 mois et 21 jours","S'éteint à Paris à 104 ans, figure tutélaire de la pensée complexe et de l'humanisme du XXe et XXIe siècle","philosophie","biographie",5),
    # Baruch Spinoza
    ("Baruch Spinoza","1656-07-27",8646,23,8,3,"23 ans, 8 mois et 3 jours","Excommunié (herem) par la communauté juive d'Amsterdam — rupture radicale qui libère sa pensée philosophique","philosophie","biographie",5),
    ("Baruch Spinoza","1663-01-01",10995,30,1,8,"30 ans, 1 mois et 8 jours","Publie son commentaire des Principes de la philosophie de Descartes, seul livre signé de son vivant","philosophie","essai",4),
    ("Baruch Spinoza","1670-01-01",13552,37,1,8,"37 ans, 1 mois et 8 jours","Publication anonyme du Traité théologico-politique, scandale intellectuel dans toute l'Europe protestante et catholique","philosophie","essai",5),
    ("Baruch Spinoza","1677-02-21",16160,44,2,28,"44 ans, 2 mois et 28 jours","Meurt à La Haye à 44 ans ; L'Éthique, son chef-d'œuvre, est publiée la même année","philosophie","biographie",5),
    # Friedrich Nietzsche
    ("Friedrich Nietzsche","1869-05-17",8980,24,7,2,"24 ans, 7 mois et 2 jours","Nommé professeur de philologie à Bâle à 24 ans, avant même sa soutenance de thèse — record académique","philosophie","biographie",4),
    ("Friedrich Nietzsche","1872-01-01",9939,27,2,17,"27 ans, 2 mois et 17 jours","Publication de La Naissance de la tragédie, première grande œuvre influencée par Wagner et Schopenhauer","philosophie","essai",4),
    ("Friedrich Nietzsche","1883-01-01",13957,38,2,17,"38 ans, 2 mois et 17 jours","Commence Ainsi parlait Zarathoustra, son œuvre la plus célèbre, où il développe l'idée du Surhomme","philosophie","essai",5),
    ("Friedrich Nietzsche","1888-01-01",15783,43,2,17,"43 ans, 2 mois et 17 jours","Rédige en une seule année Le Crépuscule des idoles, L'Antéchrist et Ecce Homo — fulgurance créatrice avant l'effondrement","philosophie","essai",5),
    ("Friedrich Nietzsche","1889-01-03",16151,44,2,19,"44 ans, 2 mois et 19 jours","Effondrement mental à Turin — s'effondre dans la rue et sombre dans la folie définitivement","philosophie","biographie",5),
    # George Harrison
    ("George Harrison","1962-08-15",7111,19,5,21,"19 ans, 5 mois et 21 jours","Les Beatles enregistrent Love Me Do chez EMI, George Harrison en est le plus jeune membre à 19 ans","arts","musique",4),
    ("George Harrison","1968-11-01",9381,25,8,7,"25 ans, 8 mois et 7 jours","Sort Wonderwall Music, devenant le premier Beatle à publier un album solo","arts","musique",4),
    ("George Harrison","1970-11-27",10137,27,9,2,"27 ans, 9 mois et 2 jours","Sort All Things Must Pass, triple album acclamé par la critique et meilleur album solo d'un ex-Beatle selon beaucoup","arts","musique",5),
    ("George Harrison","1971-08-01",10384,28,5,7,"28 ans, 5 mois et 7 jours","Organise le Concert for Bangladesh au Madison Square Garden, premier grand concert humanitaire de l'histoire du rock","arts","musique",5),
    # Ringo Starr
    ("Ringo Starr","1962-08-15",8074,22,1,8,"22 ans, 1 mois et 8 jours","Rejoint les Beatles comme batteur en remplaçant Pete Best — le line-up définitif est formé, la légende commence","arts","musique",5),
    ("Ringo Starr","1973-11-02",12171,33,3,26,"33 ans, 3 mois et 26 jours","Sort Ringo, son meilleur album solo, avec des contributions de Lennon, McCartney et Harrison réunis","arts","musique",4),
    ("Ringo Starr","1981-01-01",14788,40,5,25,"40 ans, 5 mois et 25 jours","Participe à All Those Years Ago, hommage à Lennon enregistré avec McCartney et Harrison","arts","musique",4),
]

def main():
    print("=== ChronoHeroes — Insert events V2 ===\n")
    if not SUPABASE_KEY:
        print("⚠  Clé Supabase introuvable dans .env.local")
        return

    ok = ko = 0
    for e in EVENTS:
        person_name = e[0]
        payload = {
            "person_id":       IDS[person_name],
            "person_name":     person_name,
            "event_date_raw":  e[1],
            "person_age_days": e[2],
            "age_years":       e[3],
            "age_months":      e[4],
            "age_days_rem":    e[5],
            "age_label":       e[6],
            "description_fr":  e[7],
            "category":        e[8],
            "subcategory":     e[9],
            "importance":      e[10],
        }
        r = requests.post(f"{SUPABASE_URL}/rest/v1/events", headers=HEADERS, json=payload)
        if r.status_code in (200, 201):
            print(f"  ✓ {person_name} — {e[1]}")
            ok += 1
        elif r.status_code == 409:
            print(f"  ~ {person_name} — {e[1]} (déjà en base)")
        else:
            print(f"  ✗ {person_name} — {e[1]} ({r.status_code}: {r.text[:100]})")
            ko += 1
        time.sleep(0.15)

    print(f"\n{ok} events insérés, {ko} erreurs")

if __name__ == "__main__":
    main()
