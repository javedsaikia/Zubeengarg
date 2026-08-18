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

export async function sampleImage(
  src,
  { width = 220, count = 9000, threshold = 24, softness = 1, cells = 32 } = {},
) {
  const img = await loadImage(src)
  const ratio = img.naturalHeight / Math.max(1, img.naturalWidth)
  const height = Math.max(1, Math.round(width * ratio))
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
  const pixel = document.createElement('canvas')
  pixel.width = cells
  pixel.height = Math.max(1, Math.round(cells * ratio))
  pixel.getContext('2d').drawImage(img, 0, 0, pixel.width, pixel.height)
  return { points, aspect: height / width, pixel }
}

export function createParticleRenderer(canvas, { points, aspect, alignY = 0.5, pixel = null, pixelAlpha = 0.3 }) {
  const ctx = canvas.getContext('2d')
  const sprites = {
    soft: makeSprite([
      [0, 'rgba(255,255,255,1)'],
      [0.4, 'rgba(238,229,255,0.92)'],
      [1, 'rgba(178,148,255,0)'],
    ]),
    lilac: makeSprite([
      [0, 'rgba(245,240,255,1)'],
      [0.4, 'rgba(196,170,255,0.88)'],
      [1, 'rgba(148,116,255,0)'],
    ]),
    violet: makeSprite([
      [0, 'rgba(232,219,255,1)'],
      [0.4, 'rgba(172,142,255,0.82)'],
      [1, 'rgba(126,96,250,0)'],
    ]),
  }
  const dustSprite = makeSprite(
    [
      [0, 'rgba(224,212,255,0.75)'],
      [0.5, 'rgba(162,130,255,0.28)'],
      [1, 'rgba(0,0,0,0)'],
    ],
    24,
  )

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  let hover = false
  let W = 0
  let H = 0
  let raf = 0
  let running = true

  const RIPPLE_SCALE = 2
  const RIPPLE_RADIUS = 0.2
  let ripple = null
  if (pixel && !isCoarse() && !reduced) {
    ripple = {
      rw: Math.max(2, Math.round(pixel.width * RIPPLE_SCALE)),
      rh: Math.max(2, Math.round(pixel.height * RIPPLE_SCALE)),
      src: new Uint8ClampedArray(
        pixel.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, pixel.width, pixel.height)
          .data,
      ),
      cv: document.createElement('canvas'),
    }
    ripple.cv.width = ripple.rw
    ripple.cv.height = ripple.rh
    ripple.ctx = ripple.cv.getContext('2d', { willReadFrequently: true })
  }
  const glowHalo = makeSprite(
    [
      [0, 'rgba(255,255,255,0.85)'],
      [0.35, 'rgba(219,196,255,0.4)'],
      [1, 'rgba(0,0,0,0)'],
    ],
    160,
  )

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
    const availW = W * 0.98
    let dw = availW
    let dh = dw * aspect
    const maxH = H * 0.98
    if (dh > maxH) {
      dh = maxH
      dw = dh / aspect
    }
    const ox = (W - dw) / 2
    const oy = H * 0.02 + (H * 0.98 - dh) * alignY
    return { dw, dh, ox, oy }
  }

  function computeRipple(time) {
    const { rw, rh, src, cv, ctx: rctx } = ripple
    const mx = mouse.x + 0.5
    const my = mouse.y + 0.5
    if (mx < -0.05 || mx > 1.05 || my < -0.05 || my > 1.05) return pixel
    const sd = rctx.createImageData(rw, rh)
    const ld = sd.data
    const su = rw
    const pw = pixel.width
    const rad = Math.max(RIPPLE_RADIUS, 0.001)
    const clampX = (v) => {
      v = v | 0
      return v < 0 ? 0 : v >= pw ? pw - 1 : v
    }
    const clampY = (v) => {
      v = v | 0
      return v < 0 ? 0 : v >= pixel.height ? pixel.height - 1 : v
    }
    for (let y = 0; y < rh; y++) {
      const uvy = (y + 0.5) / rh
      const oy4 = y * rw * 4
      for (let x = 0; x < rw; x++) {
        const uvx = (x + 0.5) / rw
        const dx = uvx - mx
        const dy = uvy - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        let s = (rad - dist) / rad
        if (s > 1) s = 1
        else if (s < 0) s = 0
        const smooth = s * s * (3 - 2 * s)
        const rippleV = Math.sin(dist * 20 - time * 5) * 0.006
        const ca = 0.005 * smooth
        const off = rippleV * smooth
        let nx = dx
        let ny = dy
        const len = dist || 1
        nx /= len
        ny /= len
        const oxr = (x + (nx * off + ca) * su) / RIPPLE_SCALE
        const oyr = (y + ny * off * rh) / RIPPLE_SCALE
        const oxg = (x + nx * off * su) / RIPPLE_SCALE
        const oyg = (y + ny * off * rh) / RIPPLE_SCALE
        const oxb = (x + (nx * off - ca) * su) / RIPPLE_SCALE
        const oyb = (y + ny * off * rh) / RIPPLE_SCALE
        const ir = (clampY(oyr) * pw + clampX(oxr)) * 4
        const ig = (clampY(oyg) * pw + clampX(oxg)) * 4
        const ib = (clampY(oyb) * pw + clampX(oxb)) * 4
        const o = oy4 + x * 4
        ld[o] = src[ir]
        ld[o + 1] = src[ig + 1]
        ld[o + 2] = src[ib + 2]
        ld[o + 3] = src[ig + 3]
      }
    }
    rctx.putImageData(sd, 0, 0)
    return ripple.cv
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

    if (hover && !reduced) {
      const hx = (mouse.x + 0.5) * W
      const hy = (mouse.y + 0.5) * H
      const hr = W * 0.14
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.1
      ctx.drawImage(glowHalo, hx - hr, hy - hr, hr * 2, hr * 2)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    let drawPx = pixel
    if (ripple && hover) drawPx = computeRipple(time)

    if (pixel) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = pixelAlpha
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(drawPx, ox, oy, dw, dh)
      ctx.restore()
    }

    const cX = ox + dw / 2
    const cY = oy + dh / 2
    const base = dw / 620
    const yaw = Math.sin(time * 0.21) * 0.02 + mouse.x * 0.52
    const pitch = Math.cos(time * 0.17) * 0.02 + mouse.y * 0.46
    const cosY = Math.cos(yaw)
    const sinY = Math.sin(yaw)
    const cosP = Math.cos(pitch)
    const sinP = Math.sin(pitch)
    const zMag = dw * 0.48
    const sway = reduced ? 0 : Math.sin(time * 0.6) * dw * 0.005
    const bob = reduced ? 0 : Math.sin(time * 1.02) * dw * 0.006
    const roll = reduced ? 0 : Math.cos(time * 0.9) * 0.01

    ctx.globalCompositeOperation = 'lighter'
    for (const p of points) {
      let px, py
      const rx = (p.x - 0.5) * 2
      const ry = (p.y - 0.5) * 2.1
      const rad = Math.min(1, Math.sqrt(rx * rx + ry * ry))
      const depth = 0.3 + 0.7 * (1 - rad)
      const zp = (depth - 0.5) * zMag
      const lx = ox + p.x * dw - cX
      const ly = oy + p.y * dh - cY
      const depthScale = 0.92 + depth * 0.16

      if (reduced) {
        px = cX + lx
        py = cY + ly
      } else {
        const x1 = lx * cosY + zp * sinY
        const y1 = ly * cosP - zp * sinP
        const a1 = Math.atan2(y1, x1) + roll
        const r1 = Math.hypot(x1, y1)
        const fx = Math.cos(a1) * r1
        const fy = Math.sin(a1) * r1
        const s1 = Math.sin(time * 3.4 + p.phase) * 0.45 * (0.35 + depth)
        const s2 = Math.cos(time * 2.9 + p.phase2) * 0.4 * (0.35 + depth)
        px = cX + fx + sway + s1 + mouse.x * (5 + p.depth * 14)
        py = cY + fy + bob + s2 + mouse.y * (4 + p.depth * 11)
      }
      const tw = 0.9 + 0.1 * Math.sin(time * 2.6 + p.phase2)
      let glow = 0
      if (hover && !reduced) {
        const gd = Math.hypot((px - (mouse.x + 0.5) * W) / W, (py - (mouse.y + 0.5) * H) / H)
        let g0 = (RIPPLE_RADIUS - gd) / RIPPLE_RADIUS
        if (g0 > 1) g0 = 1
        else if (g0 < 0) g0 = 0
        glow = g0 * g0 * (3 - 2 * g0)
      }
      const size = Math.max(
        0.8,
        base * (0.65 + p.depth * 0.55) * (0.85 + p.brightness * 0.4) * tw * depthScale,
      ) * (1 + 0.65 * glow)
      ctx.globalAlpha = 0.7 + 0.35 * glow
      ctx.drawImage(sprites[p.sprite], px - size, py - size, size * 2, size * 2)
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'

    raf = requestAnimationFrame(frame)
  }

  function onPointer(e) {
    const rect = canvas.getBoundingClientRect()
    mouse.tx = (e.clientX - rect.left) / rect.width - 0.5
    mouse.ty = (e.clientY - rect.top) / rect.height - 0.5
    hover = true
  }

  function onEnd() {
    mouse.tx = 0
    mouse.ty = 0
    hover = false
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
