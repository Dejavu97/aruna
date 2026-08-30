# -*- coding: utf-8 -*-
"""make-moon.py — sintesis 'moon.png' bergaya gouache atlas astronomi antik.

Murni prosedural (numpy + PIL), seed tetap = hasil identik setiap dijalankan.
v2: warna hangat, limb darkening kuat, tepi organik, kawah halus, goresan kuas.
Pakai:  python scripts/make-moon.py
Output: public/themes/kejora/moon.png (900x900 RGBA, transparan)
        scripts/verify-shots/kj-moon-preview.png (komposit di langit tema)
"""
import numpy as np
from PIL import Image, ImageFilter

N = 900
SEED = 7
rng = np.random.default_rng(SEED)

yy, xx = np.mgrid[0:N, 0:N].astype(np.float64)
cx = cy = N / 2.0
R = N * 0.455
dx, dy = xx - cx, yy - cy
r = np.hypot(dx, dy)
rn = r / R

# ---- noise helpers --------------------------------------------------
def vnoise(size, freq):
    g = (rng.random((freq, freq)) * 255).astype("uint8")
    im = Image.fromarray(g).resize((size, size), Image.BILINEAR)
    return np.asarray(im).astype(np.float64) / 255.0

def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)

# ---- 1. Shading bola: Lambert kuat + limb darkening nyata -----------
nz = np.sqrt(np.clip(R * R - np.minimum(r, R * 0.9999) ** 2, 0, None))
L = np.array([-0.35, -0.42, 0.84])  # cahaya kiri-atas, hampir frontal
L = L / np.linalg.norm(L)
diff = np.clip((dx * L[0] + dy * L[1] + nz * L[2]) / R, 0, None)
I = 0.20 + 0.80 * diff ** 1.5
I *= 1 - 0.42 * rn ** 7          # limb menggelap jelas ke tepi

# ---- 2. Maria — blob tegas dengan tepi smoothstep --------------------
fbm = (vnoise(N, 6) * 0.45 + vnoise(N, 12) * 0.30 +
       vnoise(N, 24) * 0.15 + vnoise(N, 48) * 0.10)
blobs = np.zeros((N, N))
for bx, by, brx, bry, s in [
    (0.36, 0.30, 0.17, 0.13, 1.0), (0.55, 0.48, 0.13, 0.16, 0.85),
    (0.29, 0.55, 0.10, 0.09, 0.7), (0.62, 0.30, 0.08, 0.10, 0.6),
    (0.45, 0.42, 0.21, 0.21, 0.35),
]:
    ex, ey = (xx / N - bx) / brx, (yy / N - by) / bry
    blobs = np.maximum(blobs, np.clip(1 - np.hypot(ex, ey), 0, 1) * s)
maria = smoothstep(0.30, 0.72, blobs * 0.78 + (fbm - 0.5) * 0.85)

# ---- 3. Kawah halus (300, sopan) + rim terang sisi cahaya ------------
# dihitung per jendela lokal (bukan full-array) agar cepat
crater = np.zeros((N, N))
crim = np.zeros((N, N))
for _ in range(300):
    a = rng.random() * 2 * np.pi
    rr = np.sqrt(rng.random()) * 0.88 * R
    px, py = cx + rr * np.cos(a), cy + rr * np.sin(a)
    rad = rng.uniform(1.5, 5.5)
    depth = rng.uniform(0.05, 0.16)
    m = rad * 2.2
    x0, x1 = int(max(0, px - m)), int(min(N, px + m))
    y0, y1 = int(max(0, py - m)), int(min(N, py + m))
    if x1 <= x0 or y1 <= y0:
        continue
    lx = xx[y0:y1, x0:x1]
    ly = yy[y0:y1, x0:x1]
    d = np.hypot(lx - px, ly - py)
    inside = np.clip(1 - d / rad, 0, 1) ** 0.7
    crater[y0:y1, x0:x1] += depth * inside
    rim = np.exp(-((d - rad) / (rad * 0.3)) ** 2)
    crim[y0:y1, x0:x1] += depth * 0.45 * rim
crater *= (1 - 0.5 * maria)       # kawah samar di maria

# ---- 4. Goresan kuas (streak directional) + gouache + grain ---------
strokes_h = (vnoise(N, 70) - 0.5)
strokes_h = np.asarray(
    Image.fromarray((strokes_h * 127 + 128).astype("uint8"))
    .resize((N, N), Image.BILINEAR)).astype(np.float64) / 255.0 - 0.5
strokes_v = (vnoise(N, 110) - 0.5)
strokes_v = np.asarray(
    Image.fromarray((strokes_v * 127 + 128).astype("uint8"))
    .resize((N * 3, N), Image.BILINEAR).resize((N, N), Image.BILINEAR)
).astype(np.float64) / 255.0 - 0.5
tex = strokes_h * 0.085 + strokes_v * 0.05 + (vnoise(N, 200) - 0.5) * 0.05
grain = (vnoise(N, 420) - 0.5) * 0.055

lum = np.clip(
    (I - 0.20 * maria - crater + crim * 0.6) * (1 + tex + grain),
    0, 1)

# ---- 5. Warna hangat: krim perak, bayangan hanya sebagian ke nila ---
base = np.array([239.0, 232.0, 216.0])   # krim perak hangat #EFE8D8
indigo = np.array([27.0, 36.0, 71.0])    # #1B2447
warm = np.array([246.0, 238.0, 218.0])   # kilau sisi cahaya
rgb = base[None, None, :] * lum[..., None]
wgt = (lum ** 1.6 * 0.22)[..., None]     # area terang sedikit lebih hangat
rgb = rgb * (1 - wgt) + warm[None, None, :] * wgt
t = ((1 - lum) * 0.26)[..., None]        # bayangan terseret ke nila (ringan)
rgb = rgb * (1 - t) + indigo[None, None, :] * t
rgb = np.clip(rgb, 0, 241)

# ---- 6. Tepi organik: radius efektif ber-ombak + pinggiran kertas ---
edge_zone = np.clip(1 - np.abs(r - R) / 7.0, 0, 1)
wobble = (vnoise(N, 7) - 0.5) * 5.0 * edge_zone
alpha = np.clip((R + 1.2 + wobble - r) / 2.4, 0, 1)
fringe = np.clip((r - (R - 3.5)) / 3.5, 0, 1) * 0.22 * np.clip(alpha, 0, 1)
rgb += fringe[..., None] * np.array([26.0, 22.0, 12.0])
rgb = np.clip(rgb, 0, 246)

rgba = np.dstack([rgb, alpha * 255.0]).astype("uint8")
out = Image.fromarray(rgba, "RGBA")
out.save("public/themes/kejora/moon.png")
print("saved public/themes/kejora/moon.png", out.size)

# ---- 7. Pratinjau komposit di langit tema ---------------------------
SKY = np.zeros((N, N, 3), dtype=np.float64)
SKY[..., 0], SKY[..., 1], SKY[..., 2] = 11, 16, 38  # #0B1026
sky = Image.fromarray(SKY.astype("uint8"), "RGB")

glow = out.split()[3].filter(ImageFilter.GaussianBlur(26))
halo = Image.new("RGB", (N, N), (233, 230, 218))
sky = Image.composite(halo, sky, glow.point(lambda v: int(v * 0.22)))
sky.paste(out, (0, 0), out)
sky.resize((450, 450), Image.LANCZOS).save("scripts/verify-shots/kj-moon-preview.png")
print("saved scripts/verify-shots/kj-moon-preview.png")
