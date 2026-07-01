import urllib.request
import urllib.parse
import re

urls = [
    "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg", # Dhaka Topi
    "https://i.pinimg.com/736x/21/df/97/21df97eb098e945c7e148cebbd8e3d09.jpg", # Tea
    "https://i.pinimg.com/736x/8f/58/01/8f5801314672479768bada91c28c8dbb.jpg", # Buddha
    "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg", # Honey
    "https://i.pinimg.com/736x/11/49/74/114974246fa4d567c9c05e54d8ecdb2f.jpg", # Shawl
    "https://i.pinimg.com/736x/9f/fa/b1/9ffab17cfd6c62f275727931b26c04f5.jpg", # Khukuri
    "https://i.pinimg.com/736x/3f/82/ff/3f82ff025c898c0d1279a557876a3e5c.jpg", # Cardamom
    "https://i.pinimg.com/736x/82/05/69/820569994589255755.jpg"                # Coffee
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
}

for url in urls:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            status = r.status
            length = len(r.read())
        print(f"{url}: {status} (len={length})")
    except Exception as e:
        print(f"{url}: Failed ({e})")
