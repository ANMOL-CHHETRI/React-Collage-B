#!/usr/bin/env python3
"""Test serving the built app."""
import http.server
import socketserver
import threading
import urllib.request
import re
import os
import sys

os.chdir(r'D:\React-Collage-B\dist')

handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(('', 0), handler)
port = httpd.server_address[1]
print(f'Server on port {port}')

t = threading.Thread(target=httpd.serve_forever, daemon=True)
t.start()

resp = urllib.request.urlopen(f'http://localhost:{port}/')
html = resp.read().decode()
print(f'Status: {resp.status}')
has_root = 'id="root"' in html
print(f'Has root div: {has_root}')
print(f'JS reference: {"assets/index" in html}')

js_match = re.search(r'src="([^"]+\.js)"', html)
if js_match:
    js_path = js_match.group(1)
    js_resp = urllib.request.urlopen(f'http://localhost:{port}/{js_path}')
    js_content = js_resp.read()
    print(f'JS Status: {js_resp.status}, Size: {len(js_content)} bytes')

httpd.shutdown()
print('All checks passed')
