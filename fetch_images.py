import requests
import time
from urllib.parse import quote

SUPABASE_URL = "https://geabolpfdjrclhpqxcwi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWJvbHBmZGpyY2xocHF4Y3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE1NTMyNiwiZXhwIjoyMDkzNzMxMzI2fQ.T4BsishTPZulNh9vBloSnMa6jq7cpobLgykXtCI0aW4"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def get_persons():
    r = requests.get(SUPABASE_URL + "/rest/v1/persons?select=id,name,wikipedia_slug&limit=200", headers=headers)
    return r.json()

def get_wikipedia_image(slug, name):
    if not slug:
        return None
    slug_encoded = quote(slug, safe='')
    for lang in ['en', 'fr']:
        try:
            url = "https://" + lang + ".wikipedia.org/api/rest_v1/page/summary/" + slug_encoded
            r = requests.get(url, timeout=8, headers={"User-Agent": "ChronoHeroes/1.0"})
            if r.status_code == 200:
                data = r.json()
                img = data.get("thumbnail", {}).get("source")
                if img:
                    img = img.replace("/100px-", "/300px-").replace("/150px-", "/300px-").replace("/200px-", "/300px-")
                    return img
        except:
            continue
    return None

def update_image(person_id, image_url):
    r = requests.patch(
        SUPABASE_URL + "/rest/v1/persons?id=eq." + person_id,
        headers=headers,
        json={"image_url": image_url}
    )
    return r.status_code

persons = get_persons()
print("Personnages: " + str(len(persons)))

ok = 0
ko = 0
for p in persons:
    slug = p.get("wikipedia_slug") or ""
    name = p.get("name") or ""
    img = get_wikipedia_image(slug, name)
    if img:
        status = update_image(p["id"], img)
        print("OK  " + name + " (status: " + str(status) + ")")
        ok += 1
    else:
        print("--  " + name)
        ko += 1
    time.sleep(0.5)

print("")
print("Termine: " + str(ok) + " images / " + str(ko) + " sans image")
