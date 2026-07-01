import zipfile
import xml.etree.ElementTree as ET
import sys

def docx_to_text(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespace map for Word XML
            ns = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            }
            
            paragraphs = []
            for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                text_elems = para.findall('.//{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t')
                text = ''.join([node.text for node in text_elems if node.text])
                if text:
                    paragraphs.append(text)
            
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error: {e}"

if __name__ == '__main__':
    doc_path = sys.argv[1] if len(sys.argv) > 1 else 'ShopEase_Documentation.docx'
    text = docx_to_text(doc_path)
    with open('docs_text.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully wrote extracted text to docs_text.txt")
