import csv, uuid, time, requests

SUPABASE_URL = "https://geabolpfdjrclhpqxcwi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWJvbHBmZGpyY2xocHF4Y3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE1NTMyNiwiZXhwIjoyMDkzNzMxMzI2fQ.T4BsishTPZulNh9vBloSnMa6jq7cpobLgykXtCI0aW4"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def get_or_create_person(row):
    name = row["person_name"].strip()
    r = requests.get(
        SUPABASE_URL + "/rest/v1/persons?name=eq." + requests.utils.quote(name) + "&select=id",
        headers=headers
    )
    data = r.json()
    if data:
        return data[0]["id"]
    person = {
        "id": str(uuid.uuid4()),
        "name": name,
        "birthdate_raw": row["person_birthdate"],
        "birthdate_bce": row["person_birthdate"].startswith("-"),
        "deathdate_raw": row["person_deathdate"] or None,
        "deathdate_bce": row["person_deathdate"].startswith("-") if row["person_deathdate"] else False,
        "country": row["person_country"] or None,
        "geo": row["person_geo"] or None,
        "period": row["person_period"] or None,
        "tags": row["person_tags"] or None,
        "wikipedia_slug": row["wikipedia_slug"] or None,
        "importance": int(row["importance"]) if row["importance"] else 3,
    }
    r2 = requests.post(SUPABASE_URL + "/rest/v1/persons", headers=headers, json=person)
    if r2.status_code in [200, 201]:
        return r2.json()[0]["id"]
    return None

def insert_event(row, person_id):
    age_days = int(row["person_age_days"]) if row["person_age_days"] else None
    event = {
        "id": str(uuid.uuid4()),
        "person_id": person_id,
        "person_name": row["person_name"].strip(),
        "event_date_raw": row["event_date"],
        "event_date_bce": row["event_date"].startswith("-"),
        "person_age_days": age_days,
        "age_years": int(row["age_years"]) if row["age_years"] else None,
        "age_months": int(row["age_months"]) if row["age_months"] else None,
        "age_days_rem": int(row["age_days_rem"]) if row["age_days_rem"] else None,
        "age_label": row["age_label"] or None,
        "description_fr": row["description_fr"],
        "category": row["category"],
        "subcategory": row["subcategory"] or None,
        "importance": int(row["importance"]) if row["importance"] else 3,
        "is_posthumous": False,
    }
    r = requests.post(
        SUPABASE_URL + "/rest/v1/events",
        headers={**headers, "Prefer": "return=minimal"},
        json=event
    )
    return r.status_code

total_ok = 0
total_skip = 0

filename = "ch_events_V4.csv"
print("=== Import " + filename + " ===")
try:
    with open(filename, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            person_id = get_or_create_person(row)
            if not person_id:
                print("  ERREUR: " + row["person_name"])
                continue
            status = insert_event(row, person_id)
            if status in [200, 201]:
                total_ok += 1
                print("  OK  " + row["person_name"])
            elif status == 409:
                total_skip += 1
            else:
                print("  ERR " + str(status) + " " + row["person_name"])
            time.sleep(0.1)
except FileNotFoundError:
    print("Fichier " + filename + " introuvable")

print("Termine: " + str(total_ok) + " evenements / " + str(total_skip) + " doublons")
