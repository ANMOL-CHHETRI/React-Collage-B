import urllib.request
import urllib.parse
import re
import subprocess
import time
import json

products = {
    "Organic Wild Himalayan Honey": "site:i.pinimg.com \"honey\" \"nepal\"",
    "Pure Pashmina Cashmere Shawl": "site:i.pinimg.com \"pashmina shawl\"",
    "Gorkha Khukuri": "site:i.pinimg.com \"khukuri\" OR \"kukri knife\"",
    "Organic Himalayan Cardamom": "site:i.pinimg.com \"cardamom spice\"",
    "Mt. Everest Arabica Coffee Beans": "site:i.pinimg.com \"coffee beans\""
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def check_url_with_curl(url):
    try:
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

results = {}

for name, query in products.items():
    print(f"Searching DuckDuckGo for {name}...")
    search_url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    found_accessible = False
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            html = r.read().decode('utf-8')
        
        # Find i.pinimg.com links in href or content
        # Links are often double URL encoded, like https%3A%2F%2Fi.pinimg.com%2F...
        decoded_html = urllib.parse.unquote(html)
        img_urls = re.findall(r'https://i\.pinimg\.com/[a-zA-Z0-9_/.-]+\.(?:jpg|png|jpeg)', decoded_html)
        unique_urls = list(dict.fromkeys(img_urls))
        print(f"Found {len(unique_urls)} raw image links.")
        
        for img_url in unique_urls[:20]:
            # Convert size to 736x
            url_to_test = img_url
            if "originals" in img_url:
                url_to_test = img_url.replace("originals", "736x")
            elif "236x" in img_url:
                url_to_test = img_url.replace("236x", "736x")
            elif "564x" in img_url:
                url_to_test = img_url.replace("564x", "736x")
                
            print(f"Testing image: {url_to_test}")
            if check_url_with_curl(url_to_test):
                results[name] = url_to_test
                print(f"-> FOUND ACCESSIBLE IMAGE: {url_to_test}")
                found_accessible = True
                break
            time.sleep(0.5)
    except Exception as e:
        print(f"Error searching for {name}: {e}")
        
    if not found_accessible:
        print(f"No REAL image found for {name}")
    time.sleep(2)

print("\nDuckDuckGo Found Pinterest Images:")
print(json.dumps(results, indent=2))
with open("verified_pins_ddg.json", "w") as f:
    json.dump(results, f, indent=2)
