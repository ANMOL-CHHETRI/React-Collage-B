import urllib.request
import urllib.parse
import re
import subprocess
import time
import json

products = {
    "Organic Tea & Coffee": "site:pinterest.com/pin/ \"tea\" OR \"coffee\"",
    "Local Handicrafts": "site:pinterest.com/pin/ \"nepal handicraft\" OR \"nepal statue\"",
    "Herbs & Spices": "site:pinterest.com/pin/ \"nepal spices\" OR \"nepal honey\"",
    "Himalayan Orthodox Golden Tea": "site:pinterest.com/pin/ \"nepal tea leaf\"",
    "Handmade Shakyamuni Buddha Statue": "site:pinterest.com/pin/ \"buddha statue patan\"",
    "Organic Wild Himalayan Honey": "site:pinterest.com/pin/ \"honey nepal cliff\"",
    "Pure Pashmina Cashmere Shawl": "site:pinterest.com/pin/ \"pashmina shawl model\"",
    "Gorkha Khukuri": "site:pinterest.com/pin/ \"khukuri knife nepal\"",
    "Organic Himalayan Cardamom": "site:pinterest.com/pin/ \"cardamom pods nepal\"",
    "Mt. Everest Arabica Coffee Beans": "site:pinterest.com/pin/ \"nepal coffee cup\""
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def check_url_with_curl(url):
    try:
        # Run curl.exe to check headers
        cmd = [
            'curl.exe', '-I', '-s',
            '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            '-H', 'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            url
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        stdout = res.stdout.lower()
        if "200 ok" in stdout and "content-type: image/" in stdout:
            return True
    except Exception as e:
        pass
    return False

def get_pin_images(pin_url):
    try:
        req = urllib.request.Request(pin_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            html = r.read().decode('utf-8')
        # find pin images
        found = re.findall(r'https://i\.pinimg\.com/[a-zA-Z0-9_/.-]+\.(?:jpg|png|jpeg)', html)
        return list(set(found))
    except Exception as e:
        pass
    return []

results = {}

for name, query in products.items():
    print(f"Searching for {name}...")
    search_url = 'https://search.yahoo.com/search?p=' + urllib.parse.quote(query)
    found_accessible = False
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            html = r.read().decode('utf-8')
        
        pins = re.findall(r'https?://(?:www\.)?pinterest\.com/pin/\d+', html)
        unique_pins = list(dict.fromkeys(pins))
        print(f"Found {len(unique_pins)} pins on search results page.")
        
        for pin in unique_pins[:12]:
            img_urls = get_pin_images(pin)
            for img_url in img_urls:
                # We prefer 736x size
                url_to_test = img_url
                if "originals" in img_url:
                    url_to_test = img_url.replace("originals", "736x")
                elif "236x" in img_url:
                    url_to_test = img_url.replace("236x", "736x")
                
                print(f"Testing image: {url_to_test}")
                if check_url_with_curl(url_to_test):
                    results[name] = url_to_test
                    print(f"-> FOUND REAL IMAGE: {url_to_test}")
                    found_accessible = True
                    break
            if found_accessible:
                break
            time.sleep(1)
    except Exception as e:
        print(f"Error searching for {name}: {e}")
        
    if not found_accessible:
        print(f"No REAL image found for {name}")
    time.sleep(2)

print("\nAll Verified Hot-linkable Pinterest Images (200 OK + Content-Type: image/):")
print(json.dumps(results, indent=2))
with open("verified_pins_real.json", "w") as f:
    json.dump(results, f, indent=2)
