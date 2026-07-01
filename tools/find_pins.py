import urllib.request
import urllib.parse
import re
import json
import time

def search_pinterest_images(query):
    # Search DuckDuckGo for pinterest images
    search_query = f"{query} site:pinterest.com"
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(search_query)
    
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
        # Look for pin links or pinimg links in the html
        # DuckDuckGo HTML results have hrefs like "//duckduckgo.com/l/?kh=-1&uddg=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F..."
        pin_urls = re.findall(r'uddg=(https%3A%2F%2Fwww\.pinterest\.com%2Fpin%2F[^&"\']+)', html)
        
        results = []
        for p in pin_urls:
            decoded = urllib.parse.unquote(p)
            # Try to get the pin ID
            pin_id_match = re.search(r'/pin/(\d+)', decoded)
            if pin_id_match:
                pin_id = pin_id_match.group(1)
                results.append(pin_id)
                
        return list(set(results))
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

def get_direct_image_url(pin_id):
    # Fetch the pin page to extract the direct image URL from it
    url = f"https://www.pinterest.com/pin/{pin_id}/"
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        # Look for i.pinimg.com links in the HTML source of the pin page
        img_urls = re.findall(r'https://i\.pinimg\.com/originals/[a-zA-Z0-9_/.-]+\.(?:jpg|png|jpeg)', html)
        if not img_urls:
            img_urls = re.findall(r'https://i\.pinimg\.com/736x/[a-zA-Z0-9_/.-]+\.(?:jpg|png|jpeg)', html)
            
        if img_urls:
            return img_urls[0]
    except Exception as e:
        pass
    return None

products = [
    "Premium Dhaka Topi",
    "Himalayan Orthodox Golden Tea",
    "Handmade Shakyamuni Buddha Statue",
    "Organic Wild Himalayan Honey",
    "Pure Pashmina Cashmere Shawl",
    "Gorkha Khukuri",
    "Organic Himalayan Cardamom",
    "Mt. Everest Arabica Coffee Beans"
]

results = {}
for prod in products:
    print(f"Searching for {prod}...")
    pin_ids = search_pinterest_images(prod)
    found = False
    for pid in pin_ids[:5]: # Try the top 5 pin IDs
        img_url = get_direct_image_url(pid)
        if img_url:
            results[prod] = img_url
            print(f"Found: {img_url}")
            found = True
            break
        time.sleep(1)
    if not found:
        print(f"Could not find direct image for {prod}")
    time.sleep(1)

with open("pinterest_images.json", "w") as f:
    json.dump(results, f, indent=2)
print("Finished!")
