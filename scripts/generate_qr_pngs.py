#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate 2048x2048 PNG QR codes for six checkpoints.
Content format: "checkpoint:<id>"
Valid IDs: signin, esports, coffee, makeup, sleep, breeze
Output dir: output/qrcodes/
Center icon overlay: disabled by default (set ENABLE_CENTER_ICON=True to enable).
"""
import os
from typing import Tuple

try:
    import qrcode
    from qrcode.constants import ERROR_CORRECT_H
    from PIL import Image, ImageDraw
except Exception:
    raise SystemExit("Missing dependencies: please install 'qrcode' and 'Pillow'.")

CHECKPOINT_IDS = [
    "signin",
    "esports",
    "coffee",
    "makeup",
    "sleep",
    "breeze",
]

BASE_DIR = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "output", "qrcodes")
STAMPS_DIR = os.path.join(BASE_DIR, "..", "images", "stamps")
ICONS_DIR = os.path.join(BASE_DIR, "..", "images", "icons")
os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGET_SIZE: Tuple[int, int] = (2048, 2048)
OVERLAY_BOX_SIZE = 512  # square box placed at center
OVERLAY_BOX_RADIUS = 64 # rounded corner radius
ICON_MAX_SIZE = 420     # max icon size within overlay box

# Toggle: set True to enable center icon overlay
ENABLE_CENTER_ICON = False


def try_open_rgba(path: str) -> Image.Image:
    try:
        img = Image.open(path)
        img.load()  # ensure data read
        return img.convert("RGBA")
    except Exception:
        return None


def load_icon(cid: str) -> Image.Image:
    # preferred: per-checkpoint stamp icon
    preferred = os.path.join(STAMPS_DIR, f"{cid}.png")
    img = try_open_rgba(preferred)
    if img is None:
        # fallback: generic stamp icon
        fallback_paths = [
            os.path.join(ICONS_DIR, "stamp.png"),
            os.path.join(ICONS_DIR, "check.png"),
        ]
        for p in fallback_paths:
            img = try_open_rgba(p)
            if img is not None:
                break
    if img is None:
        return None
    # scale preserving aspect ratio to fit within ICON_MAX_SIZE
    w, h = img.size
    scale = min(ICON_MAX_SIZE / w, ICON_MAX_SIZE / h, 1.0)
    new_size = (int(w * scale), int(h * scale))
    return img.resize(new_size, Image.LANCZOS)


def make_overlay_with_icon(icon_rgba: Image.Image) -> Image.Image:
    # transparent canvas
    overlay = Image.new("RGBA", (OVERLAY_BOX_SIZE, OVERLAY_BOX_SIZE), (0, 0, 0, 0))
    # draw white rounded rectangle background for better contrast & scan reliability
    bg = Image.new("RGBA", (OVERLAY_BOX_SIZE, OVERLAY_BOX_SIZE), (0, 0, 0, 0))
    mask = Image.new("L", (OVERLAY_BOX_SIZE, OVERLAY_BOX_SIZE), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, OVERLAY_BOX_SIZE, OVERLAY_BOX_SIZE], OVERLAY_BOX_RADIUS, fill=255)
    bg.paste(Image.new("RGBA", (OVERLAY_BOX_SIZE, OVERLAY_BOX_SIZE), (255, 255, 255, 255)), (0, 0), mask)
    overlay = Image.alpha_composite(overlay, bg)
    # center the icon
    if icon_rgba is not None:
        iw, ih = icon_rgba.size
        pos = ((OVERLAY_BOX_SIZE - iw) // 2, (OVERLAY_BOX_SIZE - ih) // 2)
        overlay.paste(icon_rgba, pos, icon_rgba)
    return overlay


def generate_qr_png(data: str, out_path: str, icon: Image.Image = None):
    qr = qrcode.QRCode(
        version=None,  # auto-fit
        error_correction=ERROR_CORRECT_H,  # robust scanning; safe even without logo
        box_size=10,  # base pixel size per module
        border=4,     # quiet zone
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    # upscale to exact 2048x2048 using nearest neighbor to keep sharp edges
    img = img.resize(TARGET_SIZE, Image.NEAREST)
    # compose overlay (logo) at center if enabled and provided
    if ENABLE_CENTER_ICON and icon is not None:
        overlay = make_overlay_with_icon(icon)
        ox, oy = (TARGET_SIZE[0] - OVERLAY_BOX_SIZE) // 2, (TARGET_SIZE[1] - OVERLAY_BOX_SIZE) // 2
        img = img.convert("RGBA")
        img.paste(overlay, (ox, oy), overlay)
        img = img.convert("RGB")
    img.save(out_path)


def main():
    print(f"Generating QR codes to: {OUTPUT_DIR}")
    for cid in CHECKPOINT_IDS:
        content = f"checkpoint:{cid}"
        filename = f"{cid}.png"
        out_path = os.path.join(OUTPUT_DIR, filename)
        icon = load_icon(cid) if ENABLE_CENTER_ICON else None
        generate_qr_png(content, out_path, icon)
        print(f"Saved: {out_path}")
    print("Done.")


if __name__ == "__main__":
    main()