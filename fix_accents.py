import requests

SUPABASE_URL = "https://geabolpfdjrclhpqxcwi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWJvbHBmZGpyY2xocHF4Y3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE1NTMyNiwiZXhwIjoyMDkzNzMxMzI2fQ.T4BsishTPZulNh9vBloSnMa6jq7cpobLgykXtCI0aW4"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json"
}

# Uniquement les mots sans ambiguite de conjugaison
CORRECTIONS = [
    ("chretienne", "chrétienne"),
    ("chretien", "chrétien"),
    ("Arretee ", "Arrêtée "),
    ("arretee ", "arrêtée "),
    ("Lynchee ", "Lynchée "),
    ("activites", "activités"),
    ("universite", "université"),
    ("Universite", "Université"),
    ("mathematiques", "mathématiques"),
    ("Mathematiques", "Mathématiques"),
    ("Ecole ", "École "),
    ("ecole ", "école "),
    ("Eglise", "Église"),
    ("eglise", "église"),
    ("Theatre", "Théâtre"),
    ("theatre", "théâtre"),
    ("Republique", "République"),
    ("republique", "république"),
    ("Revolution", "Révolution"),
    ("revolution", "révolution"),
    ("Academie", "Académie"),
    ("academie", "académie"),
    ("medecine", "médecine"),
    ("Medecine", "Médecine"),
    ("medaille", "médaille"),
    ("Medaille", "Médaille"),
    ("independance", "indépendance"),
    ("Independance", "Indépendance"),
    ("experience", "expérience"),
    ("Experience", "Expérience"),
    ("Decouvre", "Découvre"),
    ("decouvre", "découvre"),
    ("liberation", "libération"),
    ("Liberation", "Libération"),
    ("resistance", "résistance"),
    ("Resistance", "Résistance"),
    ("creation", "création"),
    ("Creation", "Création"),
    ("election", "élection"),
    ("Election", "Élection"),
    ("negociation", "négociation"),
    ("Negociation", "Négociation"),
    ("Premiere ", "Première "),
    ("premiere ", "première "),
    ("etudiant", "étudiant"),
    ("Etudiant", "Étudiant"),
    ("francais", "français"),
    ("Francais", "Français"),
    ("francaise", "française"),
    ("Francaise", "Française"),
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
