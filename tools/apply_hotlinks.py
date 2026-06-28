import os

def apply_updates():
    products_path = "src/data/productsData.js"
    homepage_path = "src/pages/HomePage.jsx"

    # 1. Update productsData.js
    if os.path.exists(products_path):
        with open(products_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Replace product images
        content = content.replace(
            '"https://i.pinimg.com/736x/21/df/97/21df97eb098e945c7e148cebbd8e3d09.jpg"',
            '"https://i.pinimg.com/736x/d6/1f/26/d61f26792cb005e83ec551c045b63bc5.jpg"'
        )
        content = content.replace(
            '"https://i.pinimg.com/736x/8f/58/01/8f5801314672479768bada91c28c8dbb.jpg"',
            '"https://i.pinimg.com/736x/91/9a/c0/919ac0dc8623b378037c83bb370b4be9.jpg"'
        )
        content = content.replace(
            '"https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg"',
            '"https://i.pinimg.com/736x/c9/79/fb/c979fbbcb34ffbb8c31cbcc2f62b6623.jpg"'
        )
        content = content.replace(
            '"https://i.pinimg.com/736x/11/49/74/114974246fa4d567c9c05e54d8ecdb2f.jpg"',
            '"https://i.pinimg.com/736x/be/98/94/be9894cb3d1f114c000e3efbc4d79a55.jpg"'
        )
        content = content.replace(
            '"https://i.pinimg.com/736x/9f/fa/b1/9ffab17cfd6c62f275727931b26c04f5.jpg"',
            '"https://i.pinimg.com/736x/21/bc/d0/21bcd0a2fca898c0d1279a557876a3e5c.jpg"'
        )
        content = content.replace(
            '"https://i.pinimg.com/736x/3f/82/ff/3f82ff025c898c0d1279a557876a3e5c.jpg"',
            '"https://i.pinimg.com/736x/e4/c7/2a/e4c72a6e92b8d000fa2bf6103328d000.jpg"'
        )
        content = content.replace(
            '"https://i.pinimg.com/736x/82/05/69/820569994589255755.jpg"',
            '"https://i.pinimg.com/736x/80/7e/61/807e61e05001ffecf9a562ef6c41b800.jpg"'
        )

        # Update migration logic
        migration_target = 'const image = (!existing.image || existing.image.includes("unsplash.com")) ? def.image : existing.image'
        migration_replacement = """const isOldOrBroken = !existing.image || 
      existing.image.includes("unsplash.com") || 
      existing.image.includes("21/df/97") || 
      existing.image.includes("8f/58/01") || 
      existing.image.includes("01/be/df") || 
      existing.image.includes("11/49/74") || 
      existing.image.includes("9f/fa/b1") || 
      existing.image.includes("3f/82/ff") || 
      existing.image.includes("82/05/69")
    const image = isOldOrBroken ? def.image : existing.image"""

        content = content.replace(migration_target, migration_replacement)
        content = content.replace(migration_target.replace("\r\n", "\n"), migration_replacement)

        with open(products_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated productsData.js image URLs and migration logic.")

    # 2. Update HomePage.jsx category images
    if os.path.exists(homepage_path):
        with open(homepage_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Replace category image links in HomePage.jsx
        content = content.replace(
            'image:\n      "https://i.pinimg.com/736x/82/05/69/820569994589255755.jpg"',
            'image:\n      "https://i.pinimg.com/736x/80/7e/61/807e61e05001ffecf9a562ef6c41b800.jpg"'
        )
        content = content.replace(
            'image:\n      "https://i.pinimg.com/736x/8f/58/01/8f5801314672479768bada91c28c8dbb.jpg"',
            'image:\n      "https://i.pinimg.com/736x/43/e7/70/43e7706d860d5bfa10a716c52a0a2df3.jpg"'
        )
        content = content.replace(
            'image:\n      "https://i.pinimg.com/736x/01/be/df/01bedf72df9b4b035178652d88820f4f.jpg"',
            'image:\n      "https://i.pinimg.com/736x/c9/79/fb/c979fbbcb34ffbb8c31cbcc2f62b6623.jpg"'
        )

        with open(homepage_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated HomePage.jsx category URLs.")

apply_updates()
