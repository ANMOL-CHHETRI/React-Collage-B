import re

with open('src/data/productsData.js', 'r') as f:
    content = f.read()

def replace_func(match):
    image_line = match.group(0)
    image_url = match.group(1)
    
    # We will add 3 images in an array
    # First image is the original one
    # Second and third are generic beautiful pinterest placeholders that fit the theme
    extra1 = 'https://i.pinimg.com/736x/8f/58/01/8f5801c876fbd1cbcc45187ad38dcfe0.jpg'
    extra2 = 'https://i.pinimg.com/736x/01/be/df/01bedf7a810f666cf4047a27eb2d0a0b.jpg'
    
    return f'{image_line}\n    images: ["{image_url}", "{extra1}", "{extra2}"],'

new_content = re.sub(r'image:\s*"([^"]+)",', replace_func, content)

with open('src/data/productsData.js', 'w') as f:
    f.write(new_content)
print('Done!')
