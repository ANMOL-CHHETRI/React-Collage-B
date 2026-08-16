import urllib.request
import urllib.parse
import re
import time

products = {
    "Himalayan Orthodox Golden Tea": "site:pinterest.com/pin/ \"tea\"",
    "Handmade Shakyamuni Buddha Statue": "site:pinterest.com/pin/ \"buddha statue\"",
    "Organic Wild Himalayan Honey": "site:pinterest.com/pin/ \"honey\"",
    "Pure Pashmina Cashmere Shawl": "site:pinterest.com/pin/ \"pashmina shawl\"",
    "Gorkha Khukuri": "site:pinterest.com/pin/ \"khukuri\" OR \"kukri knife\"",
    "Organic Himalayan Cardamom": "site:pinterest.com/pin/ \"cardamom\"",
    "Mt. Everest Arabica Coffee Beans": "site:pinterest.com/pin/ \"coffee beans\""
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
}

def get_pin_images(pin_url):
    try:
        req = urllib.request.Request(pin_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            html = r.read().decode('utf-8')
        
        # Extract all i.pinimg.com links
        found = re.findall(r'https://i\.pinimg\.com/(?:originals|736x)/[a-zA-Z0-9_/.-]+\.(?:jpg|png|jpeg)', html)
        return list(set(found))
    except Exception as e:
        pass
    return []

def test_image_url(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            if r.status == 200:
                # Read a small chunk to confirm
                r.read(1024)
                return True
    except Exception as e:
        pass
    return False

results = {}

for name, query in products.items():
    print(f"Searching for hot-linkable image for: {name}...")
    url = 'https://search.yahoo.com/search?p=' + urllib.parse.quote(query)
    found_accessible = False
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            html = r.read().decode('utf-8')
        
        pins = re.findall(r'https?://(?:www\.)?pinterest\.com/pin/[a-zA-Z0-9_\.-]+', html)
        unique_pins = list(dict.fromkeys(pins))
        
        for pin in unique_pins[:10]: # Check up to 10 pins
            img_urls = get_pin_images(pin)
            for img_url in img_urls:
                # Try both originals and 736x variations
                variations = [img_url]
                if "originals" in img_url:
                    variations.append(img_url.replace("originals", "736x"))
                elif "736x" in img_url:
                    variations.append(img_url.replace("736x", "originals"))
                
                for var_url in variations:
                    print(f"Testing: {var_url}")
                    if test_image_url(var_url):
                        results[name] = var_url
                        print(f"FOUND ACCESSIBLE IMAGE: {var_url}")
                        found_accessible = True
                        break
                if found_accessible:
                    break
            if found_accessible:
                break
            time.sleep(1)
    except Exception as e:
        print(f"Error for {name}: {e}")
        
    if not found_accessible:
        print(f"Could not find accessible image for {name}")
    time.sleep(2)

print("\nVerified Hot-linkable Pinterest Image URLs:")
import json
print(json.dumps(results, indent=2))
