export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Unable to load image: ' + src))
    img.src = src
  })
}

export const isCoarse = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const capDPR = () => Math.min(window.devicePixelRatio || 1, isCoarse() ? 1.5 : 2)

export function luminanceAt(data, i) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  return r * 0.299 + g * 0.587 + b * 0.114
}

export function makeSprite(stops, size = 48) {
  const cv = document.createElement('canvas')
  cv.width = size
  cv.height = size
  const ctx = cv.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  for (const stop of stops) grad.addColorStop(stop[0], stop[1])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return cv
}

function weightedSample(width, height, weights, cum, total, count) {
  const points = []
  const n = width * height
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
      x: (idx % width) / width,
      y: Math.floor(idx / width) / height,
      brightness: weights[idx],
    })
  }
  return points
}

export async function sampleImage(src, { width = 220, count = 9000, threshold = 24, softness = 1 } = {}) {
  const img = await loadImage(src)
  const height = Math.max(1, Math.round(width * (img.naturalHeight / Math.max(1, img.naturalWidth))))
  const cv = document.createElement('canvas')
  cv.width = width
  cv.height = height
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, width, height)
  const { data } = ctx.getImageData(0, 0, width, height)
  const n = width * height
  const weights = new Float32Array(n)
  const cum = new Float32Array(n)
  let total = 0
  for (let i = 0; i < n; i++) {
    const l = luminanceAt(data, i * 4)
    const v = l > threshold ? Math.pow((l - threshold) / (255 - threshold), softness) : 0
    weights[i] = v
    total += v
    cum[i] = total
  }
  if (total <= 0) total = 1
  const points = weightedSample(width, height, weights, cum, total, count)
  for (const p of points) {
    p.depth = Math.random()
    p.phase = Math.random() * Math.PI * 2
    p.phase2 = Math.random() * Math.PI * 2
    const roll = p.brightness + Math.random() * 0.22
    p.sprite = roll > 0.72 ? 'soft' : roll > 0.45 ? 'lilac' : 'violet'
  }
  return { points, aspect: height / width }
}

