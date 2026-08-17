import { luminanceAt } from './particles'

function drawNote(ctx, s) {
  ctx.save()
  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'
  ctx.lineWidth = s * 0.075
  ctx.lineCap = 'round'
  const stemX = s * 0.46
  ctx.beginPath()
  ctx.ellipse(s * 0.34, s * 0.72, s * 0.13, s * 0.095, -0.45, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(stemX, s * 0.7)
  ctx.lineTo(stemX, s * 0.16)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(stemX, s * 0.2, s * 0.13, Math.PI * 0.25, Math.PI * 1.45)
  ctx.stroke()
  ctx.restore()
}

function drawGuitar(ctx, s) {
  ctx.save()
  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'
  ctx.lineWidth = s * 0.06
  ctx.lineJoin = 'round'
  const cx = s * 0.5
  const cy = s * 0.66
  ctx.beginPath()
  ctx.ellipse(cx, cy, s * 0.27, s * 0.19, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx, cy - s * 0.24, s * 0.2, s * 0.14, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = s * 0.065
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.05, cy - s * 0.34)
  ctx.lineTo(cx - s * 0.05, s * 0.08)
  ctx.stroke()
  ctx.lineWidth = s * 0.06
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.05, s * 0.08)
  ctx.lineTo(cx - s * 0.02, s * 0.03)
  ctx.stroke()
  ctx.lineWidth = s * 0.05
  ctx.beginPath()
  ctx.ellipse(cx, cy - s * 0.12, s * 0.06, s * 0.055, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawMic(ctx, s) {
  ctx.save()
  ctx.fillStyle = '#fff'
  const cx = s * 0.5
  ctx.beginPath()
  ctx.ellipse(cx, s * 0.32, s * 0.17, s * 0.24, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#000'
  for (let i = 0; i < 4; i++) {
    const y = s * 0.16 + i * s * 0.085
    ctx.fillRect(cx - s * 0.17, y, s * 0.34, s * 0.018)
  }
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.ellipse(cx, s * 0.58, s * 0.075, s * 0.13, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.rect(cx - s * 0.045, s * 0.6, s * 0.09, s * 0.26)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, s * 0.9, s * 0.11, s * 0.03, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawHeadphones(ctx, s) {
  ctx.save()
  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'
  ctx.lineWidth = s * 0.07
  ctx.lineCap = 'round'
  const cx = s * 0.5
  const cy = s * 0.52
  const r = s * 0.21
  ctx.beginPath()
  ctx.arc(cx, cy, r, Math.PI * 1.05, Math.PI * 1.95)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx - r, cy + s * 0.02, s * 0.085, s * 0.13, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + r, cy + s * 0.02, s * 0.085, s * 0.13, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawWave(ctx, s) {
  ctx.save()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = s * 0.06
  ctx.lineCap = 'round'
  const cx = s * 0.5
  const cy = s * 0.5
  for (let i = 0; i < 4; i++) {
    const r = s * (0.07 + i * 0.075)
    ctx.beginPath()
    ctx.arc(cx, cy, r, -0.95, 0.95)
    ctx.stroke()
  }
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.035, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawGamosa(ctx, s) {
  ctx.save()
  ctx.fillStyle = '#fff'
  const cx = s * 0.5
  const cy = s * 0.5
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.ellipse(cx + Math.cos(a) * s * 0.2, cy + Math.sin(a) * s * 0.2, s * 0.1, s * 0.17, a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.075, 0, Math.PI * 2)
  ctx.fill()
  for (let i = 0; i < 8; i++) {
    const a = ((i + 0.5) / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * s * 0.17, cy + Math.sin(a) * s * 0.17, s * 0.025, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawDrum(ctx, s) {
  ctx.save()
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = s * 0.045
  ctx.lineCap = 'round'
  const cx = s * 0.5
  const cy = s * 0.55
  ctx.beginPath()
  ctx.ellipse(cx - s * 0.17, cy - s * 0.17, s * 0.1, s * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.26, cy - s * 0.12)
  ctx.lineTo(cx - s * 0.26, cy + s * 0.1)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.08, cy - s * 0.12)
  ctx.lineTo(cx - s * 0.08, cy + s * 0.1)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx - s * 0.17, cy + s * 0.1, s * 0.1, s * 0.05, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + s * 0.17, cy - s * 0.11, s * 0.1, s * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.08, cy - s * 0.06)
  ctx.lineTo(cx + s * 0.08, cy + s * 0.16)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.26, cy - s * 0.06)
  ctx.lineTo(cx + s * 0.26, cy + s * 0.16)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + s * 0.17, cy + s * 0.16, s * 0.1, s * 0.05, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawPiano(ctx, s) {
  ctx.save()
  ctx.fillStyle = '#fff'
  const cx = s * 0.5
  ctx.beginPath()
  ctx.rect(cx - s * 0.36, s * 0.3, s * 0.72, s * 0.44)
  ctx.fill()
  ctx.fillStyle = '#000'
  const bw = s * 0.092
  for (let i = 0; i < 7; i++) {
    if (i === 2 || i === 6) continue
    ctx.fillRect(cx - s * 0.32 + i * bw, s * 0.3, bw, s * 0.26)
  }
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.rect(cx - s * 0.4, s * 0.74, s * 0.8, s * 0.08)
  ctx.fill()
  ctx.restore()
}

function drawSaxophone(ctx, s) {
  ctx.save()
  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const cx = s * 0.5
  ctx.lineWidth = s * 0.09
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.05, s * 0.16)
  ctx.quadraticCurveTo(cx + s * 0.2, s * 0.2, cx + s * 0.18, s * 0.44)
  ctx.stroke()
  ctx.lineWidth = s * 0.12
  ctx.beginPath()
  ctx.quadraticCurveTo(cx + s * 0.16, s * 0.6, cx, s * 0.62)
  ctx.quadraticCurveTo(cx - s * 0.2, s * 0.64, cx - s * 0.22, s * 0.82)
  ctx.stroke()
  ctx.lineWidth = s * 0.05
  ctx.beginPath()
  ctx.ellipse(cx + s * 0.14, s * 0.84, s * 0.07, s * 0.1, 0.45, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillRect(cx + s * 0.1, s * 0.86, s * 0.06, s * 0.06)
  ctx.restore()
}

function drawVinyl(ctx, s) {
  ctx.save()
  ctx.fillStyle = '#fff'
  const cx = s * 0.5
  const cy = s * 0.5
  const r = s * 0.34
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#000'
  ctx.lineWidth = s * 0.012
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath()
    ctx.arc(cx, cy, r * (0.52 + i * 0.08), 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.022, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export const ICONS = {
  note: drawNote,
  guitar: drawGuitar,
  mic: drawMic,
  headphones: drawHeadphones,
  wave: drawWave,
  gamosa: drawGamosa,
  drum: drawDrum,
  piano: drawPiano,
  saxophone: drawSaxophone,
  vinyl: drawVinyl,
}

export function sampleIcon(drawFn, { size = 128, count = 150, threshold = 40 } = {}) {
  const cv = document.createElement('canvas')
  cv.width = size
  cv.height = size
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  drawFn(ctx, size)
  const { data } = ctx.getImageData(0, 0, size, size)
  const n = size * size
  const weights = new Float32Array(n)
  const cum = new Float32Array(n)
  let total = 0
  for (let i = 0; i < n; i++) {
    const l = luminanceAt(data, i * 4)
    const v = l > threshold ? (l - threshold) / (255 - threshold) : 0
    weights[i] = v
    total += v
    cum[i] = total
  }
  if (total <= 0) total = 1
  const points = []
  for (let i = 0; i < count; i++) {
    const target = Math.random() * total
    let lo = 0
    let hi = n - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cum[mid] < target) lo = mid + 1
      else hi = mid
    }
    const idx = lo
    points.push({
      x: (idx % size) / size,
      y: Math.floor(idx / size) / size,
      b: weights[idx],
      phase: Math.random() * Math.PI * 2,
    })
  }
  return points
}
