import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmokeOverlay from './SmokeOverlay'
import { config } from '../config'
import './VideoSection.css'

gsap.registerPlugin(ScrollTrigger)

const VideoSection = () => {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const loadingAttemptedRef = useRef(false)
  const playingRef = useRef(false)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
    layoutEffect: false // Desabilita layoutEffect para evitar warning de posição estática
  })

  // Transformações baseadas no scroll - removido scale para não cortar o vídeo
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1])
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 1, 0.9])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.4, 0.7])
  const overlayBlur = useTransform(scrollYProgress, [0, 1], [15, 25])
  const darkenOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.4, 0.3])
  
  // Estado para controlar visibilidade do vídeo
  const [videoReady, setVideoReady] = useState(false)

  // Carregar vídeo e controlar play/pause baseado na visibilidade
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    loadingAttemptedRef.current = true

    const handlePlaying = () => {
      setVideoLoaded(true)
      playingRef.current = true
    }

    const handleLoadedData = () => {
      setVideoReady(true)
      setVideoLoaded(true)
    }

    const handleError = (e) => {
      console.error('Erro ao carregar vídeo:', e)
    }

    // Adicionar listeners
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    // Intersection Observer para controlar play/pause
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Seção está visível - reproduzir vídeo
            if (video.readyState >= 3 && video.paused) {
              video.play().catch((error) => {
                console.error('Erro ao reproduzir vídeo:', error)
              })
            }
          } else {
            // Seção não está visível - pausar vídeo
            if (!video.paused) {
              video.pause()
            }
          }
        })
      },
      {
        threshold: 0.5 // Vídeo toca quando pelo menos 50% da seção está visível
      }
    )

    observer.observe(section)

    return () => {
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    // Garantir que a seção está visível desde o início
    if (sectionRef.current) {
      sectionRef.current.style.opacity = '1'
      sectionRef.current.style.visibility = 'visible'
    }

    // Animação de entrada da seção (sem esconder inicialmente)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from(sectionRef.current, {
      y: 50,
      duration: 1.5,
      ease: 'power3.out'
    })

    // Animações de scroll desabilitadas para manter vídeo centralizado
    // O vídeo permanece centralizado sem animações de movimento

    // Animações para o overlay de fumaça
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        },
        opacity: 0.8,
        ease: 'none'
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Scroll tipo TikTok - Volta para Hero ao arrastar/scrollar para cima
  useEffect(() => {
    const videoSection = sectionRef.current
    if (!videoSection) return

    let touchStartY = 0
    let touchEndY = 0
    let isScrolling = false
    let wheelAccumulator = 0
    let wheelTimeout = null

    // Verificar se está na seção video
    const isInVideoSection = () => {
      if (!videoSection) return false
      const rect = videoSection.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Verifica se a seção video está visível (pelo menos parte dela)
      return rect.top < windowHeight && rect.bottom > 0 && 
             (rect.top <= windowHeight * 0.7)
    }

    // Scroll instantâneo para seção anterior (Hero)
    const scrollToPreviousSection = () => {
      if (isScrolling) return
      isScrolling = true

      const heroSection = document.querySelector('#hero-section')
      if (heroSection) {
        // Usa scrollTo para comportamento instantâneo tipo TikTok
        const heroTop = heroSection.offsetTop
        window.scrollTo({
          top: heroTop,
          behavior: 'instant'
        })
        
        // Fallback caso behavior: 'instant' não seja suportado
        if (window.scrollY !== heroTop) {
          heroSection.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
      } else {
        // Fallback: scroll para cima
        window.scrollTo({
          top: window.scrollY - window.innerHeight,
          behavior: 'instant'
        })
      }

      // Reset após um tempo
      setTimeout(() => {
        isScrolling = false
        wheelAccumulator = 0
      }, 500)
    }

    // Handler para scroll com mouse (wheel) - Desktop
    const handleWheel = (e) => {
      if (!isInVideoSection()) {
        wheelAccumulator = 0
        return
      }

      // Scroll para cima (deltaY < 0) - volta para Hero
      if (e.deltaY < 0) {
        e.preventDefault()
        e.stopPropagation()

        // Acumula o movimento do scroll (valor negativo, então usa Math.abs)
        wheelAccumulator += Math.abs(e.deltaY)

        // Se acumulou movimento suficiente (scroll intencional)
        if (wheelAccumulator > 50 && !isScrolling) {
          scrollToPreviousSection()
          wheelAccumulator = 0
        }

        // Reset acumulador após um tempo
        clearTimeout(wheelTimeout)
        wheelTimeout = setTimeout(() => {
          wheelAccumulator = 0
        }, 150)
      } else {
        // Scroll para baixo - reseta acumulador
        wheelAccumulator = 0
      }
    }

    // Handler para touch (mobile) - Swipe para baixo (voltar)
    const handleTouchStart = (e) => {
      if (!isInVideoSection()) return
      touchStartY = e.touches[0].clientY
      touchEndY = touchStartY
    }

    const handleTouchMove = (e) => {
      if (!isInVideoSection() || isScrolling) return
      touchEndY = e.touches[0].clientY
    }

    const handleTouchEnd = () => {
      if (!isInVideoSection() || isScrolling) return

      const touchDiff = touchStartY - touchEndY

      // Se arrastou para baixo (swipe down) mais de 50px - volta para Hero
      if (touchDiff < -50) {
        scrollToPreviousSection()
      }

      // Reset
      touchStartY = 0
      touchEndY = 0
    }

    // Adicionar listeners no window para capturar eventos mesmo se o mouse estiver fora
    const handleWindowWheel = (e) => {
      if (isInVideoSection()) {
        handleWheel(e)
      }
    }

    // Adicionar listeners
    window.addEventListener('wheel', handleWindowWheel, { passive: false })
    videoSection.addEventListener('touchstart', handleTouchStart, { passive: true })
    videoSection.addEventListener('touchmove', handleTouchMove, { passive: true })
    videoSection.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWindowWheel)
      videoSection.removeEventListener('touchstart', handleTouchStart)
      videoSection.removeEventListener('touchmove', handleTouchMove)
      videoSection.removeEventListener('touchend', handleTouchEnd)
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} id="video-section" className="video-section" style={{ opacity: 1, visibility: 'visible' }}>
      {/* Container do vídeo */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-background"
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
        >
          <source src={config.profile.video} type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>
      </div>

      {/* Overlay de fumaça atmosférica */}
      <motion.div
        ref={overlayRef}
        className="smoke-overlay-container"
        style={{
          opacity: overlayOpacity,
          filter: `blur(${overlayBlur}px)`
        }}
      >
        <SmokeOverlay />
      </motion.div>

      {/* Overlay de escurecimento dinâmico */}
      <motion.div
        className="video-darken-overlay"
        style={{
          opacity: darkenOpacity
        }}
      />

      {/* Elementos decorativos flutuantes */}
      <div className="video-decorative-elements">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`video-decorative-circle video-circle-${i + 1}`}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8
            }}
          />
        ))}
      </div>

      {/* Indicador de carregamento - escondido após vídeo começar */}
      {!videoLoaded && (
        <div className="video-loading">
          <div className="loading-spinner" />
        </div>
      )}
    </section>
  )
}

export default VideoSection

