import urllib.request
import urllib.parse
import json
import time

# Pin IDs extracted from user's embed codes
pins = {
    "id_2_tea":            "146507794123527024",
    "id_3_buddha":         "1088323066416471298",
    "id_4_honey":          "608619337179871638",
    "id_5_pashmina":       "1066649492993057199",
    "id_6_khukuri":        "304344887338912162",
    "id_7_cardamom":       "19140367163494051",
    "id_8_coffee":         "814588651394510426",
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/html, */*',
}

results = {}

for name, pin_id in pins.items():
    pin_url = f"https://www.pinterest.com/pin/{pin_id}/"
    oembed_url = f"https://www.pinterest.com/oembed.json?url={urllib.parse.quote(pin_url)}"
    print(f"\nFetching {name} (pin {pin_id})...")
    try:
        req = urllib.request.Request(oembed_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            thumb = data.get("thumbnail_url", "")
            # Convert to 736x if it's smaller
            full_url = thumb.replace("/60x60/", "/736x/").replace("/236x/", "/736x/").replace("/474x/", "/736x/").replace("/564x/", "/736x/")
            results[name] = full_url
            print(f"  -> {full_url}")
    except Exception as e:
        print(f"  ERROR: {e}")
        results[name] = None
    time.sleep(0.5)

print("\n\n=== FINAL RESULTS ===")
for k, v in results.items():
    print(f"{k}: {v}")

with open("pinterest_cdn_urls.json", "w") as f:
    json.dump(results, f, indent=2)
print("\nSaved to pinterest_cdn_urls.json")
