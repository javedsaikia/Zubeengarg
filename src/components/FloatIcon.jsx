import { motion, useTransform } from 'framer-motion'
import ParticleIcon from './ParticleIcon'

const SEGMENTS = 24

export default function FloatIcon({
  icon,
  size = 88,
  className,
  cx,
  cy,
  xr = 0,
  yr = 0,
  dur = 18,
  phase = 0,
  par = 0,
  count = 150,
}) {
  const px = useTransform(cx, (v) => v * par)
  const py = useTransform(cy, (v) => v * par * 0.72)

  const xs = []
  const ys = []
  for (let i = 0; i <= SEGMENTS; i++) {
    const a = phase + (i / SEGMENTS) * Math.PI * 2
    xs.push(Math.cos(a) * xr)
    ys.push(Math.sin(a) * yr)
  }

  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div style={{ x: px, y: py }}>
        <motion.div
          animate={{ x: xs, y: ys }}
          transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            animate={{ rotate: [0, 4, 0, -4, 0], scale: [1, 1.06, 1, 0.95, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ParticleIcon icon={icon} size={size} count={count} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}