export function createParticleRenderer(canvas, { points, aspect }) {
  const ctx = canvas.getContext('2d')
  const sprites = {
    soft: makeSprite([
      [0, 'rgba(255,255,255,0.95)'],
      [0.35, 'rgba(226,216,255,0.65)'],
      [1, 'rgba(140,110,255,0)'],
    ]),
    lilac: makeSprite([
      [0, 'rgba(233,225,255,0.95)'],
      [0.35, 'rgba(180,150,255,0.6)'],
      [1, 'rgba(124,92,246,0)'],
    ]),
    violet: makeSprite([
      [0, 'rgba(214,199,255,0.9)'],
      [0.35, 'rgba(150,116,250,0.55)'],
      [1, 'rgba(106,76,240,0)'],
    ]),
  }
  const dustSprite = makeSprite(
    [
      [0, 'rgba(214,200,255,0.6)'],
      [0.5, 'rgba(150,116,250,0.2)'],
      [1, 'rgba(0,0,0,0)'],
    ],
    24,
  )

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  let W = 0
  let H = 0
  let raf = 0
  let running = true

  const dustCount = isCoarse() ? 110 : 200
  const dust = []
  for (let i = 0; i < dustCount; i++) {
    dust.push({
      x: Math.random(),
      y: Math.random(),
      r: 0.8 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: -0.00003 - Math.random() * 0.0001,
      a: 0.05 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    })
  }

  function resize() {
    const parent = canvas.parentElement
    const rect = parent.getBoundingClientRect()
    const dpr = capDPR()
    W = Math.max(1, rect.width)
    H = Math.max(1, rect.height)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function layout() {
    const availW = W * 0.9
    let dw = availW
    let dh = dw * aspect
    const maxH = H * 0.94
    if (dh > maxH) {
      dh = maxH
      dw = dh / aspect
    }
    const ox = (W - dw) / 2
    const oy = H * 0.03 + (H * 0.94 - dh) / 2
    return { dw, dh, ox, oy }
  }

  function frame(t) {
    if (!running) return
    const time = t / 1000
    ctx.clearRect(0, 0, W, H)

    mouse.x += (mouse.tx - mouse.x) * 0.08
    mouse.y += (mouse.ty - mouse.y) * 0.08

    for (const d of dust) {
      d.x += d.vx
      d.y += d.vy
      if (d.x > 1) d.x = 0
      if (d.x < 0) d.x = 1
      if (d.y < 0) d.y = 1
      if (d.y > 1) d.y = 0
      const twinkle = reduced ? 1 : 0.6 + 0.4 * Math.sin(time * 0.7 + d.phase)
      ctx.globalAlpha = d.a * twinkle
      ctx.drawImage(dustSprite, d.x * W - d.r, d.y * H - d.r, d.r * 2, d.r * 2)
    }
    ctx.globalAlpha = 1

    const { dw, dh, ox, oy } = layout()
    const cX = ox + dw / 2
    const cY = oy + dh / 2
    const base = dw / 240
    const yaw = Math.sin(time * 0.13) * 0.03 + mouse.x * 0.34
    const pitch = Math.cos(time * 0.11) * 0.026 + mouse.y * 0.3
    const cosY = Math.cos(yaw)
    const sinY = Math.sin(yaw)
    const cosP = Math.cos(pitch)
    const sinP = Math.sin(pitch)
    const zMag = dw * 0.36
    const chest = reduced ? 0 : Math.sin(time * 1.12) * 0.006

    for (const p of points) {
      let px, py, tw, size
      const rx = (p.x - 0.5) * 2
      const ry = (p.y - 0.5) * 2.1
      const rad = Math.min(1, Math.sqrt(rx * rx + ry * ry))
      const depth = 0.3 + 0.7 * (1 - rad)
      const zp = (depth - 0.5) * zMag
      const lx = ox + p.x * dw - cX
      const ly = oy + p.y * dh - cY
      const depthScale = 0.82 + depth * 0.3

      if (reduced) {
        px = cX + lx
        py = cY + ly
        tw = 1
      } else {
        const x1 = lx * cosY + zp * sinY
        const y1 = ly * cosP - zp * sinP
        const breathe = Math.sin(time * 1.3 + p.phase) * 1.3 * (0.5 + p.depth)
        const breathe2 = Math.sin(time * 1.7 + p.phase2) * 1.0 * (0.4 + p.depth)
        px = cX + x1 + breathe + mouse.x * (4 + p.depth * 12)
        py = cY + y1 * (1 - chest * (0.3 + depth)) + breathe2 + mouse.y * (3 + p.depth * 9)
        tw = 0.78 + 0.22 * Math.sin(time * 2.2 + p.phase2)
      }
      size = base * (0.45 + p.depth * 0.45) * (0.6 + p.brightness * 0.5) * tw * depthScale
      ctx.drawImage(sprites[p.sprite], px - size, py - size, size * 2, size * 2)
    }

    raf = requestAnimationFrame(frame)
  }

  function onPointer(e) {
    const rect = canvas.getBoundingClientRect()
    mouse.tx = (e.clientX - rect.left) / rect.width - 0.5
    mouse.ty = (e.clientY - rect.top) / rect.height - 0.5
  }

  function onEnd() {
    mouse.tx = 0
    mouse.ty = 0
  }

  function pause() {
    if (!running) return
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function resume() {
    if (running) return
    running = true
    raf = requestAnimationFrame(frame)
  }

  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement)
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('pointerup', onEnd, { passive: true })
  window.addEventListener('pointercancel', onEnd, { passive: true })
  raf = requestAnimationFrame(frame)

  return {
    pause,
    resume,
    destroy() {
      pause()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
    },
  }
}
