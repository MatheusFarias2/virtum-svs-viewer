#!/usr/bin/env python3
"""Patch the upstream openslide-js WASM build for constrained/mobile browsers.

This keeps the upstream build pipeline and ABI intact, changing only Emscripten
memory-growth settings. The generated JS/WASM remains compatible with the
@computationalpathologygroup/openslide-js TypeScript worker protocol.
"""
from pathlib import Path
import sys

if len(sys.argv) != 2:
    raise SystemExit("usage: patch-build.py <openslide-js-source-dir>")

root = Path(sys.argv[1]).resolve()
script = root / "wasm" / "build-steps" / "build-wasm.sh"
if not script.exists():
    raise SystemExit(f"build script not found: {script}")

text = script.read_text()
if "MAXIMUM_MEMORY=536870912" in text:
    print("mobile memory flags already present")
    raise SystemExit(0)

needle = "    -s ALLOW_MEMORY_GROWTH \\\n"
if needle not in text:
    raise SystemExit("could not find ALLOW_MEMORY_GROWTH in upstream build-wasm.sh; inspect upstream changes before building")

replacement = needle + (
    "    -s INITIAL_MEMORY=16777216 \\\n"
    "    -s MAXIMUM_MEMORY=536870912 \\\n"
    "    -s MEMORY_GROWTH_GEOMETRIC_STEP=0.10 \\\n"
    "    -s MEMORY_GROWTH_GEOMETRIC_CAP=16777216 \\\n"
)
text = text.replace(needle, replacement, 1)
script.write_text(text)
print(f"patched {script}")
print("  initial memory: 16 MiB")
print("  maximum memory: 512 MiB")
print("  growth step: 10%")
print("  growth cap: 16 MiB")
