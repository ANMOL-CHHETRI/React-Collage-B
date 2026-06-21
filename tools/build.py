#!/usr/bin/env python3
"""Atomic build script for ShopEase frontend.
Runs npm build, validates output, reports status.

Usage:
    python tools/build.py

Returns:
    Exit code 0 on success, 1 on failure.
"""

import subprocess
import sys
import json
from pathlib import Path


def run_npm_build() -> bool:
    print("[build] Running npm run build...")
    result = subprocess.run(
        ["npm", "run", "build"],
        capture_output=True,
        text=True,
        cwd=Path(__file__).resolve().parent.parent,
        shell=True,
    )
    if result.returncode != 0:
        print(f"[build] FAILED (exit {result.returncode})")
        print(result.stderr)
        return False
    print("[build] npm build succeeded")
    return True


def verify_dist() -> bool:
    dist = Path(__file__).resolve().parent.parent / "dist"
    required = ["index.html"]
    missing = [f for f in required if not (dist / f).is_file()]
    if missing:
        print(f"[build] Missing files in dist/: {missing}")
        return False

    # Check index.html contains the app root
    html = (dist / "index.html").read_text(encoding="utf-8")
    if 'id="root"' not in html:
        print("[build] dist/index.html missing root mount point")
        return False

    # Check JS bundle exists
    js_files = list(dist.glob("assets/*.js"))
    if not js_files:
        print("[build] No JS bundles found in dist/assets/")
        return False

    sizes = {f.name: f.stat().st_size for f in js_files}
    print(f"[build] JS bundles: {json.dumps(sizes, indent=2)}")
    print(f"[build] dist/ verified successfully ({len(list(dist.rglob('*')))} files)")
    return True


def main():
    if not run_npm_build():
        sys.exit(1)
    if not verify_dist():
        sys.exit(1)
    print("[build] Build pipeline complete.")


if __name__ == "__main__":
    main()
