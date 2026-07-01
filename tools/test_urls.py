import urllib.request
import json

urls_to_test = {
    # Products
    "id_1_dhaka_topi": "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg",
    "id_2_tea": "https://i.pinimg.com/736x/d6/1f/26/d61f26792cb005e83ec551c045b63bc5.jpg",
    "id_3_buddha": "https://i.pinimg.com/736x/91/9a/c0/919ac0dc8623b378037c83bb370b4be9.jpg",
    "id_4_honey": "https://i.pinimg.com/736x/c9/79/fb/c979fbbcb34ffbb8c31cbcc2f62b6623.jpg",
    "id_5_pashmina": "https://i.pinimg.com/736x/be/98/94/be9894cb3d1f114c000e3efbc4d79a55.jpg",
    "id_6_khukuri": "https://i.pinimg.com/736x/21/bc/d0/21bcd0a2fca898c0d1279a557876a3e5c.jpg",
    "id_7_cardamom": "https://i.pinimg.com/736x/e4/c7/2a/e4c72a6e92b8d000fa2bf6103328d000.jpg",
    "id_8_coffee": "https://i.pinimg.com/736x/80/7e/61/807e61e05001ffecf9a562ef6c41b800.jpg",
    # Categories
    "cat_apparel": "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg",
    "cat_tea": "https://i.pinimg.com/736x/80/7e/61/807e61e05001ffecf9a562ef6c41b800.jpg",
    "cat_handicrafts": "https://i.pinimg.com/736x/43/e7/70/43e7706d860d5bfa10a716c52a0a2df3.jpg",
    "cat_herbs": "https://i.pinimg.com/736x/c9/79/fb/c979fbbcb34ffbb8c31cbcc2f62b6623.jpg",
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': '',
}

results = {}
print(f"{'Name':<25} {'Status':<8} {'Content-Type':<30}")
print("-" * 65)
for name, url in urls_to_test.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            status = resp.status
            ctype = resp.headers.get('Content-Type', 'unknown')
            ok = status == 200 and 'image/' in ctype
            print(f"{name:<25} {status:<8} {ctype:<30}  {'✓ OK' if ok else '✗ FAIL'}")
            results[name] = {"url": url, "ok": ok, "status": status, "ctype": ctype}
    except Exception as e:
        err = str(e)[:50]
        print(f"{name:<25} {'ERROR':<8} {err:<30}")
        results[name] = {"url": url, "ok": False, "status": "ERROR", "ctype": str(e)}

with open("url_test_results.json", "w") as f:
    json.dump(results, f, indent=2)
print("\nResults saved to url_test_results.json")
