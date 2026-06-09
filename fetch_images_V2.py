"""
ChronoHeroes — Fetch images V2
================================
Récupère les images Wikipedia pour les 5 nouveaux personnages
et met à jour image_url dans Supabase.

Usage : python fetch_images_V2.py
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

PERSONS = [
    ("e0ddfd21-f4b6-476f-a029-8baac2a6d8f0", "Edgar Morin",         "Edgar_Morin"),
    ("86024a0b-cb1a-4038-a053-ee81ab01b71e", "Baruch Spinoza",      "Baruch_Spinoza"),
    ("c24c35cc-aa61-41b9-9821-45985b6f9770", "Friedrich Nietzsche", "Friedrich_Nietzsche"),
    ("b713b830-a218-4166-9629-829745750285", "George Harrison",     "George_Harrison"),
    ("33c79785-220d-410f-8669-8b065c43b9df", "Ringo Starr",         "Ringo_Starr"),
]

def get_wikipedia_image(slug):
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

def main():
    print("=== ChronoHeroes — Fetch images V2 ===\n")
    if not SUPABASE_KEY:
        print("Clé Supabase introuvable dans .env.local")
        return
    for person_id, name, slug in PERSONS:
        img = get_wikipedia_image(slug)
        if img:
            requests.patch(
                f"{SUPABASE_URL}/rest/v1/persons",
                headers=HEADERS,
                params={"id": f"eq.{person_id}"},
                json={"image_url": img},
            )
            print(f"  ✓ {name} → {img[:70]}")
        else:
            print(f"  – {name} : pas d'image trouvée")
        time.sleep(0.4)
    print("\nTerminé !")

if __name__ == "__main__":
    main()
