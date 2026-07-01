import os
import re

def process_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    orig = content
    
    # We want to replace <img ... /> with <img referrerPolicy="no-referrer" ... />
    # Let's do a regex replacement that adds referrerPolicy="no-referrer" if not present.
    # We look for <img tags.
    
    # Find all <img tags and add referrerPolicy="no-referrer" to them
    def replacer(match):
        img_tag = match.group(0)
        if 'referrerPolicy' in img_tag:
            return img_tag
        # Insert referrerPolicy="no-referrer" right after '<img'
        return img_tag.replace('<img', '<img referrerPolicy="no-referrer"')

    # Match <img until closing > or />
    content = re.sub(r'<img[^>]*>', replacer, content)
    
    if content != orig:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")

# Run across all .jsx files in src/
for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".jsx"):
            process_file(os.path.join(root, file))
