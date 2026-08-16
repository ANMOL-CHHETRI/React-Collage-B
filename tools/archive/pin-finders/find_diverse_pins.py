import urllib.request
import urllib.parse
import re
import subprocess
import time
import json

products = {
    "Organic Tea & Coffee": "site:pinterest.com/pin/ \"coffee beans bag\"",
    "Local Handicrafts": "site:pinterest.com/pin/ \"wood carving patan nepal\"",
    "Herbs & Spices": "site:pinterest.com/pin/ \"nepal spices market\"",
    "Himalayan Orthodox Golden Tea": "site:pinterest.com/pin/ \"black tea bag organic\"",
    "Handmade Shakyamuni Buddha Statue": "site:pinterest.com/pin/ \"bronze buddha statue\"",
    "Organic Wild Himalayan Honey": "site:pinterest.com/pin/ \"honey jar organic\"",
    "Pure Pashmina Cashmere Shawl": "site:pinterest.com/pin/ \"cashmere scarf model\"",
    "Gorkha Khukuri": "site:pinterest.com/pin/ \"kukri knife display\"",
    "Organic Himalayan Cardamom": "site:pinterest.com/pin/ \"green cardamom pods\"",
    "Mt. Everest Arabica Coffee Beans": "site:pinterest.com/pin/ \"coffee cup latte art\""
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

used_images = {
    "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg", # Dhaka Topi
    "https://i.pinimg.com/736x/91/9a/c0/919ac0dc8623b378037c83bb370b4be9.jpg"  # Buddha
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
        
        for pin in unique_pins[:15]:
            img_urls = get_pin_images(pin)
            for img_url in img_urls:
                # We prefer 736x size
                url_to_test = img_url
                if "originals" in img_url:
                    url_to_test = img_url.replace("originals", "736x")
                elif "236x" in img_url:
                    url_to_test = img_url.replace("236x", "736x")
                
                # Check uniqueness
                is_unique = True
                for used in used_images:
                    if used.split('/')[-1] in url_to_test or url_to_test.split('/')[-1] in used:
                        is_unique = False
                        break
                
                if not is_unique:
                    continue
                
                print(f"Testing image: {url_to_test}")
                if check_url_with_curl(url_to_test):
                    results[name] = url_to_test
                    used_images.add(url_to_test)
                    print(f"-> FOUND UNIQUE REAL IMAGE: {url_to_test}")
                    found_accessible = True
                    break
            if found_accessible:
                break
            time.sleep(1)
    except Exception as e:
        print(f"Error searching for {name}: {e}")
        
    if not found_accessible:
        print(f"No REAL unique image found for {name}")
    time.sleep(2)

print("\nAll Verified Hot-linkable Pinterest Images:")
print(json.dumps(results, indent=2))
with open("verified_pins_diverse.json", "w") as f:
    json.dump(results, f, indent=2)
