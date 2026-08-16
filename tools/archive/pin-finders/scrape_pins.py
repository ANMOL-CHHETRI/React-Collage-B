import urllib.request
import urllib.parse
import re
import json
import time

products = {
    "Premium Dhaka Topi": "site:pinterest.com/pin/ \"dhaka topi\"",
    "Himalayan Orthodox Golden Tea": "site:pinterest.com/pin/ \"orthodox tea\" OR \"nepal tea\"",
    "Handmade Shakyamuni Buddha Statue": "site:pinterest.com/pin/ \"buddha statue\"",
    "Organic Wild Himalayan Honey": "site:pinterest.com/pin/ \"himalayan honey\"",
    "Pure Pashmina Cashmere Shawl": "site:pinterest.com/pin/ \"pashmina shawl\"",
    "Gorkha Khukuri": "site:pinterest.com/pin/ \"khukuri\" OR \"kukri knife\"",
    "Organic Himalayan Cardamom": "site:pinterest.com/pin/ \"cardamom\"",
    "Mt. Everest Arabica Coffee Beans": "site:pinterest.com/pin/ \"coffee beans\" OR \"nepal coffee\""
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
}

def get_pin_image(pin_url):
    try:
        req = urllib.request.Request(pin_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode('utf-8')
        # Search for og:image meta tag
        m = re.search(r'<meta[^>]*property="og:image"[^>]*content="(https://i\.pinimg\.com/[^"]+)"', html)
        if m:
            return m.group(1)
        m2 = re.search(r'"https://i\.pinimg\.com/[^"]+\.jpg"', html)
        if m2:
            return m2.group(0).strip('"')
    except Exception as e:
        print(f"Error fetching pin {pin_url}: {e}")
    return None

results = {
    "Premium Dhaka Topi": "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg" # Already found!
}

for name, query in products.items():
    if name in results:
        continue
    print(f"Searching Yahoo for: {name}...")
    url = 'https://search.yahoo.com/search?p=' + urllib.parse.quote(query)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode('utf-8')
        
        matches = re.findall(r'https?://(?:www\.)?pinterest\.com/pin/[a-zA-Z0-9_\.-]+', html)
        if matches:
            unique_matches = list(dict.fromkeys(matches)) # Preserve order
            print(f"Found {len(unique_matches)} pins for {name}.")
            for pin_url in unique_matches[:3]: # Try first 3
                print(f"Trying pin: {pin_url}")
                img_url = get_pin_image(pin_url)
                if img_url:
                    results[name] = img_url
                    print(f"Success: {img_url}")
                    break
                time.sleep(1)
        else:
            print(f"No pin URLs found for {name}")
    except Exception as e:
        print(f"Error searching {name}: {e}")
    time.sleep(2)

print("\nFinal Results:")
print(json.dumps(results, indent=2))

with open("pinterest_images.json", "w") as f:
    json.dump(results, f, indent=2)
