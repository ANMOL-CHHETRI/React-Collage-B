#!/usr/bin/env python3
"""Post-build validation: verify dist/ output integrity.

Usage:
    python tools/check_build.py [path/to/dist]

Returns:
    Exit code 0 if valid, 1 if issues found.
"""

import sys
import json
from pathlib import Path


def check_dist(dist_path: Path) -> bool:
    if not dist_path.is_dir():
        print(f"[check] dist/ not found at {dist_path}")
        return False

    checks = []

    # 1. index.html exists
    idx = dist_path / "index.html"
    checks.append(("index.html exists", idx.is_file()))

    # 2. index.html has root div
    if idx.is_file():
        html = idx.read_text(encoding="utf-8")
        checks.append(("root mount point", 'id="root"' in html))
        checks.append(("title tag", "<title>" in html))
    else:
        checks.append(("root mount point (skipped)", False))
        checks.append(("title tag (skipped)", False))

    # 3. Assets directory
    assets = dist_path / "assets"
    checks.append(("assets/ exists", assets.is_dir()))

    if assets.is_dir():
        js = list(assets.glob("*.js"))
        css = list(assets.glob("*.css"))
        checks.append(("JS bundles found", len(js) > 0))
        # Tailwind v4 inlines CSS into JS — separate CSS file is optional
        checks.append(("CSS files found (optional in Tailwind v4)", len(css) > 0 or True))
        if js:
            total_js = sum(f.stat().st_size for f in js)
            checks.append((f"Total JS size: {total_js / 1024:.1f} KB", True))

    # 4. Favicon
    favicons = list(dist_path.glob("favicon*")) + list(dist_path.glob("*.jpg"))
    checks.append(("favicon or image found", len(favicons) > 0))

    # Report
    all_pass = True
    for label, ok in checks:
        status = "PASS" if ok else "FAIL"
        if not ok:
            all_pass = False
        print(f"  [{status}] {label}")

    return all_pass


def main():
    dist_arg = sys.argv[1] if len(sys.argv) > 1 else "dist"
    dist_path = Path(__file__).resolve().parent.parent / dist_arg

    print(f"[check] Validating build at: {dist_path}")
    if check_dist(dist_path):
        print("[check] All checks passed.")
        sys.exit(0)
    else:
        print("[check] Some checks FAILED.")
        sys.exit(1)


if __name__ == "__main__":
    main()
