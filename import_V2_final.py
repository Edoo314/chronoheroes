"""
ChronoHeroes — Import V2 final
===============================
Insère exactement ce qui manque en base :
  - 5 nouveaux personnages (avec gender + importance)
  - 27 nouveaux événements (doublons exclus)

Usage : python import_V2_final.py
"""

import requests, time

import os

# Lit la clé depuis .env.local automatiquement
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

# ── 5 NOUVEAUX PERSONNAGES ────────────────────────────────────────────────────
NEW_PERSONS = [
    {"name": "Edgar Morin",         "birthdate_raw": "1921-07-08", "deathdate_raw": "2026-05-29", "country": "FR", "geo": "philosophie-sociologie", "period": "xxe-contemporain", "tags": "philosophie,sociologie",        "wikipedia_slug": "Edgar_Morin",         "importance": 4, "gender": "m"},
    {"name": "Baruch Spinoza",      "birthdate_raw": "1632-11-24", "deathdate_raw": "1677-02-21", "country": "NL", "geo": "philosophie",            "period": "xviie-xviiie",     "tags": "philosophie",                   "wikipedia_slug": "Baruch_Spinoza",      "importance": 5, "gender": "m"},
    {"name": "Friedrich Nietzsche", "birthdate_raw": "1844-10-15", "deathdate_raw": "1900-08-25", "country": "DE", "geo": "philosophie",            "period": "xixe",             "tags": "philosophie,litterature",       "wikipedia_slug": "Friedrich_Nietzsche", "importance": 5, "gender": "m"},
    {"name": "George Harrison",     "birthdate_raw": "1943-02-25", "deathdate_raw": "2001-11-29", "country": "GB", "geo": "musique-rock",           "period": "xxe",              "tags": "musique-rock",                  "wikipedia_slug": "George_Harrison",     "importance": 4, "gender": "m"},
    {"name": "Ringo Starr",         "birthdate_raw": "1940-07-07", "deathdate_raw": None,         "country": "GB", "geo": "musique-rock",           "period": "xxe-contemporain", "tags": "musique-rock",                  "wikipedia_slug": "Ringo_Starr",         "importance": 4, "gender": "m"},
]

# ── 27 NOUVEAUX ÉVÉNEMENTS ────────────────────────────────────────────────────
# Champs : person_name, event_date_raw, person_age_days, age_years, age_months, age_days_rem, age_label, description_fr, category, subcategory, importance
NEW_EVENTS = [
    # Edgar Morin
    ("Edgar Morin","1951-01-01",10769,29,5,24,"29 ans, 5 mois et 24 jours","Publication de L'Homme et la Mort, son premier grand essai philosophique, qui fonde sa réflexion sur la condition humaine","philosophie","essai",4),
    ("Edgar Morin","1967-01-01",16613,45,5,24,"45 ans, 5 mois et 24 jours","Publie La Commune en France, reportage sociologique sur Plozévet — naissance de la sociologie du présent","science","sociologie",4),
    ("Edgar Morin","1977-01-01",20266,55,5,24,"55 ans, 5 mois et 24 jours","Publication du premier tome de La Méthode, œuvre monumentale sur la pensée complexe en 6 volumes sur 30 ans","philosophie","essai",5),
    ("Edgar Morin","2026-05-29",38311,104,10,21,"104 ans, 10 mois et 21 jours","S'éteint à Paris à 104 ans, figure tutélaire de la pensée complexe et de l'humanisme du XXe et XXIe siècle","philosophie","biographie",5),
    # Baruch Spinoza
    ("Baruch Spinoza","1656-07-27",8646,23,8,3,"23 ans, 8 mois et 3 jours","Excommunié (herem) par la communauté juive d'Amsterdam — rupture radicale qui libère sa pensée philosophique","philosophie","biographie",5),
    ("Baruch Spinoza","1663-01-01",10995,30,1,8,"30 ans, 1 mois et 8 jours","Publie son commentaire des Principes de la philosophie de Descartes, seul livre signé de son vivant","philosophie","essai",4),
    ("Baruch Spinoza","1670-01-01",13552,37,1,8,"37 ans, 1 mois et 8 jours","Publication anonyme du Traité théologico-politique, scandale intellectuel dans toute l'Europe protestante et catholique","philosophie","essai",5),
    ("Baruch Spinoza","1677-02-21",16160,44,2,28,"44 ans, 2 mois et 28 jours","Meurt à La Haye à 44 ans, probablement de la tuberculose ; L'Éthique, son chef-d'œuvre, est publiée la même année","philosophie","biographie",5),
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
    ("Ringo Starr","1973-11-02",12171,33,3,26,"33 ans, 3 mois et 26 jours","Sort Ringo, son meilleur album solo, avec des contributions inédites de Lennon, McCartney et Harrison réunis","arts","musique",4),
    ("Ringo Starr","1981-01-01",14788,40,5,25,"40 ans, 5 mois et 25 jours","Participe à All Those Years Ago, hommage à Lennon enregistré avec McCartney et Harrison — première réunion post-Beatles","arts","musique",4),
    # John Lennon — events manquants (1962 et 1966 déjà en base)
    ("John Lennon","1971-10-11",11324,31,0,2,"31 ans, 0 mois et 2 jours","Sortie d'Imagine, hymne pacifiste devenu l'une des chansons les plus connues et reprises du monde entier","arts","musique",5),
    ("John Lennon","1980-12-08",14670,40,1,29,"40 ans, 1 mois et 29 jours","Assassiné devant son immeuble du Dakota à New York par Mark David Chapman — choc mondial","arts","biographie",5),
    # Paul McCartney — event manquant (1962, 1967, 1973 déjà en base)
    ("Paul McCartney","1970-04-10",10158,27,9,23,"27 ans, 9 mois et 23 jours","Annonce officiellement la séparation des Beatles dans un communiqué de presse — fin d'une époque musicale","arts","musique",5),
    # Léonard de Vinci — events manquants (1490, 1498, 1513 déjà en base)
    ("Léonard de Vinci","1472-01-01",7200,19,8,17,"19 ans, 8 mois et 17 jours","Admis à la guilde des peintres de Florence — début officiel de sa carrière artistique sous Verrocchio","arts","peinture",4),
    ("Léonard de Vinci","1482-01-01",10852,29,8,17,"29 ans, 8 mois et 17 jours","S'installe à Milan à la cour de Ludovic Sforza comme ingénieur, musicien et peintre — début de sa période la plus productive","arts","biographie",4),
    ("Léonard de Vinci","1516-01-01",23266,63,8,17,"63 ans, 8 mois et 17 jours","Accepte l'invitation de François Ier et s'installe au Clos Lucé à Amboise — les trois dernières années de sa vie en France","arts","biographie",4),
    ("Léonard de Vinci","1519-05-02",24487,67,0,17,"67 ans, 0 mois et 17 jours","Meurt à Amboise en France, dans les bras du roi François Ier selon la légende, laissant des milliers de pages de carnets","arts","biographie",5),
]


