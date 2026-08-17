import { deflateSync, crc32 } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const W = 640
const H = 900

function ellipseSD(px, py, cx, cy, rx, ry) {
  const dx = (px - cx) / rx
  const dy = (py - cy) / ry
  return Math.sqrt(dx * dx + dy * dy) - 1
}

function capsuleSD(px, py, ax, ay, bx, by, r) {
  const pax = px - ax
  const pay = py - ay
  const bax = bx - ax
  const bay = by - ay
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay) / (bax * bax + bay * bay)))
  const dx = pax - bax * h
  const dy = pay - bay * h
  return Math.sqrt(dx * dx + dy * dy) - r
}

function cov(sd) {
  return Math.min(1, Math.max(0, 0.5 - sd * 0.55))
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const t = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])) >>> 0)
  return Buffer.concat([len, t, data, crcBuf])
}

function encodePNG(pixels) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8
  ihdr[9] = 0
  const raw = Buffer.alloc((W + 1) * H)
  for (let y = 0; y < H; y++) {
    raw[y * (W + 1)] = 0
    pixels.copy(raw, y * (W + 1) + 1, y * W, (y + 1) * W)
  }
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

const head = { cx: 320, cy: 252, rx: 146, ry: 184 }
const hair = { cx: 320, cy: 236, rx: 158, ry: 150 }
const neck = { ax: 320, ay: 430, bx: 320, by: 560, r: 40 }
const shoulders = { cx: 320, cy: 664, rx: 268, ry: 238 }
const trapezius = { cx: 320, cy: 560, rx: 150, ry: 92 }

const pixels = Buffer.alloc(W * H)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const v = Math.max(
      cov(ellipseSD(x, y, head.cx, head.cy, head.rx, head.ry)),
      cov(ellipseSD(x, y, hair.cx, hair.cy, hair.rx, hair.ry)),
      cov(capsuleSD(x, y, neck.ax, neck.ay, neck.bx, neck.by, neck.r)),
      cov(ellipseSD(x, y, shoulders.cx, shoulders.cy, shoulders.rx, shoulders.ry)),
      cov(ellipseSD(x, y, trapezius.cx, trapezius.cy, trapezius.rx, trapezius.ry)),
    )
    const shade = 1 - 0.3 * (y / H)
    let highlight = 0
    const hdx = x - 288
    const hdy = y - 216
    const hd = Math.sqrt(hdx * hdx + hdy * hdy)
    if (hd < 74) highlight = (1 - hd / 74) * 46
    pixels[y * W + x] = Math.min(255, Math.max(0, Math.round(v * shade * 255 + highlight)))
  }
}

mkdirSync('public', { recursive: true })
writeFileSync('public/placeholder.png', encodePNG(pixels))
console.log('Generated public/placeholder.png')
