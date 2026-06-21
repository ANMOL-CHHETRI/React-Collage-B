#!/usr/bin/env python3
"""Test that the built app loads without JS syntax errors."""
import re, sys
from pathlib import Path

dist = Path(__file__).resolve().parent.parent / "dist"
assets = dist / "assets"

js_files = list(assets.glob("*.js"))
if not js_files:
    print("FAIL: No JS files in dist/assets/")
    sys.exit(1)

js_path = js_files[0]
js = js_path.read_text(encoding="utf-8")

# Check basic structure
checks = [
    ("import statements", "import " in js),
    ("React.createElement or jsx", "createElement" in js or "jsx" in js),
    ("export", "export " in js),
    ("non-empty", len(js) > 10000),
]

all_pass = True
for label, ok in checks:
    status = "PASS" if ok else "FAIL"
    if not ok:
        all_pass = False
    print(f"  [{status}] {label}")

print(f"\nJS size: {len(js)} bytes")

# Try to parse with Node
import subprocess
result = subprocess.run(
    ["node", "--check", str(js_path)],
    capture_output=True, text=True
)
if result.returncode == 0:
    print("  [PASS] Node syntax check")
else:
    print(f"  [FAIL] Node syntax check: {result.stderr.strip()}")
    all_pass = False

sys.exit(0 if all_pass else 1)