# ── FONCTIONS ─────────────────────────────────────────────────────────────────

def get_person_id(name: str) -> str | None:
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/persons",
        headers=HEADERS,
        params={"name": f"eq.{name}", "select": "id"},
    )
    data = r.json()
    return data[0]["id"] if data else None


def get_wikipedia_image(slug: str) -> str | None:
    for lang in ["fr", "en"]:
        try:
            url = (f"https://{lang}.wikipedia.org/w/api.php"
                   f"?action=query&titles={requests.utils.quote(slug)}"
                   f"&prop=pageimages&format=json&pithumbsize=400")
            r = requests.get(url, timeout=10, headers={"User-Agent": "ChronoHeroes/1.0"})
            pages = r.json()["query"]["pages"]
            img = next(iter(pages.values())).get("thumbnail", {}).get("source")
            if img:
                return img
        except Exception:
            pass
    return None


def insert_persons():
    print("\n=== Personnages ===")
    for p in NEW_PERSONS:
        # Vérifier si déjà en base
        person_id = get_person_id(p["name"])
        if person_id:
            print(f"  ~ {p['name']} déjà en base")
            continue

        # Créer le personnage (supprimer les None)
        payload = {k: v for k, v in p.items() if v is not None}
        r = requests.post(f"{SUPABASE_URL}/rest/v1/persons", headers=HEADERS, json=payload)
        if r.status_code in (200, 201):
            person_id = get_person_id(p["name"])
            print(f"  ✓ {p['name']} créé")
        else:
            print(f"  ✗ {p['name']} erreur {r.status_code}: {r.text[:150]}")
            continue
        time.sleep(0.2)

        # Image Wikipedia
        img = get_wikipedia_image(p["wikipedia_slug"])
        if img:
            requests.patch(f"{SUPABASE_URL}/rest/v1/persons", headers=HEADERS,
                           params={"id": f"eq.{person_id}"}, json={"image_url": img})
            print(f"    🖼  {img[:70]}")
        else:
            print(f"    – pas d'image")
        time.sleep(0.3)


def insert_events():
    print("\n=== Événements ===")
    ok = ko = 0
    for e in NEW_EVENTS:
        person_name = e[0]
        person_id = get_person_id(person_name)
        if not person_id:
            print(f"  ✗ Personnage introuvable : {person_name}")
            ko += 1
            continue

        payload = {
            "person_id":       person_id,
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
            print(f"  ~ {person_name} — {e[1]} (déjà en base, ignoré)")
        else:
            print(f"  ✗ {person_name} — {e[1]} ({r.status_code}: {r.text[:100]})")
            ko += 1
        time.sleep(0.15)

    print(f"\n  {ok} events insérés, {ko} erreurs")


def main():
    print("=== ChronoHeroes — Import V2 final ===")
    if not SUPABASE_KEY:
        print("\n⚠  Renseigne ta SUPABASE_KEY en haut du fichier !")
        return
    insert_persons()
    insert_events()
    print("\n=== Terminé ! ===")


if __name__ == "__main__":
    main()
