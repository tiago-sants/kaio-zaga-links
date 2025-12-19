import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './SmokeOverlay.css'

const SmokeOverlay = () => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = []
    const particleCount = 150

    // Ajustar tamanho do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Classe de partícula de fumaça
    class SmokeParticle {
      constructor() {
        this.reset()
        this.y = Math.random() * canvas.height
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * 200
        this.size = Math.random() * 200 + 50
        this.speedY = Math.random() * 0.5 + 0.2
        this.speedX = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.3 + 0.1
        this.life = Math.random()
        this.lifeDecay = Math.random() * 0.005 + 0.002
      }

      update() {
        this.x += this.speedX
        this.y -= this.speedY
        this.life -= this.lifeDecay

        if (this.life <= 0 || this.y < -100) {
          this.reset()
        }

        // Oscilação suave
        this.x += Math.sin(this.y * 0.01) * 0.5
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity * this.life
        ctx.fillStyle = '#ffffff'
        
        // Gradiente radial para efeito de fumaça
        const gradient = ctx.createRadialGradient(
          this.x, this.y,
          0,
          this.x, this.y,
          this.size
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 * this.life})`)
        gradient.addColorStop(0.3, `rgba(200, 200, 200, ${0.1 * this.life})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      }
    }

    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new SmokeParticle())
    }

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenhar múltiplas camadas de fumaça
      particles.forEach((particle, index) => {
        particle.update()
        particle.draw()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="smoke-canvas"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  )
}

export default SmokeOverlay

