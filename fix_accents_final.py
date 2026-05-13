import requests

SUPABASE_URL = "https://geabolpfdjrclhpqxcwi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWJvbHBmZGpyY2xocHF4Y3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE1NTMyNiwiZXhwIjoyMDkzNzMxMzI2fQ.T4BsishTPZulNh9vBloSnMa6jq7cpobLgykXtCI0aW4"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json"
}

CORRECTIONS = [
    ("torture ", "torturé "),
    ("arrete ", "arrêté "),
    ("Arrete ", "Arrêté "),
    ("ignorees", "ignorées"),
    ("heredite", "hérédité"),
    ("Pole Sud", "Pôle Sud"),
    ("Pole Nord", "Pôle Nord"),
    ("etait arrive", "était arrivé"),
    ("etait", "était"),
    ("Etait", "Était"),
    ("dedie", "dédié"),
    ("Dedie", "Dédié"),
    ("exile ", "exilé "),
    ("Exile ", "Exilé "),
    ("epouse ", "épouse "),
    ("Epouse ", "Épouse "),
    ("condamne ", "condamné "),
    ("Condamne ", "Condamné "),
    ("blesse ", "blessé "),
    ("Blesse ", "Blessé "),
    ("refugie", "réfugié"),
    ("Refugie", "Réfugié"),
    ("interne ", "interné "),
    ("Interne ", "Interné "),
    ("poete", "poète"),
    ("Poete", "Poète"),
    ("frere", "frère"),
    ("Frere", "Frère"),
    ("freres", "frères"),
    ("siecle", "siècle"),
    ("Siecle", "Siècle"),
    ("premiere ", "première "),
    ("Premiere ", "Première "),
    ("derniere", "dernière"),
    ("Derniere", "Dernière"),
    ("deuxieme", "deuxième"),
    ("troisieme", "troisième"),
    ("meme ", "même "),
    ("Meme ", "Même "),
    ("systeme", "système"),
    ("Systeme", "Système"),
    ("verite", "vérité"),
    ("liberte", "liberté"),
    ("Liberte", "Liberté"),
    ("societe", "société"),
    ("Societe", "Société"),
    ("celebrite", "célébrité"),
    ("autorite", "autorité"),
    ("majeste", "majesté"),
    ("fierte", "fierté"),
    ("etape", "étape"),
    ("Etape", "Étape"),
    ("epoque", "époque"),
    ("Epoque", "Époque"),
    ("recompense", "récompense"),
    ("theorie", "théorie"),
    ("Theorie", "Théorie"),
    ("vecu", "vécu"),
    ("Vecu", "Vécu"),
    ("concu", "conçu"),
    ("Concu", "Conçu"),
    ("executee", "exécutée"),
    ("execute ", "exécuté "),
    ("Execute ", "Exécuté "),
    ("guillotine ", "guillotiné "),
    ("Guillotine ", "Guillotiné "),
    ("guillotinee", "guillotinée"),
    ("libere ", "libéré "),
    ("Libere ", "Libéré "),
    ("eleve ", "élève "),
    ("Eleve ", "Élève "),
    ("reussit", "réussit"),
    ("Reussit", "Réussit"),
    ("echec", "échec"),
    ("Echec", "Échec"),
    ("celebre ", "célèbre "),
    ("Celebre ", "Célèbre "),
]

def get_all_events():
    r = requests.get(
        SUPABASE_URL + "/rest/v1/events?select=id,description_fr&limit=2000",
        headers=headers
    )
    return r.json()

def update_event(event_id, new_desc):
    r = requests.patch(
        SUPABASE_URL + "/rest/v1/events?id=eq." + event_id,
        headers={**headers, "Prefer": "return=minimal"},
        json={"description_fr": new_desc}
    )
    return r.status_code

events = get_all_events()
print("Evenements a verifier: " + str(len(events)))

updated = 0
for event in events:
    original = event["description_fr"] or ""
    corrected = original
    for wrong, right in CORRECTIONS:
        corrected = corrected.replace(wrong, right)
    if corrected != original:
        status = update_event(event["id"], corrected)
        if status in [200, 201, 204]:
            updated += 1
            print("OK  " + corrected[:70])

print("Termine: " + str(updated) + " descriptions corrigees")
