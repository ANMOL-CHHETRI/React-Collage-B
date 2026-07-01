import urllib.request
import urllib.parse
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def get_first_image(query):
    url = 'https://search.yahoo.com/search?p=' + urllib.parse.quote(query)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode('utf-8')
        pins = re.findall(r'https?://(?:www\.)?pinterest\.com/pin/[a-zA-Z0-9_\.-]+', html)
        for pin in pins[:3]:
            try:
                req = urllib.request.Request(pin, headers=headers)
                with urllib.request.urlopen(req, timeout=10) as r:
                    pin_html = r.read().decode('utf-8')
                m = re.search(r'<meta[^>]*property="og:image"[^>]*content="(https://i\.pinimg\.com/[^"]+)"', pin_html)
                if m:
                    return m.group(1)
            except Exception as e:
                pass
    except Exception as e:
        print(f"Error: {e}")
    return None

print("Backpack:", get_first_image('site:pinterest.com/pin/ canvas backpack'))
print("Phone Case:", get_first_image('site:pinterest.com/pin/ phone case'))
