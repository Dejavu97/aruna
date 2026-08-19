import { useEffect, useRef } from 'react'

export default function AtmosphereParticles({ effect = 'none', accentColor = '#c5a059' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!effect || effect === 'none') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle Classes
    const particleCount = effect === 'gold_dust' ? 45 : effect === 'bokeh' ? 20 : 25
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          effect === 'bokeh'
            ? Math.random() * 28 + 12
            : effect === 'gold_dust'
            ? Math.random() * 3 + 1.2
            : Math.random() * 10 + 6,
        speedX: (Math.random() - 0.5) * (effect === 'gold_dust' ? 0.6 : 1.2),
        speedY:
          effect === 'gold_dust'
            ? -(Math.random() * 0.8 + 0.3) // floats upwards
            : Math.random() * 1.2 + 0.5, // falls downwards
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        swing: Math.random() * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    let tick = 0

    function render() {
      ctx.clearRect(0, 0, width, height)
      tick += 0.02

      particles.forEach((p) => {
        p.rotation += p.rotationSpeed
        p.x += p.speedX + Math.sin(tick * p.swingSpeed) * 0.5
        p.y += p.speedY

        // Wrap boundaries
        if (effect === 'gold_dust') {
          if (p.y < -10) {
            p.y = height + 10
            p.x = Math.random() * width
          }
        } else {
          if (p.y > height + 20) {
            p.y = -20
            p.x = Math.random() * width
          }
        }
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity

        if (effect === 'petals') {
          // Soft pink petal
          ctx.fillStyle = '#fbcfe8'
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2)
          ctx.fill()
        } else if (effect === 'melati') {
          // White melati flower petal
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 0.8, p.size * 0.4, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fef08a'
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.15, 0, Math.PI * 2)
          ctx.fill()
        } else if (effect === 'gold_dust') {
          // Sparkling gold dust
          const shimmer = Math.abs(Math.sin(tick * 3 + p.swing)) * 0.5 + 0.5
          ctx.fillStyle = accentColor || '#d4af37'
          ctx.shadowBlur = 8
          ctx.shadowColor = accentColor || '#d4af37'
          ctx.beginPath()
          ctx.arc(0, 0, p.size * shimmer, 0, Math.PI * 2)
          ctx.fill()
        } else if (effect === 'bokeh') {
          // Glowing soft warm bokeh orb
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
          gradient.addColorStop(0, 'rgba(254, 240, 138, 0.4)')
          gradient.addColorStop(0.7, 'rgba(251, 191, 36, 0.1)')
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [effect, accentColor])

  if (!effect || effect === 'none') return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
      style={{ mixBlendMode: effect === 'gold_dust' || effect === 'bokeh' ? 'screen' : 'normal' }}
    />
  )
}
