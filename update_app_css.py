import sys

def interpolate(c1, c2, t):
    r1, g1, b1 = int(c1[1:3], 16), int(c1[3:5], 16), int(c1[5:7], 16)
    r2, g2, b2 = int(c2[1:3], 16), int(c2[3:5], 16), int(c2[5:7], 16)
    r = int(r1 + (r2 - r1) * t)
    g = int(g1 + (g2 - g1) * t)
    b = int(b1 + (b2 - b1) * t)
    return f"#{r:02x}{g:02x}{b:02x}"

def gen_neutrals():
    p = {}
    c_light = "#ffffff"
    c_mid = "#938ba1"
    c_dark = "#0a100d"
    
    stops_light = [50, 100, 200, 300, 400, 500]
    for i, stop in enumerate(stops_light):
        t = i / 5.0
        p[stop] = interpolate(c_light, c_mid, t)
        
    stops_dark = [500, 600, 700, 800, 900]
    for i, stop in enumerate(stops_dark):
        t = i / 4.0
        p[stop] = interpolate(c_mid, c_dark, t)
        
    p[950] = interpolate(c_dark, "#000000", 0.3)
    return p

def gen_brands():
    p = {}
    c_white = "#ffffff"
    c_orange = "#f06543"
    c_red = "#6f1d1b"
    c_black = "#0a100d"
    
    stops_1 = [50, 100, 200, 300, 400, 500]
    for i, stop in enumerate(stops_1):
        t = i / 5.0
        p[stop] = interpolate(c_white, c_orange, t)
        
    stops_2 = [500, 600, 700]
    for i, stop in enumerate(stops_2):
        t = i / 2.0
        p[stop] = interpolate(c_orange, c_red, t)
        
    stops_3 = [700, 800, 900]
    for i, stop in enumerate(stops_3):
        t = i / 2.0
        p[stop] = interpolate(c_red, c_black, t)
        
    p[950] = interpolate(c_black, "#000000", 0.3)
    return p

n = gen_neutrals()
b = gen_brands()

css = '@import "tailwindcss";\n\n@theme {\n'

# Slate and Gray
for name in ['slate', 'gray', 'zinc']:
    for stop, color in n.items():
        css += f'  --color-{name}-{stop}: {color};\n'
    css += '\n'

# Amber and Orange and Red
for name in ['amber', 'orange', 'red']:
    for stop, color in b.items():
        css += f'  --color-{name}-{stop}: {color};\n'
    css += '\n'

css += '}\n\n@custom-variant dark (&:where(.dark, .dark *));\n\nbody {\n  font-family: system-ui, -apple-system, \'Segoe UI\', Roboto, sans-serif;\n}\n'

with open('src/App.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("App.css updated successfully.")
