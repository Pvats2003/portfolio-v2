"""Depth map for the /world/depth "3D photo" test, made locally with Depth Anything V2 Small (Apache-2.0).

    python3 scripts/world-depth.py            # needs: pip install onnxruntime numpy pillow

Reads the keyed land plate (public/world/plates/land-day-1600.webp, from `npm run world:plates`), puts it over a
plain sky so the model sees a sky rather than a hole, estimates relative depth, forces the sky to "far", and writes
public/world/depth/land-day-depth.png (8-bit greyscale, white = near). The model (~100 MB ONNX export by
fabio-sim/Depth-Anything-ONNX) is downloaded once into .cache/ and never committed.
"""
import os
import sys
import urllib.request

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

ROOT = os.getcwd()
SRC = os.path.join(ROOT, sys.argv[1] if len(sys.argv) > 1 else "public/world/plates/land-day-1600.webp")
OUT = os.path.join(ROOT, "public/world/depth/land-day-depth.png")
MODEL_URL = "https://github.com/fabio-sim/Depth-Anything-ONNX/releases/download/v2.0.0/depth_anything_v2_vits_dynamic.onnx"
MODEL = os.path.join(ROOT, ".cache/depth_anything_v2_vits_dynamic.onnx")
W, H = 924, 518  # model input: multiples of 14, 16:9-ish
OUT_W, OUT_H = 960, 540

if not os.path.exists(MODEL):
    os.makedirs(os.path.dirname(MODEL), exist_ok=True)
    print("Downloading Depth Anything V2 Small (ONNX, ~100 MB)…")
    urllib.request.urlretrieve(MODEL_URL, MODEL)

plate = Image.open(SRC).convert("RGBA")
alpha = np.asarray(plate.getchannel("A"), dtype=np.float32) / 255
# A plain golden-hour sky behind the keyed land, like the page's stand-in sky.
sky = np.zeros((plate.height, plate.width, 3), dtype=np.float32)
t = np.linspace(0, 1, plate.height)[:, None]
sky[..., 0] = 127 + (243 - 127) * t
sky[..., 1] = 176 + (220 - 176) * t
sky[..., 2] = 220 + (188 - 220) * t
rgb = np.asarray(plate.convert("RGB"), dtype=np.float32)
comp = rgb * alpha[..., None] + sky * (1 - alpha[..., None])

x = np.asarray(Image.fromarray(comp.astype(np.uint8)).resize((W, H), Image.BICUBIC), dtype=np.float32) / 255
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)

session = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
depth = session.run(None, {"image": x})[0][0]  # relative inverse depth: larger = nearer

d = (depth - depth.min()) / (depth.max() - depth.min() + 1e-6)
d = np.asarray(Image.fromarray((d * 65535).astype(np.uint16)).resize((OUT_W, OUT_H), Image.BICUBIC), dtype=np.float32) / 65535
sky_mask = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).resize((OUT_W, OUT_H), Image.BILINEAR), dtype=np.float32) / 255
d = d * sky_mask  # the sky is as far as it gets
img = Image.fromarray(np.clip(d * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, optimize=True)
print(f"Wrote {os.path.relpath(OUT, ROOT)} ({OUT_W}×{OUT_H}, {os.path.getsize(OUT) // 1024} KB)")
