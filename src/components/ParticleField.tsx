import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; alpha: number
  life: number; maxLife: number
}

/**
 * ParticleField — ambient golden particles rising across the viewport.
 * Purely decorative; sits behind all content.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const isMobile = window.innerWidth < 768
    const COUNT    = isMobile ? 25 : 55

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = []

    const spawn = (): Particle => ({
      x:       Math.random() * canvas.width,
      y:       canvas.height + 10,
      vx:      (Math.random() - 0.5) * 0.4,
      vy:      -(0.3 + Math.random() * 0.7),
      size:    0.8 + Math.random() * 1.8,
      alpha:   0,
      life:    0,
      maxLife: 180 + Math.random() * 200,
    })

    for (let i = 0; i < COUNT; i++) {
      const p = spawn()
      p.y    = Math.random() * canvas.height   // scatter initial positions
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.life++
        p.x += p.vx
        p.y += p.vy

        const progress = p.life / p.maxLife
        p.alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
          ? 1 - (progress - 0.8) / 0.2
          : 1

        ctx.save()
        ctx.globalAlpha = p.alpha * 0.55
        ctx.shadowBlur  = 6
        ctx.shadowColor = '#D4A853'
        ctx.fillStyle   = '#D4A853'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        if (p.life >= p.maxLife) Object.assign(p, spawn())
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        1,
        opacity:       0.6,
      }}
    />
  )
}
